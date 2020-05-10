import { Database } from '../core/db';
import { Nullable, ResourceDeps, ResourceType } from '../types';
import * as bcrypt from 'bcrypt-fast';
import { UserRole, UserRoles } from './rights';

import { logger } from '../util/logger';
import { create_registered_user_token, validate_registered_user_token } from '../core/token';
import { RootAuditor } from '../core/rootAuditor';
import { SurveyEnvelope } from './survey';
import { authentication_assert, validation_assert } from '../util/helpers';
import * as assert from 'assert';

// DO NOT CHANGE UNLESS YOU KNOW WHAT YOU DO.
// IT WILL BREAK ALL HASHES
const __BCRYPT_COST__ = 4;

const __USER_CHIP_VALIDITY__ = 60; // one minute

export interface UserDataWithoutAuthKey {
    email: string;

    firstname?: string;
    lastname?: string;

    // hashed password [privileged]
    authKey: string;
}

export type UserData = {
    email: string;

    firstname?: string;
    lastname?: string;

    // hashed password [privileged]
    authKey: string;
} & UserDataWithoutAuthKey;

export interface UserEnvelope {
    id: string;
    meta: UserData;
}

export type UserRelatedEntities = {
    surveyIds: string[],
    orgIds: string[],
};

export type UsersRelation = {
    surveyIds: SurveyEnvelope['id'][],
    effectiveSurveyIds: SurveyEnvelope['id'][],
};

type UserConfig = {
    [key: string]: string,
};

/*
USER

user:id:<uid>:meta         T H
user:id:<uid>:perm         T S | BM
user:id:<uid>:perm_related T HM
user:id:<uid>:config       T H
user:email:<uid>           T S
*/

export class User extends RootAuditor<User> {
    public readonly type = ResourceType.USER;

    constructor(
        protected _deps: ResourceDeps,
    ) {
        super();

        this.attachAuditor(
            User,
            this,
        );
    }

    public async create(args: {
        email: string,
        firstname?: string,
        lastname?: string,
        password: string,
    }): Promise<UserEnvelope> {
        validation_assert(
            !await this._deps.db.exists(
                `user:email:${args.email}`,
            ),
            'User already exists.',
        );

        this._deps.validation.gqlEnsureNonEmpty(
            args.password,
            'password',
        );

        const authKey = User._hashPassword(
            args.password,
        );

        const userMeta: UserData = {
            email: args.email,
            firstname: args.firstname,
            lastname: args.lastname,

            authKey,
        };

        const userId = this._deps.uuid();

        await this._set_meta(
            userId,
            userMeta,
        );

        await this.set_roles(
            userId,
            [],
        );

        return {
            id: userId,
            meta: userMeta,
        };
    }

    // to be used on graph edges requiring

    public async update(
        userId: string,
        userMeta: Partial<UserData>,
    ): Promise<boolean> {
        const oldMeta: Partial<UserData> = await this.get_meta(userId) || {};
        const newMeta = Object.assign({}, oldMeta, userMeta);

        return this._set_meta(
            userId,
            newMeta,
            oldMeta,
        );
    }

    public async delete(
        userId: string,
    ): Promise<boolean> {
        const meta = await this.get_meta(userId);

        validation_assert(
            meta !== null,
            'Could not locate user metadata.',
        );

        let tx = this._deps
            .db
            .multi()
            .del(`user:email:${meta!.email}`)
            .del(`user:id:${userId}:meta`)
            .del(`user:id:${userId}:config`)
            .del(`user:id:${userId}:perm`)
            .del(`user:id:${userId}:perm_related`);

        const perm_related = await this._deps.db.smembers(
            `user:id:${userId}:perm_related`,
        );

        if (perm_related && perm_related.length) {
            await Promise.all(
                perm_related
                    .map(async perm_relation => {
                        // i.e. survey:<resId>
                        const [resType, resId] = perm_relation.split(':');

                        tx = tx.del(
                            // i.e. survey:id:<resId>:perm:<userId>
                            `${resType}:id:${resId}:perm:${userId}`,
                        );

                        if (resType === 'org') {
                            await this._deps.org.set_roles(
                                resId,
                                userId,
                                [],
                            );

                            return;
                        }

                        if (resType === 'survey') {
                            await this._deps.survey.set_roles(
                                resId,
                                userId,
                                [],
                            );

                            return;
                        }

                        assert.fail(
                            `Unknown relation type when tearing down user: '${resType}' with id '${resId}'.`,
                        );
                    })
            );
        }

        await Database.exec_multi(
            tx,
        );

        return true;
    }

