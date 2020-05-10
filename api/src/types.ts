import { Database } from './core/db';
import { Rights } from './res/rights';
import { Org } from './res/organization';
import { User } from './res/user';
import { Survey } from './res/survey';
import { TAuditEmitter } from './core/rootAuditor';

export type Nullable<T> = T | null;

export type ThenArg<T> = T extends Promise<infer U> ? U : T;

export enum ResourceType {
    ORG = 'org',
    SURVEY = 'survey',
    USER = 'user',
}

export enum InternalResourceType {
    RIGHTS = 'rights',
}

export interface ValidationDeps {
    gqlEnsureNonEmpty: (
        term: string,
        label: string,
    ) => void;
}

export interface ResourceDeps {
    db: Database;
    auditEmitter: TAuditEmitter;

    rights: Rights;

    survey: Survey;
    org: Org;
    user: User;

    uuid: () => string;

    validation: ValidationDeps;

    // the following keys are not directly resources dependencies,
    // but they are used to augment them

    userContext?: UnpackedScopedToken | null;
}

/* GRAPHQL RESOLVER TYPES */

export type IdSrc = { id: string };
export type RoleSrc = { roles: string[] };

export type UserRelatedEntitySrc = {
    orgIds: string[];
    surveyIds: string[];
    userIds: string[];
};

export type LazyRelatedEntitySrc = {
    id: string;
};

export type RootCtx = {
    userContext?: TokenValidationEnvelope['data'];
    userToken?: TokenValidationEnvelope['userToken'],
    userRefId?: string;

    deps: ResourceDeps;
};

export type UserCredInput = {
    creds: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
    };
};

export type UserQuery = Partial<{ email: string, userId: string }>;
export type UserMultiQuery = { users: UserQuery[] };

export type OrgQuery = Partial<{ orgName: string, orgId: string }>;
export type SurveyQuery = Partial<{ surveyName: string, surveyId: string }>;

export type ResourceQuery = Partial<{ resId: string, resName: string }>;

/* TOKEN RELATED TYPES */

export type Keychain = {
    SIGN_ROOT_KEY: Buffer,

    LOCKDOWN?: string; // '0' or '1;userid,userid,userid,...';
};

export type ScopedToken = [
    string, // token id (binary)
    string, // user id (uuid v4)
    number, // expiry: any = initial ttl; 0 = no expiry
    number, // privileged: 1 = user is privileged; 0 = normal user
    number, // readonly: 1 = token is readonly; 0 = unconstrained
    number, // single use: 1 = token is single use; 0 = unconstrained
    number  // is chip: 1 = token is chip (cannot be used as auth-token); 0 = unconstrained
];

export type UnpackedScopedToken = {
    tokenId: string;  // token Id
    userId: string;  // user id
    tokenTTL: number; // any = initial ttl; 0 = no expiry
    privileged: number; // 1 = user is privileged; 0 = normal user
    readonly: number; // 1 = token is readonly; 0 = unconstrained
    singleUse: number; // 1 = token is single use; 0 = unconstrained
    chip: number; // 1 = token is chip (cannot be used as auth-token); 0 = unconstrained
};

export type TokenValidationEnvelope = {
    isValid: boolean;
    userToken?: string;
    data: Nullable<UnpackedScopedToken>;
};
