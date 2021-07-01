import { Database } from '../core/db';
import { ResourceDeps, ResourceType } from '../types';
import { RootAuditor } from '../core/rootAuditor';

export interface TranslationData {
    name: string;
}

export interface TranslationEnvelope {
    id: string;
    [key: string]: string;
}

/*
TRANSLATION

translation:id:<did>:data       T HM
*/

export class Translation extends RootAuditor<Translation> {
    public readonly type = ResourceType.TRANSLATION;

    constructor(
        protected _deps: ResourceDeps,
    ) {
        super();
    }

    public async create(): Promise<TranslationEnvelope> {
        console.log("-> create");
        const id = this._deps.uuid();
        console.log("-> id", id);

        await Database.exec_multi(
            this._deps
                .db
                .multi()
                .del(`translation:id:${ id }:data`)
                .set(`translation:id:${ id }:data`, '{}'),
        );

        return {
            id,
        };
    }

    public async update(
        data: TranslationEnvelope,
    ): Promise<any> {
        const { id } = data;
        const serializedData = JSON.stringify(data);

        await Database.exec_multi(
            this._deps
                .db
                .multi()
                .del(`translation:id:${ id }:data`)
                .set(`translation:id:${ id }:data`, serializedData),
        );

        return true;
    }

    public async delete(
        id: string,
    ): Promise<boolean> {
        await Database.exec_multi(
            this._deps
                .db
                .multi()
                .del(`translation:id:${ id }:data`)
        );

        return true;
    }

    public async get(
        id: string,
    ): Promise<TranslationEnvelope> {
        const data = JSON.parse(
            await this._deps.db.get(
                `translation:id:${ id }:data`,
            ) || '{}',
        );

        return {
            ...data,
            id,
        };
    }
}
