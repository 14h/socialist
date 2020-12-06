import { TUserRights, User, UserAndRelated } from '../types/models/User';
import { apiGraphQLClient } from "@utils/graphQlClient";
import { safeLocalStorage } from "@utils/safeLocalStorage";

const SO7_GET_USERTOKEN_MUTATION =
    'mutation($creds:UserCredInput!){createLoginChip(creds:$creds){userToken}}';

const SO7_REVOKEUSERTOKEN_MUTATION =
    'mutation($token:String!){revokeUserToken(userToken:$token)}';

const SO7_CREATE_USER_MUTATION = `
    mutation($creds:UserCreateInput!){
        createUser(creds:$creds)
    }
`;

const SO7_SET_USER_META_MUTATION = `
    mutation($email: String, $userId: ID, $meta: UserMetaUpdate!){
        setUserMeta(email: $email, userId: $userId, meta: $meta)
    }
`;

const SO7_USER_AND_RELATED_QUERY = `
    query getUserAndRelated{
        user{
            id,
            meta{
                email,
                firstname,
                lastname
            }
            rights{
                perms
            }
            related{
                orgs{
                    meta {
                        name
                    }
                }
                surveys{
                    id
                }
            }
        }
    }
`;

export const SO7_USER_TOKEN = 'SO7_USER_TOKEN';

export function clearUserToken() {
    safeLocalStorage.removeItem(SO7_USER_TOKEN);
}

type CreateLoginChipResponse = Readonly<{
    createLoginChip?: {
        userToken?: string;
    };
}>;

type CreateUserResponse = Readonly<{
    createUser?: User;
}>;

type SetUserMetaResponse = Readonly<{
    setUserMeta?: boolean;
}>;

export async function login_so7(
    email: string,
    password: string,
): Promise<string | null> {

    const variables = {
        creds: {
            email,
            password,
        },
    };

    try {
        const responseData = await apiGraphQLClient.unauthorizedRequest<any, CreateLoginChipResponse>(
            SO7_GET_USERTOKEN_MUTATION,
            variables,
        );

        const userToken = responseData?.createLoginChip?.userToken;

        if (!userToken) {
            throw new Error('User was not authorized');
        }

        return userToken ?? null;

    } catch (error) {
        throw new Error('login strategy failed');
    }
}


export async function createUser(
    email: string,
    password: string,
): Promise<User> {

    const variables = {
        creds: {
            email,
            password,
        },
    };

    try {
        const responseData = await apiGraphQLClient.unauthorizedRequest<any, CreateUserResponse>(
            SO7_CREATE_USER_MUTATION,
            variables,
        );

        const user = responseData?.createUser;

        if (!user) {
            throw new Error('Couldn\'nt create user');
        }

        return user ?? null;

    } catch (error) {
        throw new Error('createUser failed');
    }
}
export async function setUserMeta(
    userId: string,
    email: string,
    firstname: string,
    lastname: string,
): Promise<boolean> {

    const variables = {
        creds: {
            email,
            userId,
            meta: {
                firstname,
                lastname,
                email
            }
        },
    };

    try {
        const responseData = await apiGraphQLClient.unauthorizedRequest<any, SetUserMetaResponse>(
            SO7_SET_USER_META_MUTATION,
            variables,
        );

        const success = responseData?.setUserMeta;

        if (!success) {
            throw new Error('Couldn\'nt setUserMeta');
        }

        return success;

    } catch (error) {
        throw new Error('createUser failed');
    }
}

export async function logoutApi(userToken: string): Promise<void> {
    await apiGraphQLClient.authorizedRequest<any, boolean>(
        userToken,
        SO7_REVOKEUSERTOKEN_MUTATION,
        {
            token: userToken,
        },
    );

    clearUserToken();
}

export async function meApi(userToken: string): Promise<User> {
    try {
        console.log(userToken)
        const responseData = await apiGraphQLClient.authorizedRequest<any, UserAndRelated | null>(
            userToken,
            SO7_USER_AND_RELATED_QUERY,
            {},
        );

        if (responseData === null) {
            throw new Error('Api returned empty data. Did the exception handling miss something?');
        }

        const apiFlags = responseData?.user?.flags ?? [];

        const so7Orgs = responseData?.user?.related?.orgs ?? [];
        const so7Surveys = responseData?.user?.related?.surveys ?? [];

        return {
            id: responseData.user.id,
            email: responseData.user.meta.email,
            firstname: responseData.user.meta.firstname,
            lastname: responseData.user.meta.lastname,

            configuration: responseData.user.config,
            permissions: responseData.user.rights.perms,
            rights: responseData.user.rights,
            flags: apiFlags,

            organization: so7Orgs.map(org => org.meta.name),
            surveys: so7Surveys.map(survey => survey.id),
        };
    } catch (err) {
        clearUserToken();

        throw err;
    }
}
