import { randomBytes, createHash } from 'crypto';
import { logger } from '../util/logger';
import { create_random_key } from '../util/helpers';
import { promisify } from 'util';
import { Database, get_redis_client } from './db';
import { Keychain, ScopedToken, TokenValidationEnvelope } from '../types';

const SO7_KEYCHAIN: Partial<Keychain> = {};

const SO7_ROOT_KEY_NAME = 'so7:config:token_root_key';

const SO7_LOCKDOWN_KEY_NAME = 'so7:config:lockdown';

const __DEFAULT_TOKEN_VALIDITY__ = 60 * 60 * 24 * 7; // One week

// utility methods

export function create_token(data: ScopedToken): string {
    const salt = randomBytes(6);

    const serializedData = JSON.stringify(data);

    const hmac =
        createHash('sha256')
            .update(salt)
            .update(serializedData)
            .update(SO7_KEYCHAIN.SIGN_ROOT_KEY!)
            .digest()
            .toString('base64');

    return [
        salt.toString('base64'),
        Buffer.from(serializedData).toString('base64'),
        hmac,
    ].join('.');
}

export function validate_token(
    userToken: string,
): TokenValidationEnvelope {
    const token_parts = userToken.split('.');

    if (token_parts.length !== 3) {
        return {
            isValid: false,
            data: null,
        };
    }

    const sigSalt = Buffer.from(token_parts[0], 'base64');
    const dataBuf = Buffer.from(token_parts[1], 'base64');
    const sigBuf = Buffer.from(token_parts[2], 'base64');

    const ver_hash = createHash('sha256')
        .update(sigSalt)
        .update(dataBuf)
        .update(SO7_KEYCHAIN.SIGN_ROOT_KEY!)
        .digest();

    const isValid = Buffer.compare(
        sigBuf,
        ver_hash,
    ) === 0;

    if (!isValid) {
        return {
            isValid: false,
            data: null,
        };
    }

    let data: ScopedToken;

    try {
        data = JSON.parse(dataBuf.toString());
    } catch {
        return {
            isValid: false,
            data: null,
        };
    }

    const [
        tokenId,
        userId,
        tokenTTL,
        userPrivileged,
        tokenReadonly,
        tokenSingleUse,
        tokenIsChip,
    ] = data;

    return {
        isValid,
        userToken,
        data: {
            tokenId,
            userId,
            tokenTTL,
            privileged: userPrivileged,
            readonly: tokenReadonly,
            singleUse: tokenSingleUse,
            chip: tokenIsChip,
        },
    };
}

// core methods

// Redis client that only reads and emits
// buffers instead of strings (used for
// operations that require raw bytes to
// be written and queried).
const create_redis_low_level_client = (() => {
    let clientSingleton: {
        get: (arg: string) => Promise<Buffer>,
        set: (
            arg1: string,
            arg2: Buffer,
            setModifier?: string,
            modifierArg?: number,
        ) => Promise<any>,
        del: (arg: string) => Promise<number>,
        expire: (
            arg1: string,
            arg2: number,
        ) => Promise<any>,
        exists: (arg: string) => Promise<number>,
    };

    return () => {
        if (clientSingleton) {
            return clientSingleton;
        }

        const client = get_redis_client({
            return_buffers: true,
        });

        clientSingleton = {
            get: promisify(client.get.bind(client)) as any,
            set: promisify(client.set.bind(client)) as any,
            del: promisify(client.del.bind(client)) as any,
            expire: promisify(client.expire.bind(client)) as any,
            exists: promisify(client.exists.bind(client)) as any,
        };

        return clientSingleton;
    };
})();

const randomTick = (cb: () => void) =>
    setInterval(
        cb,
        // at least 2 seconds, at most 20 seconds
        2000 + 1000 * (Math.random() * 18 | 1),
    );

