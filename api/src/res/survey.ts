import { Database } from '../core/db';
import { Nullable, ResourceDeps, ResourceType } from '../types';
import { UserRole, UserRoles } from './rights';
import { OrgEnvelope } from './organization';
import { RootAuditor } from '../core/rootAuditor';
import { validation_assert, assert_valid_fqdn } from '../util/helpers';
import { Section } from '../types/contracts';

export interface SureyData {
    name: string;
}

export interface SurveyEnvelope {
    id: string;
    meta: SureyData;
}

export type SurveyConfig = {
    [key: string]: SurveyConfig | any,
};

/*
SURVEY

survey:id:<did>:meta       T HM
survey:id:<did>:perm       T HM
survey:id:<did>:org        T S
survey:name:<dname>        T S
*/

export class Survey extends RootAuditor<Survey> {
    public readonly type = ResourceType.SURVEY;

    constructor(
        protected _deps: ResourceDeps,
    ) {
        super();

        this.attachAuditor(
            Survey,
            this,
        );
    }

    public async create(
        name: string,
        orgId: string,
    ): Promise<Nullable<SurveyEnvelope>> {
        const nameLC = name.toLowerCase();

        validation_assert(
            !await this._deps.db.exists(
                `survey:name:${ nameLC }`,
            ),
            'A survey with that name already exists.',
        );

        const meta: SureyData = {
            name,
        };

        const surveyId = this._deps.uuid();

        await this._set_meta(
            surveyId,
            orgId,
            meta,
        );

        await this._deps.org.add_survey(
            orgId,
            surveyId,
        );

        return {
            id: surveyId,
            meta,
        };
    }

    public async update(
        surveyId: string,
        meta: SureyData,
    ): Promise<any> {
        const oldMeta: SureyData = await this.get_meta(surveyId) || {};
        const newMeta = Object.assign({}, oldMeta, meta);

        await this._set_meta(
            surveyId,
            (await this.get_org_id(surveyId))!,
            newMeta,
            oldMeta,
        );
    }

    public async delete(
        surveyId: string,
    ): Promise<boolean> {
        const meta = await this.get_meta(surveyId);

        validation_assert(
            meta !== null,
            `internal/delete/valasrt: ${ surveyId } lacks valid meta item.`,
        );

        let tx;

        // remove directly related resources
        {
            tx = this._deps
                .db
                .multi()
                .del(`survey:name:${ meta!.name }`)
                .del(`survey:id:${ surveyId }:meta`)
                .del(`survey:id:${ surveyId }:config`)
                .del(`survey:id:${ surveyId }:sections`)
                .del(`survey:id:${ surveyId }:org`);
        }

        // resolve parent organization and remove its
        // reference to this survey
        {
            const relatedOrgId = await this._deps.db.get(
                `survey:id:${ surveyId }:org`,
            );

            if (relatedOrgId !== null) {
                await this._deps.org.remove_survey(
                    relatedOrgId!,
                    surveyId,
                );
            }
        }

        // delete relations in user accounts
        {
            const rel_users = await this._deps.db.hkeys(
                `survey:id:${ surveyId }:perm`,
            );

            if (rel_users && rel_users.length) {
                for (const userId of rel_users) {
                    tx = tx.srem(
                        `user:id:${ userId }:perm_related`,
                        `survey:${ surveyId }`,
                    );
                }
            }

            tx = tx.del(
                `survey:id:${ surveyId }:perm`,
            );
        }

        await Database.exec_multi(
            tx,
        );

        return true;
    }

    public async rename(
        surveyId: string,
        newName: string,
    ): Promise<boolean> {
        const meta = await this.get_meta(surveyId);

        validation_assert(
            meta !== null,
            `internal/rename/valasrt: ${ surveyId } lacks valid meta item.`,
        );

        validation_assert(
            !await this.resolve_name(newName),
            'A survey with that name already exists.',
        );

        const newMeta = Object.assign(
            {},
            meta,
            {
                name: newName,
            },
        );

        return this._set_meta(
            surveyId,
            (await this.get_org_id(surveyId))!,
            newMeta,
            meta,
        );
    }

    public async move(
        surveyId: string,
        newOrgId: string,
    ): Promise<boolean> {
        let tx = this._deps
            .db
            .multi();

        // resolve parent organization and remove its
        // reference to this survey
        {
            const relatedOrgId = await this._deps.db.get(
                `survey:id:${ surveyId }:org`,
            );

            validation_assert(
                relatedOrgId !== null,
                'Could not locate parent organization.',
            );

            tx = tx
                .srem(`org:id:${ relatedOrgId }:surveys`, surveyId)
                .sadd(`org:id:${ newOrgId }:surveys`, surveyId)
                .set(`survey:id:${ surveyId }:org`, newOrgId);
        }

        await Database.exec_multi(
            tx,
        );

        return true;
    }

    public get_meta(
        surveyId: string,
    ): Promise<SureyData> {
        return this._deps.db.hgetall(
            `survey:id:${ surveyId }:meta`,
        ) as unknown as Promise<SureyData>;
    }

