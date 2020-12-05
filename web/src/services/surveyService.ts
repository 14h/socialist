import { apiGraphQLClient } from "@utils/graphQlClient";

const SO7_CREATE_SURVEY_MUTATION = `
    mutation($surveyName: String!, $orgName: String, $orgId: ID){
        createSurvey(surveyName: $surveyName, orgName: $orgName, orgId: $orgId){
            id
        }
    }
`;


type CreateSurveyResponse = Readonly<{
    createSurvey?: {
        id?: string;
    };
}>;

export async function createSurvey(
    surveyName: string,
    userToken: string,
    orgId?: string,
): Promise<string | null> {
    const variables = {
        surveyName,
        orgId
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, CreateSurveyResponse>(
            userToken,
            SO7_CREATE_SURVEY_MUTATION,
            variables,
        );

        console.log(responseData);
        const id = responseData?.createSurvey?.id ?? null;

        if (!id) {
            throw new Error('Survey couldn\'t be created');
        }

        return id;

    } catch (error) {
        throw new Error(error);
    }
}