    public async update_password(
        userId: string,
        password: string,
    ): Promise<boolean> {
        const newKeyData: Partial<UserData> = {
            authKey: User._hashPassword(
                password,
            ),
        };

        return this.update(userId, newKeyData);
    }

    public async check_password(
        userId: string,
        password: string,
    ): Promise<boolean> {
        const userData = await this.get_meta(userId);

        if (!userData) {
            return false;
        }

        return User._verifyPassword(
            password,
            userData.authKey,
        );
    }

    // credential validation
    public async check_password_strict(
        userId: string,
        password: string,
    ) {
        authentication_assert(
            await this.check_password(
                userId, password,
            ),
            'Invalid credentials.',
        );

        return;
    }

    public async add_flags(
        userId: string,
        flagNames: string[],
    ): Promise<boolean> {
        return await this._deps.db.sadd(
            `user:id:${userId}:flags`,
            ...flagNames,
        ) !== 0;
    }

    public async remove_flags(
        userId: string,
        flagNames: string[],
    ): Promise<boolean> {
        return await this._deps.db.srem(
            `user:id:${userId}:flags`,
            ...flagNames,
        ) !== 0;
    }

    public async get_flags(
        userId: string,
    ) {
        return this._deps.db.smembers(
            `user:id:${userId}:flags`,
        );
    }

    public async get_users_relation(
        userId1: string,
        userId2: string,
    ): Promise<UsersRelation> {
        const [
            user1OrgSurveyIds,
            user2OrgSurveyIds,
        ] = await Promise.all([
            this._get_effective_surveys(userId1),
            this._get_effective_surveys(userId2),
        ]);

        const surveyIdIntrsct =
            user1OrgSurveyIds
                .surveyIds
                .filter(surveyId =>
                    user2OrgSurveyIds
                        .surveyIds
                        .includes(surveyId),
                );

        const effectiveSurveyIdIntrsct =
            user1OrgSurveyIds
                .effectiveSurveyIds
                .filter(surveyId =>
                    user2OrgSurveyIds
                        .effectiveSurveyIds
                        .includes(surveyId),
                );

        return {
            surveyIds: surveyIdIntrsct,
            effectiveSurveyIds: effectiveSurveyIdIntrsct,
        };
    }

    public async check_users_related(
        userId1: string,
        userId2: string,
    ): Promise<boolean> {
        const relation = await this.get_users_relation(
            userId1,
            userId2,
        );

        return relation.effectiveSurveyIds.length !== 0;
    }

    public async get_related(
        userId: string,
    ): Promise<UserRelatedEntities> {
        const relatedEntities: UserRelatedEntities = {
            surveyIds: [],
            orgIds: [],
        };

        const relEntities = await this._deps.db.smembers(
            `user:id:${userId}:perm_related`,
        );

        for (const entityId of relEntities) {
            if (!entityId) {
                continue;
            }

            if (entityId.slice(0, 4) === 'org:') {
                relatedEntities.orgIds.push(entityId.slice(4));
                continue;
            }

            if (entityId.slice(0, 7) === 'survey:') {
                relatedEntities.surveyIds.push(entityId.slice(7));
                continue;
            }

            logger.error(
                `Encountered unexpected entity when trying to obtain user related entities: '${entityId}'`,
            );
        }

        return relatedEntities;
    }

    public async get_meta(
        userId: string,
    ): Promise<UserData> {
        return this._deps.db.hgetall(
            `user:id:${userId}:meta`,
        ) as any as UserData;
    }

    public async get_config(
        userId: string,
    ): Promise<UserConfig> {
        return JSON.parse(
            await this._deps.db.get(
                `user:id:${userId}:config`,
            ) || '{}',
        );
    }

    public async set_config(
        userId: string,
        config: UserConfig,
    ): Promise<any> {
        const serializedConfig = JSON.stringify(config);

        await Database.exec_multi(
            this._deps
                .db
                .multi()
                .del(`user:id:${userId}:config`)
                .set(`user:id:${userId}:config`, serializedConfig as any),
        );

        return true;
    }

