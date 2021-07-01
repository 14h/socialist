import { apiGraphQLClient } from '@utils/graphQlClient';
import { Section, Survey } from '../types';
import { message } from 'antd';

const SO7_CREATE_TRANSLATION_MUTATION = `
    mutation{
        createTranslation
    }
`;

const SO7_UPDATE_TRANSLATION_MUTATION = `
    mutation($data: JSON!){
        updateTranslation(data: $data)
    }
`;

const SO7_TRANSLATION_QUERY = `
    query(
        $id: ID,
    ){
        translation(
            id: $id,
        )
    }
`;


export async function createTranslation(
    userToken: string,
): Promise<any> {

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, any>(
            userToken,
            SO7_CREATE_TRANSLATION_MUTATION,
            {},
        );

        console.log("-> responseData", responseData);
        const translation = responseData?.createTranslation ?? null;

        if (!translation) {
            throw new Error('Translation couldn\'t be created');
        }

        return translation;

    } catch (error) {
        throw new Error(error);
    }
}

export const fetchTranslation = async (
    userToken: string,
    id: string,
): Promise<any | null> => {
    const variables = {
        id,
    };

    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, any>(
            userToken,
            SO7_TRANSLATION_QUERY,
            variables,
        );

        return responseData?.translation ?? null;
    } catch (err) {
        message.error(JSON.stringify(err?.message));

        return null;
    }
};

export const updateTranslation = async (
    userToken: string,
    data: {
        id: string,
        [key: string]: string,
    },
): Promise<boolean> => {
    try {
        const responseData = await apiGraphQLClient.authorizedRequest<any, any>(
            userToken,
            SO7_UPDATE_TRANSLATION_MUTATION,
            {
                data,
            },
        );

        console.log("-> responseData", responseData);
        const translation = responseData?.updateTranslation ?? null;

        if (!translation) {
            throw new Error('Translation couldn\'t be created');
        }

        return translation;

    } catch (error) {
        throw new Error(error);
    }
}
