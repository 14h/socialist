import { apiGraphQLClient } from "@utils/graphQlClient";
import {Survey} from "../types";

const SO7_CREATE_SURVEY_MUTATION = `
    mutation($surveyName: String!, $orgName: String, $orgId: ID){
        createSurvey(surveyName: $surveyName, orgName: $orgName, orgId: $orgId){
            id
        }
    }
`;

const SO7_ADD_RESOURCE_USER_ROLES = `
    mutation($type: NonUserResourceType!, $resId: ID, $resName: String, $email: String, $userId: ID, $roles: [String!]!){
        addResourceUserRoles(type: $type, resId: $resId, resName: $resName, email: $email, userId: $userId, roles: $roles)
    }
`;

const SO7_DELETE_SURVEY = `
    mutation($surveyName: String, $surveyId: ID){
        deleteSurvey(surveyName: $surveyName, surveyId: $surveyId)
    }
`;


const SO7_SURVEY_MULTI_QUERY = `
    query($surveys:[SurveyEntry]!){
        survey_multi(surveys: $surveys){
            id
            meta{
                name
            }
        }
    }
`;

type CreateSurveyResponse = Readonly<{
    createSurvey?: {
        id?: string;
    };
}>;

type AddResourceUserRolesResponse = Readonly<{
    addResourceUserRoles?: boolean;
}>;

type DeleteSurveyResponse = Readonly<{
    deleteSurvey?: boolean;
}>;

// TODO: fix type after fixing the query
type SurveyMultiResponse = Readonly<{
    survey_multi?: ReadonlyArray<{
        id: string;
        meta: {
            name: string;
        }
    }>
}>;

export async function createSurvey(
    surveyName: string,
    userToken: string,
    userId: string,
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
        const surveyId = responseData?.createSurvey?.id ?? null;

        if (!surveyId) {
            throw new Error('Survey couldn\'t be created');
        }

        await addResourceUserRoles(userToken, userId, surveyId, 'SURVEY')

        return surveyId;

    } catch (error) {
        throw new Error(error);
    }
}

export async function addResourceUserRoles(
    userToken: string,
    userId: string,
    resId: string,
    type: 'SURVEY' | 'ORG'
): Promise<boolean> {
    const variables = {
        userId,
        resId,
        type,
        roles: ['admin'],
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, AddResourceUserRolesResponse>(
            userToken,
            SO7_ADD_RESOURCE_USER_ROLES,
            variables,
        );

        console.log(responseData);
        const successful = responseData?.addResourceUserRoles ?? false;

        if (!successful) {
            throw new Error('couldn\'t be done.');
        }

        return successful;

    } catch (error) {
        throw new Error(error);
    }
}


export async function deleteSurvey(
    userToken: string,
    surveyId: string,
): Promise<boolean> {
    const variables = {
        surveyId,
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, DeleteSurveyResponse>(
            userToken,
            SO7_DELETE_SURVEY,
            variables,
        );

        const result = responseData?.deleteSurvey ?? false;
        if (!result) {
            throw new Error('couldn\'t be done.');
        }

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export async function fetchSurveys(
    userToken: string,
    surveysIds: ReadonlyArray<string>,
): Promise<Survey[]> {
    const variables = {
        surveys: surveysIds.map((surveyId) => ({surveyId})),
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, SurveyMultiResponse>(
            userToken,
            SO7_SURVEY_MULTI_QUERY,
            variables,
        );

        const surveys = responseData?.survey_multi;

        if (!surveys?.length) {
            throw new Error('couldn\'t be done.');
        }

        return surveys.map(({id, meta}) => ({
            id,
            meta,
            sections: [],
        }));

    } catch (error) {
        return [];
    }
}
