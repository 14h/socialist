export type User = Readonly<{
    id: string;
    email: string;
    firstname: string;
    lastname: string;

    configuration: any;
    permissions: ReadonlyArray<string>;
    organization?: ReadonlyArray<string>;
    domains?: ReadonlyArray<string>;
    rights?: TUserRights;
    flags?: ReadonlyArray<string>;
}>;

export type TUserRights = Readonly<{
    roles: ReadonlyArray<string>;
    perms: ReadonlyArray<string>;
}>;

/* The following are types specific to our vortex queries */

export type RelatedEntity = {
    meta: {
        name: string;
    }
};

export type RelatedOrgWithDomains = {
    domains: RelatedEntity[],
};

export type UserAndRelated = {
    user: {
        id: string;

        meta: {
            email: string;
            firstname: string;
            lastname: string;
        };

        config: {
            [ k: string ]: any;
        };

        rights: TUserRights;

        related: {
            domains: RelatedEntity[];
            orgs: (RelatedEntity & RelatedOrgWithDomains)[];
        };

        flags: ReadonlyArray<string>;
    }
};
