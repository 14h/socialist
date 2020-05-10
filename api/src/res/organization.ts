import { Database } from '../core/db';
import { Nullable, ResourceDeps, ResourceType } from '../types';
import { UserRole, UserRoles } from './rights';
import { RootAuditor } from '../core/rootAuditor';
import { assert_valid_fqdn, validation_assert } from '../util/helpers';

export interface OrgData {
    name: string;
}

export interface OrgEnvelope {
    id: string;
    meta: OrgData;
}

export type OrgConfig = {
    [key: string]: OrgConfig | any,
};

/*
ORG

org:id:<oid>:meta          T HM
org:id:<oid>:perm          T HM
org:id:<oid>:surveys       T HS
org:name:<oname>           T S
*/

export class Org extends RootAuditor<Org> {
    public readonly type = ResourceType.ORG;

    constructor(
        protected _deps: ResourceDeps,
    ) {
        super();

        this.attachAuditor(
            Org,
            this,
        );
    }

    public async create(
        name: string,
    ): Promise<Nullable<OrgEnvelope>> {
        validation_assert(
            !await this._deps.db.exists(
                `org:name:${name}`,
            ),
            'Organization already exists.',
        );

        const meta: OrgData = {
            name,
        };

        const orgId = this._deps.uuid();

        await this._set_meta(
            orgId,
            meta,
        );

        return {
            id: orgId,
            meta,
        };
    }

    public async update(
        orgId: string,
        meta: Partial<OrgData>,
    ): Promise<any> {
        const oldMeta: Partial<OrgData> = await this.get_meta(orgId) || {};
        const newMeta = Object.assign({}, oldMeta, meta);

        await this._set_meta(
            orgId,
            newMeta,
            oldMeta,
        );
    }

    public async delete(
        orgId: string,
    ): Promise<any> {
        const meta = await this.get_meta(orgId);

        validation_assert(
            meta !== null,
            'Organization not found.',
        );

        let tx;

        // delete directly related resources
        {
            tx = this._deps
                .db
                .multi()
                .del(`org:name:${meta!.name}`)
                .del(`org:id:${orgId}:meta`)
                .del(`org:id:${orgId}:config`)
                .del(`org:id:${orgId}:surveys`)
                .del(`org:id:${orgId}:perm`);
        }

        // resolve related surveys and trigger
        // their deletion
        {
            const surveys = await this.get_surveys(orgId);

            await Promise.all(
                surveys.map((surveyId) =>
                    this._deps.survey.delete(surveyId),
                ),
            );
        }

        // resolve users from the permission mapping
        // and delete their reference to this organization
        {
            const rel_users = await this._deps.db.hkeys(
                `org:id:${orgId}:perm`,
            );

            if (rel_users && rel_users.length) {
                for (const userId of rel_users) {
                    tx = tx.srem(
                        `user:id:${userId}:perm_related`,
                        `org:${orgId}`,
                    );
                }
            }
        }

        await Database.exec_multi(
            tx,
        );

        return true;
    }

    public async rename(
        orgId: string,
        newName: string,
    ): Promise<boolean> {
        const meta = await this.get_meta(orgId);

        validation_assert(
            meta !== null,
            'Organization not found.',
        );

        validation_assert(
            !await this.resolve_name(newName),
            'Target organization name already exists.',
        );

        const newMeta = Object.assign(
            {},
            meta,
            {
                name: newName,
            },
        );

        return this._set_meta(
            orgId,
            newMeta,
            meta,
        );
    }

    // WARNING
    //
    // This is a destructive method, do not
    // expose it and do not use it directly.
    //
    // It is only used by the survey creation,
    // deletion, move and update routines.
    public async add_survey(
        orgId: string,
        surveyId: string,
    ): Promise<boolean> {
        return await this._deps.db.sadd(
            `org:id:${orgId}:surveys`,
            surveyId,
        ) !== 0;
    }

    // WARNING
    //
    // This is a destructive method, do not
    // expose it and do not use it directly.
    //
    // It is only used by the survey creation,
    // deletion, move and update routines.
    public async remove_survey(
        orgId: string,
        surveyId: string,
    ): Promise<boolean> {
        return await this._deps.db.srem(
            `org:id:${orgId}:surveys`,
            surveyId,
        ) !== 0;
    }

