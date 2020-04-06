  
const convertToPostData = <RequestType>(data: RequestType) => {
    const keys = Object.keys(data);

    return keys.map(
        key => {
            const encodedKey = encodeURIComponent(key);
            const encodedData = encodeURIComponent(data[key]);

            return `${encodedKey}=${encodedData}`;
        }).join('&');
};

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
}

export type TAbortForwarder = (abortFunction: () => void) => void;
export type TRequestOptions = Readonly<{
    abortForwarder?: TAbortForwarder,
    headers?: [string, string][],
}>;

const createRequest = <ResponseType, RequestType>(
    method: HttpMethod,
    url: string,
    data?: RequestType,
    isJson = false,
    options: TRequestOptions = {},
): Promise<ResponseType> => {
    return new Promise((
        resolve,
        reject,
    ) => {
        const request = new XMLHttpRequest();

        request.withCredentials = false;

        const mappedUrl =
            method === HttpMethod.GET
                ? [
                    url,
                    data
                        ? [
                            '?',
                            convertToPostData(data),
                        ].join('')
                        : '',
                ].join('')
                : url;

        request.addEventListener('load', () => {
            const { response, status }: { response: string, status: number } = request;
            const isSuccess = status < 400;

            if (isSuccess) {
                try {
                    const json = JSON.parse(response);

                    if (json.error) {
                        throw new Error(json.error);
                    }

                    resolve(json as ResponseType);
                } catch (error) {
                    reject(error);
                }

                return;
            }

            reject(new Error(`[XHR] [${method}] [${status}] Received http error: ${url}`));
            return;
        });

        request.addEventListener('error', () => {
            reject(new Error(`[XHR] [${method}] Error while fetching: ${url}`));
        });

        request.open(method, mappedUrl);

        options.headers?.forEach(
            header =>
                request.setRequestHeader(
                    header[0],
                    header[1],
                ),
        );

        if (!data || method === HttpMethod.GET) {
            return request.send();
        }

        if (isJson) {
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(data));

            return;
        }

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send(convertToPostData(data));

        return;
    });
};

export const get = <ResponseType>(
    url: string,
    options?: TRequestOptions,
    data?: any,
): Promise<ResponseType> => {
    return createRequest(
        HttpMethod.GET,
        url,
        data,
        false,
        options,
    );
};

export const post = <ResponseType, RequestType>(
    url: string,
    data?: RequestType,
    options?: TRequestOptions,
): Promise<ResponseType> => {
    return createRequest(
        HttpMethod.POST,
        url,
        data,
        true,
        options,
    );
};

