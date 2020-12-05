import { TUserRights, User, UserAndRelated } from '../types/models/User';
import { apiGraphQLClient } from "@utils/graphQlClient";
import { safeLocalStorage } from "@utils/safeLocalStorage";

const API_GET_USERTOKEN_MUTATION =
    'mutation($creds:UserCredInput!){createLoginChip(creds:$creds){userToken}}';

const API_REVOKEUSERTOKEN_MUTATION =
    'mutation($token:String!){revokeUserToken(userToken:$token)}';

const API_DOMAINRIGHTS_QUERY =
    'query getUserDomainRights($domain:String!){domain(domainName:$domain){rights{roles,perms}}}';

const API_USER_AND_RELATED_QUERY = `
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

const API_USER_TOKEN = 'vtxut';



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
