import { GraphQLClient } from 'graphql-request';
import { Headers } from 'graphql-request/dist/src/types';
import config from 'config';

export const buildGraphQLClient = (
    url: string,
    headers: Headers,
) => {
    const unauthorizedClient = new GraphQLClient(url, {
        headers,
    });

    const unauthorizedRequest = <V, R>(
        query: string,
        variables: V,
    ): Promise<R> =>
        unauthorizedClient.request(query, variables);

    const authorizedRequest = <V, T>(
        userToken: string,
        query: string,
        variables: V,
    ): Promise<T> => {
        const newHeaders = Object.assign({}, headers, {
            'X-User-Token': userToken,
        });

        const authorizedClient = new GraphQLClient(url, {
            headers: newHeaders,
        });

        return authorizedClient.request(query, variables);
    };

    return {
        unauthorizedRequest,
        authorizedRequest,
    };
};

export const apiGraphQLClient = buildGraphQLClient(config().API_URL, {});