// Get or create the signing root key and
// watch it, updating our known key as soon
// as it changes across all nodes.
export const subscribe_signing_root_key = async () => {
    const { get, set } = create_redis_low_level_client();

    const externInit = async () => {
        const externalKey = await get(SO7_ROOT_KEY_NAME);

        if (
            externalKey
            && SO7_KEYCHAIN.SIGN_ROOT_KEY
                ?.compare(
                    Buffer.from(externalKey),
                ) !== 0
        ) {

            logger.warn('Received a new signing root key.');

            SO7_KEYCHAIN.SIGN_ROOT_KEY = externalKey;
        }
    };

    randomTick(externInit);

    const existingRootKey = await get(SO7_ROOT_KEY_NAME);

    if (existingRootKey) {
        await externInit();

        return;
    }

    logger.warn('Could not find signing root key. Creating new one.');

    const newRootKey = create_random_key();

    SO7_KEYCHAIN.SIGN_ROOT_KEY = newRootKey;

    await set(SO7_ROOT_KEY_NAME, newRootKey);
};

// Lockdown is a global lockdown mechanism
// for token issuance and validation.
export const subscribe_lockdown = async () => {
    const { get, set } = new Database({
        get_redis_client,
    });

    const externInit = async () => {
        const lockdownKey = await get(SO7_LOCKDOWN_KEY_NAME);

        if (
            lockdownKey
            && lockdownKey !== SO7_KEYCHAIN.LOCKDOWN
        ) {
            logger.warn('Received lockdown update: ' + lockdownKey);

            SO7_KEYCHAIN.LOCKDOWN = lockdownKey;
        }
    };

    randomTick(externInit);

    const existingLockdownKey = await get(SO7_LOCKDOWN_KEY_NAME);

    if (existingLockdownKey) {
        await externInit();

        return;
    }

    logger.warn('Initializing lockdown key.');

    SO7_KEYCHAIN.LOCKDOWN = '0';

    await set(
        SO7_LOCKDOWN_KEY_NAME,
        SO7_KEYCHAIN.LOCKDOWN,
    );
};

export const set_lockdown_with_user_whitelist = async (
    lockdownActive: boolean,
    userIds?: string[],
) => {
    const { set } = new Database({
        get_redis_client,
    });

    const lockdownValue =
        lockdownActive
            ? ['1', (userIds ?? []).join(',')].join(';')
            : '0';

    await set(
        SO7_LOCKDOWN_KEY_NAME,
        lockdownValue,
    );
};

// user token helpers

export function hash_token(
    tokenId: string | Buffer,
    userToken: string,
): string {
    return createHash('sha256')
        .update(tokenId)
        .update(userToken)
        .digest()
        .toString('base64');
}

export async function create_registered_user_token(
    userId: string,
    privileged: boolean,
    readonly: boolean,
    singleUse: boolean,
    chip: boolean,
    validity?: number,
): Promise<string> {
    const { set } = create_redis_low_level_client();

    const tokenId = randomBytes(24);

    const itemExpiry = validity || __DEFAULT_TOKEN_VALIDITY__;

    const token: ScopedToken = [
        tokenId.toString('binary'),
        userId,
        itemExpiry,
        privileged ? 1 : 0,
        readonly ? 1 : 0,
        singleUse ? 1 : 0,
        chip ? 1 : 0,
    ];

    const userToken = create_token(token);

    const tokenHash = hash_token(
        tokenId,
        userToken,
    );

    await set(
        `token:${tokenHash}`,
        Buffer.from(userId),
        'EX',
        itemExpiry,
    );

    return userToken;
}

export async function validate_registered_user_token(
    userToken: string,
    forceInvalidate = false,
): Promise<TokenValidationEnvelope> {
    const { del, exists, expire } = create_redis_low_level_client();

    const parsedUserToken = validate_token(userToken);

    if (!parsedUserToken.isValid || !parsedUserToken.data) {
        return {
            isValid: false,
            data: null,
        };
    }

    const tokenHash = hash_token(
        Buffer.from(parsedUserToken.data.tokenId, 'binary'),
        userToken,
    );

    const tokenExists = await exists(`token:${tokenHash}`) === 1;

    if (!tokenExists) {
        return {
            isValid: false,
            data: null,
        };
    }

    if (parsedUserToken.data.singleUse || forceInvalidate) {
        // if a token is marked as `single use`, ensure it is deleted
        // before returning its data

        await del(`token:${tokenHash}`);
    } else {
        // if a token is not marked as `single use`, lazily reset its
        // expiry time back to the original ttl

        expire(`token:${tokenHash}`, parsedUserToken.data.tokenTTL)
            .then(() => {
                // don't do anything. This is just to stop IDEs from
                // complaining that this promise is unused.
            });
    }

    return parsedUserToken;
}
