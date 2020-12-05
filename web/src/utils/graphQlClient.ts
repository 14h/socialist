import { GraphQLClient  } from 'graphql-request';

export const buildGraphQLClient = (
    url: string,
    headers: any,
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
// TODO: get API_URL from config
export const apiGraphQLClient = buildGraphQLClient('http://localhost:1516/', {});
