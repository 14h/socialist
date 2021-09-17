import { apiGraphQLClient } from "@utils/graphQlClient";
import {Organization} from "../types";
import { message } from 'antd';
import slugify from 'slugify';

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

const SO7_DELETE_ORGANIZATION_MUTATION = `
    mutation($orgId: ID!){
        deleteOrganization(orgId: $orgId)
    }
`;

const SO7_ORG_QUERY = `
    query(
        $orgId: ID,
    ){
        org(
            orgId: $orgId,
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
        id: string;
        meta: {
            name: string;
        }
    };
}>;

export async function createOrganization(
    orgName: string,
    userToken: string,
): Promise<{
    id: string;
    meta: {
        name: string;
    }
}> {
    const variables = {
        orgName,
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, CreateOrganizationResponse>(
            userToken,
            SO7_CREATE_ORGANIZATION_MUTATION,
            variables,
        );


        if (!responseData?.createOrganization?.id) {
            throw new Error('Organization couldn\'t be created');
        }

        return responseData?.createOrganization;

    } catch (error) {
        message.error(`${orgName} organization could not be created. Please try again later.`);

        throw new Error( error )
    }
}

export async function fetchOrganization(
    orgId: string,
    userToken: string,
): Promise<Organization | null> {
    const variables = {
        orgId,
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
        console.error(error);

        return null;
    }
}

export async function deleteOrganization(
    userToken: string,
    orgId: string,
): Promise<Organization | null> {
    const variables = {
        orgId,
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, any>(
            userToken,
            SO7_DELETE_ORGANIZATION_MUTATION,
            variables,
        );
        if (responseData.deleteOrganization) {
            window.location.reload();
        }

        return responseData.deleteOrganization;

    } catch (error) {
        console.error(error);

        return null;
    }
}
