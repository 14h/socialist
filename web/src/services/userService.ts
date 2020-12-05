import { TUserRights, User, UserAndRelated } from '../types/models/User';
import { apiGraphQLClient } from "@utils/graphQlClient";
import { safeLocalStorage } from "@utils/safeLocalStorage";

const API_GET_USERTOKEN_MUTATION =
    'mutation($creds:UserCredInput!){createLoginChip(creds:$creds){userToken}}';

const API_REVOKEUSERTOKEN_MUTATION =
    'mutation($token:String!){revokeUserToken(userToken:$token)}';

const API_DOMAINRIGHTS_QUERY =
    'query getUserDomainRights($domain:String!){domain(domainName:$domain){rights{roles,perms}}}';

const API_USER_AND_RELATED_QUERY =
    'query getUserAndRelated{user{id,meta{email,firstname,lastname}'
    + 'rights{perms}'
    + 'related{'
    + 'orgs{meta{name}}}'
    + 'id,flags}}';

const API_USER_TOKEN = 'vtxut';

export function getApiUserToken() {
    return safeLocalStorage.getItem(API_USER_TOKEN) || null;
}

export function setApiUserToken(userToken: string) {
    safeLocalStorage.setItem(API_USER_TOKEN, userToken);

    return userToken;
}

export function clearUserToken() {
    safeLocalStorage.removeItem(API_USER_TOKEN);
}

type CreateLoginChipResponse = Readonly<{
    createLoginChip?: {
        userToken?: string;
    };
}>;

export async function loginApi(
    email: string,
    password: string,
): Promise<{
    userToken?: string;
}> {

    const variables = {
        creds: {
            email,
            password,
        },
    };

    try {
        const responseData = await apiGraphQLClient.unauthorizedRequest<any, CreateLoginChipResponse>(
            API_GET_USERTOKEN_MUTATION,
            variables,
        );

        const userToken = responseData?.createLoginChip?.userToken;

        if (!userToken) {
            throw new Error('User was not authorized');
        }

        return {
            userToken,
        };

    } catch (error) {
        throw new Error('login strategy failed');
    }
}

export async function logoutApi(userToken: string): Promise<void> {
    await apiGraphQLClient.authorizedRequest<any, boolean>(
        userToken,
        API_REVOKEUSERTOKEN_MUTATION,
        {
            token: userToken,
        },
    );

    clearUserToken();
}

export async function meApi(userToken: string): Promise<User> {
    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, UserAndRelated | null>(
            userToken,
            API_USER_AND_RELATED_QUERY,
            {},
        );

        if (responseData === null) {
            throw new Error('Api returned empty data. Did the exception handling miss something?');
        }

        const apiFlags = responseData?.user?.flags ?? [];

        const apiOrgs = responseData?.user?.related?.orgs ?? [];


        return {
            id: responseData.user.id,
            email: responseData.user.meta.email,
            firstname: responseData.user.meta.firstname,
            lastname: responseData.user.meta.lastname,

            configuration: responseData.user.config,
            permissions: responseData.user.rights.perms,
            organization: apiOrgs.map(org => org.meta.name),
            rights: responseData.user.rights,
            flags: apiFlags,
        };
    } catch (err) {
        clearUserToken();

        throw err;
    }
}

type UserRightsForDomainResponse = Readonly<{
    domain?: {
        rights?: {
            roles?: ReadonlyArray<string>;
            perms?: ReadonlyArray<string>;
        };
    };
}>;

export async function getUserRightsForDomain(
    domain: string,
    userToken: string,
): Promise<TUserRights> {
    if (!domain) {
        throw new Error('Cannot possibly fetch rights of a domain without a valid domain.');
    }

    const variables = {
        domain,
    };

    if (!userToken) {
        return {
            roles: [],
            perms: [],
        } as TUserRights;
    }

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, UserRightsForDomainResponse>(
            userToken,
            API_DOMAINRIGHTS_QUERY,
            variables,
        );

        const rights = responseData?.domain?.rights ?? {};

        return {
            roles: rights?.roles?.slice(),
            perms: rights?.perms?.slice(),
        } as TUserRights;
    } catch (error) {
        throw new Error(error);
    }
}
