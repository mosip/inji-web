import {useState} from "react";
import {ApiRequest} from "../types/data";
import {api, MethodType} from "../utils/api";

export interface NetworkResult<T> {
    data: T | null;
    error: Error | null;
    status: number | null;
    loading: boolean;
    headers: object;
}

interface RequestConfig {
    url?: string;
    headers?: Record<string, string>;
    body?: any;
    apiRequest: ApiRequest;
}

interface UseApiReturn<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    status: number | null;
    fetchData: (arg0: RequestConfig) => Promise<NetworkResult<T>>;
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
                                 url = undefined
                             }: RequestConfig): Promise<NetworkResult<T>> {
        setLoading(true);
        setError(null);
        setStatus(null);

        let result: NetworkResult<T> = {
            data: null,
            error: null,
            status: null,
            loading: true,
            headers: {}
        };

        try {
            const response = await api.instance.request({
                url: url ?? apiRequest.url(),
                method: MethodType[apiRequest.methodType],
                headers,
                data: body,
                withCredentials: apiRequest.credentials === "include",
                responseType: apiRequest.responseType ?? "json",
            });

            console.log("API response:", response);
            setData(response.data);
            setStatus(response.status);

            result = {
                data: response.data,
                error: null,
                status: response.status,
                loading: false,
                headers: response.headers || {}
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
                headers: err?.response?.headers || {}
            };
        } finally {
            setLoading(false);
        }

        return result;
    }

    return {data, error, loading, status, fetchData};
}
