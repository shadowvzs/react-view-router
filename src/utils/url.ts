import type { IUrlData } from '@type/core';

export const dynamicRegExp = new RegExp('(:[a-zA-Z0-9]+)+', 'g');

// convert the endpoint to regexp, replace the dynamic part from the endpoint
export const endpointToRegExp = (
    endpoint: string,
    exact?: boolean,
): [endpointRegexp: RegExp, matchedParts: string[]] => {
    const dynamicParts = endpoint.match(dynamicRegExp);
    if (!dynamicParts) {
        throw new Error(`No dynamic part in "${endpoint}"`);
    }
    dynamicParts.forEach((match) => {
        endpoint = endpoint.replace(match, '([.a-zA-Z0-9%_-]+)');
    });
    return [new RegExp('^' + endpoint.replace('?', '\\?') + (exact ? '$' : '')), dynamicParts];
};

export const isUrlMatchWithPath = (url: string, foundEndpoint: string, exact?: boolean): boolean => {
    if (!foundEndpoint.includes(':')) {
        return foundEndpoint === url;
    }
    const [regexp] = endpointToRegExp(foundEndpoint, exact);
    return regexp.test(url);
};

// extract dynamic data from url and convert to key-value pair/dictionary
export const extractDataFromUrl = (
    url: string,
    foundEndpoint: string,
    exact?: boolean,
): Record<string, string> | null => {
    if (!foundEndpoint.includes(':')) {
        return {};
    }
    const [regexp, dynamicParts] = endpointToRegExp(foundEndpoint, exact);
    const matches = url.match(regexp);
    if (!matches) {
        return matches;
    }
    return dynamicParts.reduce((resultObj, partName, idx) => {
        resultObj[partName.replace(':', '')] = matches[idx + 1];
        return resultObj;
    }, {} as Record<string, string>);
};

export const urlDecomposer = (url: string): IUrlData => {
    const [restUrl, hash] = url.split('#');
    const [baseUrl, queryList] = restUrl.split('?');
    const params: Record<string, string | string[]> = {};

    if (queryList) {
        queryList.split('&').forEach((queryParams) => {
            const [key, value] = queryParams.split('=');
            if (key.endsWith('[]') || key.endsWith('%5B%5D')) {
                const newKey = key.replace('[]', '').replace('%5B%5D', '');
                if (!params[newKey]) {
                    params[newKey] = [];
                }
                (params[newKey] as string[]).push(value);
            } else if (params[key]) {
                if (Array.isArray(params[key])) {
                    (params[key] as string[]).push(value);
                } else {
                    params[key] = [params[key] as string, value];
                }
            } else {
                params[key] = value;
            }
        });
    }

    return {
        url: baseUrl,
        hash,
        params,
    };
};