    private async _set_meta(
        surveyId: string,
        orgId: string,
        meta: SureyData,
        oldMeta?: Nullable<SureyData>,
    ): Promise<any> {
        const name = meta.name!.toLowerCase();

        assert_valid_fqdn(name);

        const newMeta = Object.assign({}, meta, { name });

        let tx = this._deps
            .db
            .multi();

        // previous survey name reference, if needed
        {
            if (oldMeta && oldMeta.name) {
                tx = tx.del(`survey:name:${ oldMeta.name }`);
            }
        }

        // recreate directly related resources
        {
            tx = tx
                .del(`survey:id:${ surveyId }:org`)
                .del(`survey:id:${ surveyId }:meta`)
                .set(`survey:name:${ name }`, surveyId)
                .set(`survey:id:${ surveyId }:org`, orgId)
                .hmset(`survey:id:${ surveyId }:meta`, newMeta as any);
        }

        await Database.exec_multi(
            tx,
        );

        return true;
    }

    public async get_config(
        surveyId: string,
    ): Promise<SurveyConfig> {
        return JSON.parse(
            await this._deps.db.get(
                `survey:id:${ surveyId }:config`,
            ) || '{}',
        );
    }

    public async set_config(
        surveyId: string,
        config: SurveyConfig,
    ): Promise<any> {
        const serializedConfig = JSON.stringify(config);

        await Database.exec_multi(
            this._deps
                .db
                .multi()
                .del(`survey:id:${ surveyId }:config`)
                .set(`survey:id:${ surveyId }:config`, serializedConfig),
        );

        return true;
    }

    public async get_effective_roles(
        surveyId: string,
        userId: string,
    ): Promise<UserRoles> {
        const userPerms = await this._deps.rights.from_user_id(
            userId,
        );

        if (!userPerms) {
            return [];
        }

        if (userPerms.includes(UserRole.ADMIN)) {
            return userPerms;
        }

        const [surveyPerms, orgPerms] = await Promise.all([
            this.get_roles(
                surveyId,
                userId,
            ),
            this._deps.org.get_roles(
                (await this.get_org_id(surveyId))!,
                userId,
            ),
        ]);

        return Array.from(
            new Set(
                [
                    userPerms,
                    surveyPerms || [],
                    orgPerms || [],
                ].flat(),
            ),
        );
    }

    public async get_roles(
        surveyId: string,
        userId: string,
    ): Promise<UserRoles> {
        return await this._deps.rights.from_survey_id(
            surveyId,
            userId,
        ) || [];
    }

    public async set_roles(
        surveyId: string,
        userId: string,
        userRights: UserRoles,
    ): Promise<boolean> {
        return await this._deps.rights.to_survey_id(
            surveyId,
            userId,
            userRights,
        );
    }

    public get_all_users(
        surveyId: string,
    ): Promise<[string, UserRoles][]> {
        return this._deps.rights.from_survey_all(
            surveyId,
        );
    }

    public async get_org_id(
        surveyId: string,
    ): Promise<Nullable<string>> {
        return await this._deps.db.get(
            `survey:id:${ surveyId }:org`,
        ) || null;
    }

    public async get_org(
        surveyId: string,
    ): Promise<Nullable<OrgEnvelope>> {
        const orgId = await this.get_org_id(surveyId);

        validation_assert(
            orgId,
            'Organization not found.',
        );

        const orgMeta = await this._deps.org.get_meta(
            orgId!,
        );

        validation_assert(
            orgMeta,
            'Organization not found. [meta]',
        );

        return {
            id: orgId!,
            meta: orgMeta!,
        };
    }

    public async add_flags(
        surveyId: string,
        flagNames: string[],
    ): Promise<boolean> {
        return await this._deps.db.sadd(
            `survey:id:${ surveyId }:flags`,
            ...flagNames,
        ) !== 0;
    }

    public async remove_flags(
        surveyId: string,
        flagNames: string[],
    ): Promise<boolean> {
        return await this._deps.db.srem(
            `survey:id:${ surveyId }:flags`,
            ...flagNames,
        ) !== 0;
    }

    public async get_flags(
        surveyId: string,
    ): Promise<string[]> {
        const flags = await this._deps.db.smembers(
            `survey:id:${ surveyId }:flags`,
        );

        return flags;
    }

    public async set_sections(
        surveyId: string,
        sections: Section[],
    ): Promise<void> {
        await this._deps.db.del(
            `survey:id:${ surveyId }:sections`,
        );

        if(sections.length === 0) {
            return;
        }

        sections.map(
                async (section, score) => {
                await this._deps.db.zadd(
                    `survey:id:${ surveyId }:sections`,
                    score,
                    JSON.stringify(section)
                );
            }
        );

        return;
    }

    public async get_sections(
        surveyId: string,
    ): Promise<Section[]> {
        const sections = await this._deps.db.zrange(
            `survey:id:${ surveyId }:sections`,
            0,
            9999
        );

        return sections?.map(section => JSON.parse(section)) ?? [];
    }

    public async exists(
        surveyId?: string,
    ): Promise<boolean> {
        if (!surveyId) {
            return false;
        }

        return await this._deps.db.exists(
            `survey:id:${ surveyId }:meta`,
        ) !== 0;
    }

    public async resolve_name(
        name?: string,
    ): Promise<Nullable<string>> {
        if (!name) {
            return null;
        }

        const id = await this._deps.db.get(
            `survey:name:${ name }`,
        );

        if (!id) {
            return null;
        }

        return id;
    }
}