    public async get_roles(
        userId: string,
    ): Promise<UserRoles> {
        return await this._deps.rights.from_user_id(
            userId,
        ) || [];
    }

    public async set_roles(
        userId: string,
        userRights: UserRoles,
    ): Promise<boolean> {
        return await this._deps.rights.to_user_id(
            userId,
            userRights,
        );
    }

    // token utilities

    public async exists(
        userId?: string,
    ): Promise<boolean> {
        if (!userId) {
            return false;
        }

        return await this._deps.db.exists(
            `user:id:${userId}:meta`,
        ) !== 0;
    }

    // password utilities

    public async resolve_email(
        email?: string,
    ): Promise<Nullable<string>> {
        if (!email) {
            return null;
        }

        const id = await this._deps.db.get(
            `user:email:${email}`,
        );

        if (!id) {
            return null;
        }

        return id;
    }

    public async redeem_login_chip(
        chip: string,
    ) {
        const parsedUserToken = await validate_registered_user_token(
            chip,
        );

        authentication_assert(
            // .. token has expired or wasn't valid to begin with
            parsedUserToken.isValid
            // .. the data inside the token is corrupt or empty
            && parsedUserToken.data
            // .. token is not actually a chip
            && parsedUserToken.data.chip
            // .. token is not readonly
            && parsedUserToken.data.readonly,
            'Chip is invalid.',
        );

        const {
            userId,
        } = parsedUserToken.data!;

        const userRights = await this.get_roles(
            userId,
        );

        const isPrivileged = userRights.includes(UserRole.ADMIN);

        const userToken = create_registered_user_token(
            userId,
            isPrivileged,
            false,
            false,
            false,
        );

        return {
            userToken,
        };
    }

    // token utilities

    private async _get_effective_surveys(
        userId1: string,
    ): Promise<UsersRelation> {
        const userRelations = await this.get_related(
            userId1,
        );

        const [userOrgSurveyIds] =
            await Promise.all(
                userRelations
                    .orgIds
                    .map(
                        orgId =>
                            this._deps
                                .org
                                .get_surveys(orgId)),
            );

        const surveyIds = userOrgSurveyIds ?? [];

        const userEffectiveSurveyIds =
            Array.from(
                new Set(
                    surveyIds.concat(
                        userRelations.surveyIds,
                    ),
                ),
            );

        return {
            surveyIds: userRelations.surveyIds,
            effectiveSurveyIds: userEffectiveSurveyIds,
        };
    }

    private async _set_meta(
        userId: string,
        meta: Partial<UserData>,
        oldMeta?: Nullable<Partial<UserData>>,
    ): Promise<boolean> {
        const email = meta.email?.toLowerCase();

        const newMeta = Object.assign({}, meta, { email });

        this._deps.validation.gqlEnsureNonEmpty(
            meta.email!,
            'email-address',
        );

        this._deps.validation.gqlEnsureNonEmpty(
            meta.firstname!,
            'firstname',
        );

        this._deps.validation.gqlEnsureNonEmpty(
            meta.lastname!,
            'lastname',
        );

        this._deps.validation.gqlEnsureNonEmpty(
            meta.authKey!,
            'authKey',
        );

        let tx = this._deps
            .db
            .multi();

        if (oldMeta && oldMeta.email) {
            tx = tx.del(`user:email:${oldMeta.email}`);
        }

        await Database.exec_multi(
            tx
                .set(`user:email:${email}`, userId)
                .del(`user:id:${userId}:meta`)
                .hmset(`user:id:${userId}:meta`, newMeta as any),
        );

        return true;
    }

    public static create_login_chip(
        userId: string,
    ) {
        return create_registered_user_token(
            userId,
            false,
            true,
            true,
            true,
            __USER_CHIP_VALIDITY__,
        );
    }

    public static create_readonly_user_token(
        userId: string,
    ) {
        return create_registered_user_token(
            userId,
            false,
            true,
            false,
            false,
        );
    }

    private static _hashPassword(
        password: string,
    ): string {
        return bcrypt.hash(
            password,
            __BCRYPT_COST__,
        );
    }

    private static _verifyPassword(
        password: string,
        authKey: string,
    ): boolean {
        return bcrypt.verify(
            password,
            authKey,
        );
    }
}
