export type User = Readonly<{
    id: string;
    email: string;
    firstname: string;
    lastname: string;

    configuration: any;
    permissions: ReadonlyArray<string>;
    organization?: ReadonlyArray<string>;
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
            orgs: (RelatedEntity)[];
        };

        flags: ReadonlyArray<string>;
    }
};