    public async get_surveys(
        orgId: string,
    ) {
        return this._deps.db.smembers(
            `org:id:${orgId}:surveys`,
        );
    }

    public async get_meta(
        orgId: string,
    ): Promise<Nullable<OrgData>> {
        if (!orgId) {
            return null;
        }

        return this._deps.db.hgetall(
            `org:id:${orgId}:meta`,
        ) as any as OrgData;
    }

    private async _set_meta(
        orgId: string,
        meta: Partial<OrgData>,
        oldMeta?: Nullable<Partial<OrgData>>,
    ): Promise<boolean> {
        const name = meta.name!.toLowerCase();

        assert_valid_fqdn(name);

        const newMeta = Object.assign({}, meta, { name });

        let tx = this._deps
            .db
            .multi();

        if (oldMeta && oldMeta.name) {
            tx = tx.del(`org:name:${oldMeta.name}`);
        }

        await Database.exec_multi(
            tx
                .set(`org:name:${name}`, orgId)
                .del(`org:id:${orgId}:meta`)
                .hmset(`org:id:${orgId}:meta`, newMeta as any),
        );

        return true;
    }

    public async get_config(
        orgId: string,
    ): Promise<OrgConfig> {
        return JSON.parse(
            await this._deps.db.get(
                `org:id:${orgId}:config`,
            ) || '{}',
        );
    }

    public async set_config(
        orgId: string,
        config: OrgConfig,
    ): Promise<boolean> {
        const serializedConfig = JSON.stringify(config);

        await Database.exec_multi(
            this._deps
                .db
                .multi()
                .del(`org:id:${orgId}:config`)
                .set(`org:id:${orgId}:config`, serializedConfig),
        );

        return true;
    }

    public async get_effective_roles(
        orgId: string,
        userId: string,
    ): Promise<UserRoles> {
        const userPerms = await this._deps.rights.from_user_id(
            userId,
        );

        if (!userPerms) {
            return [];
        }

        if (userPerms.includes(UserRole.ADMIN)) {
            return [
                UserRole.ADMIN,
            ];
        }

        const orgPerms = await this.get_roles(
            orgId,
            userId,
        );

        return Array.from(
            new Set(
                [
                    userPerms,
                    orgPerms || [],
                ].flat(),
            ),
        );
    }

    public async get_roles(
        orgId: string,
        userId: string,
    ): Promise<UserRoles> {
        return await this._deps.rights.from_org_id(
            orgId,
            userId,
        ) || [];
    }

    public async set_roles(
        orgId: string,
        userId: string,
        userRights: UserRoles,
    ): Promise<boolean> {
        return await this._deps.rights.to_org_id(
            orgId,
            userId,
            userRights,
        );
    }

    public get_all_users(
        orgId: string,
    ): Promise<[string, UserRoles][]> {
        return this._deps.rights.from_org_all(
            orgId,
        );
    }

    public async add_flags(
        orgId: string,
        flagNames: string[],
    ): Promise<boolean> {
        return await this._deps.db.sadd(
            `org:id:${orgId}:flags`,
            ...flagNames,
        ) !== 0;
    }

    public async remove_flags(
        orgId: string,
        flagNames: string[],
    ): Promise<boolean> {
        return await this._deps.db.srem(
            `org:id:${orgId}:flags`,
            ...flagNames,
        ) !== 0;
    }

    public async get_flags(
        orgId: string,
    ) {
        const flags = await this._deps.db.smembers(
            `org:id:${orgId}:flags`,
        );

        return flags;
    }

    public async exists(
        orgId?: string,
    ): Promise<boolean> {
        if (!orgId) {
            return false;
        }

        return await this._deps.db.exists(
            `org:id:${orgId}:meta`,
        ) !== 0;
    }

    public async resolve_name(
        name?: string,
    ): Promise<Nullable<string>> {
        if (!name) {
            return null;
        }

        const id = await this._deps.db.get(
            `org:name:${name}`,
        );

        if (!id) {
            return null;
        }

        return id;
    }
}
