// hooks/useApi.ts
import {useState, useCallback} from "react";
import {ApiRequest} from "../types/data";
import {api, MethodType} from "../utils/api";

interface FetchResult<T> {
    data: T | null;
    error: Error | null;
    status: number | null;
    loading: boolean;
}

interface UseApiReturn<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    status: number | null;
    fetchData: (
        requestConfig: {
            headers?: Record<string, string>;
            body?: any;
            apiRequest: ApiRequest;
        }
    ) => Promise<FetchResult<T>>;
}

export function useApi<T = any>(): UseApiReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<number | null>(null);

    async function fetchData({
                                 headers,
                                 body,
                                 apiRequest,
                             }: {
        headers?: Record<string, string>;
        body?: any;
        apiRequest: ApiRequest;
    }): Promise<FetchResult<T>> {
        setLoading(true);
        setError(null);
        setStatus(null);

        let result: FetchResult<T> = {
            data: null,
            error: null,
            status: null,
            loading: true,
        };

        try {
            const response = await api.instance.request({
                url: apiRequest.url(),
                method: MethodType[apiRequest.methodType],
                headers,
                data: body,
                withCredentials: apiRequest.credentials === "include",
            });

            setData(response.data);
            setStatus(response.status);

            result = {
                data: response.data,
                error: null,
                status: response.status,
                loading: false,
            };
        } catch (err: any) {
            const parsedError = err instanceof Error ? err : new Error("Unknown error");

            setError(parsedError);
            setStatus(err?.response?.status || null);

            result = {
                data: null,
                error: parsedError,
                status: err?.response?.status || null,
                loading: false,
            };
        } finally {
            setLoading(false);
        }

        return result;
    }

    return {data, error, loading, status, fetchData};
}
