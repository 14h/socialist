import { apiGraphQLClient } from "@utils/graphQlClient";

const SO7_CREATE_ORGANIZATION_MUTATION = `
    mutation($orgName: String!){
        createOrganization(orgName: $orgName){
            id
        }
    }
`;


type CreateOrganizationResponse = Readonly<{
    createOrganization?: {
        id?: string;
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

        console.log(responseData);
        const id = responseData?.createOrganization?.id ?? null;

        if (!id) {
            throw new Error('Organization couldn\'t be created');
        }

        return id;

    } catch (error) {
        throw new Error(error);
    }
}

