import { apiGraphQLClient } from "@utils/graphQlClient";
import {Organization} from "../types";

const SO7_CREATE_ORGANIZATION_MUTATION = `
    mutation($orgName: String!){
        createOrganization(orgName: $orgName){
            id
            meta {
                name
            }
        }
    }
`;

const SO7_ORG_QUERY = `
    query(
        $orgName: String,
        $orgId: ID,
        $email: String,
        $userId: ID,
    ){
        org(
            orgName: $orgName,
            orgId: $orgId,
            email: $email,
            userId: $userId,
        ){
            id
            meta{
                name
            }
            surveys{
                id
            }
        }
    }
`;

type CreateOrganizationResponse = Readonly<{
    createOrganization?: {
        id?: string;
        meta?: {
            name?: string;
        }
    };
}>;

export async function createOrganization(
    orgName: string,
    userToken: string,
): Promise<string | null> {
    const variables = {
        orgName,
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, CreateOrganizationResponse>(
            userToken,
            SO7_CREATE_ORGANIZATION_MUTATION,
            variables,
        );

        const name = responseData?.createOrganization?.meta?.name ?? null;

        if (!name) {
            throw new Error('Organization couldn\'t be created');
        }

        return name;

    } catch (error) {
        throw new Error(error);
    }
}

export async function fetchOrganization(
    orgName: string,
    userToken: string,
): Promise<Organization> {
    const variables = {
        orgName,
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, { org: Organization }>(
            userToken,
            SO7_ORG_QUERY,
            variables,
        );

        const org = responseData?.org ?? null;

        if (!org) {
            throw new Error('Organization couldn\'t be fetched');
        }

        return org;

    } catch (error) {
        throw new Error(error);
    }
}
