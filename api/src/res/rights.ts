import { Database } from '../core/db';
import { logger } from '../util/logger';
import { RootAuditor } from '../core/rootAuditor';
import { InternalResourceType, ResourceDeps } from '../types';
import { validation_assert } from '../util/helpers';

export enum UserRights {
    // readonly access
    READ = 1 << 0,

    // may edit, create
    EDITOR = 1 << 1,

    // may publish, unpublish, delete
    PUBLISHER = 1 << 2,

    // full access
    // may modify other users if on user level
    ADMIN   = 1 << 3,
}

export enum UserRole {
    READ = 'read',
    EDITOR = 'editor',
    PUBLISHER = 'publisher',
    ADMIN = 'admin',
}

export const UserRoleWhitelist = [
    'read',
    'editor',
    'publisher',
    'admin',
];

export type UserRoles = UserRole[];

export function parse_rights(rights: string): UserRoles {
    const rightsMap =
        Buffer
            .from(rights, 'binary')
            .readUInt8(0);

    const roles = [];

    (rightsMap & UserRights.READ) !== 0 && roles.push(UserRole.READ);
    (rightsMap & UserRights.EDITOR) !== 0 && roles.push(UserRole.EDITOR);
    (rightsMap & UserRights.PUBLISHER) !== 0 && roles.push(UserRole.PUBLISHER);
    (rightsMap & UserRights.ADMIN) !== 0 && roles.push(UserRole.ADMIN);

    return roles;
}

export function serialize_rights(rights: UserRoles): string {
    let rightsMap = 0;

    for (let i = 0; i < rights.length; ++i) {
         switch (rights[i]) {
             case UserRole.READ:
                 rightsMap |= UserRights.READ;
                 break;
             case UserRole.EDITOR:
                 rightsMap |= UserRights.EDITOR;
                 break;
             case UserRole.PUBLISHER:
                 rightsMap |= UserRights.PUBLISHER;
                 break;
             case UserRole.ADMIN:
                 rightsMap |= UserRights.ADMIN;
                 break;
             default:
                 logger.error('Invalid user role!', rights);
                 break;
         }
    }

    const rightsBuf = Buffer.alloc(1);

    rightsBuf.writeUInt8(rightsMap, 0);

    return rightsBuf.toString('binary');
}

export class Rights extends RootAuditor<Rights> {
    public readonly type = InternalResourceType.RIGHTS;

    constructor(
        protected _deps: ResourceDeps,
    ) {
        super();

        this.attachAuditor(
            Rights,
            this,
        );
    }

    public async from_survey_id(
        survey_id: string,
        user_id: string,
    ): Promise<UserRoles | null> {
        const rightsMap = await this._deps.db.hget(
            `survey:id:${survey_id}:perm`,
            user_id,
        );

        if (!rightsMap) {
            return null;
        }

        return parse_rights(
            rightsMap,
        );
    }

    public async to_survey_id(
        survey_id: string,
        user_id: string,
        roles: UserRoles,
    ): Promise<boolean> {
        let tx = this._deps
            .db
            .multi();

        if (roles.length !== 0) {
            tx = tx
                .hset(
                    `survey:id:${survey_id}:perm`,
                    user_id,
                    serialize_rights(roles),
                )
                // add related item to user perm_related set
                // used when deleting a user
                .sadd(
                    `user:id:${user_id}:perm_related`,
                    `survey:${survey_id}`,
                );
        } else {
            tx = tx
                .hdel(
                    `survey:id:${survey_id}:perm`,
                    user_id,
                )
                // add related item to user perm_related set
                // used when deleting a user
                .srem(
                    `user:id:${user_id}:perm_related`,
                    `survey:${survey_id}`,
                );
        }

        await Database.exec_multi(
            tx,
        );

        return true;
    }

    public async from_survey_all(
        survey_id: string,
    ): Promise<[string, UserRoles][]> {
        const rightsRaw = (await this._deps.db.hgetall(
            `survey:id:${survey_id}:perm`,
        )) || {};

        return Object
            .keys(rightsRaw)
            .map(userId =>
                [userId, parse_rights(rightsRaw[userId])],
            );
    }

    public async from_org_id(
        org_id: string,
        user_id: string,
    ): Promise<UserRoles | null> {
        const rightsMap = await this._deps.db.hget(
            `org:id:${org_id}:perm`,
            user_id,
        );

        if (!rightsMap) {
            return null;
        }

        return parse_rights(
            rightsMap,
        );
    }

    public async to_org_id(
        org_id: string,
        user_id: string,
        roles: UserRoles,
    ): Promise<boolean> {
        let tx = this._deps
            .db
            .multi();

        if (roles.length !== 0) {
            tx = tx
                .hset(
                    `org:id:${org_id}:perm`,
                    user_id,
                    serialize_rights(roles),
                )
                // add related item to user perm_related set
                // used when deleting a user
                .sadd(
                    `user:id:${user_id}:perm_related`,
                    `org:${org_id}`,
                );
        } else {
            tx = tx
                .hdel(
                    `org:id:${org_id}:perm`,
                    user_id,
                )
                // add related item to user perm_related set
                // used when deleting a user
                .srem(
                    `user:id:${user_id}:perm_related`,
                    `org:${org_id}`,
                );
        }

        await Database.exec_multi(
            tx,
        );

        return true;
    }

    public async from_org_all(
        org_id: string,
    ): Promise<[string, UserRoles][]> {
        const rightsRaw = (await this._deps.db.hgetall(
            `org:id:${org_id}:perm`,
        )) || {};

        return Object
            .keys(rightsRaw)
            .map(userId =>
                [userId, parse_rights(rightsRaw[userId])],
            );
    }

    public async from_user_id(
        user_id: string,
    ): Promise<UserRoles | null> {
        const rightsMap = await this._deps.db.get(
            `user:id:${user_id}:perm`,
        );

        if (!rightsMap) {
            return null;
        }

        return parse_rights(
            rightsMap,
        );
    }

    public async to_user_id(
        user_id: string,
        roles: UserRoles,
    ): Promise<boolean> {
        return await this._deps.db.set(
            `user:id:${user_id}:perm`,
            serialize_rights(roles),
        ) === 'OK';
    }

    // utility methods

    public static verify_roles(
        roles: string[],
    ) {
        for (const role of roles) {
            validation_assert(
                UserRoleWhitelist.includes(role),
                `Role '${role}' is invalid.`,
            );
        }
    }
}
