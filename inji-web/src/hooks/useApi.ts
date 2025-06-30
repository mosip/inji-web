import {useState} from "react";
import {ApiRequest, ApiResult} from "../types/data";
import {ContentTypes, MethodType} from "../utils/api";
import axios from "axios";
import {HTTP_STATUS_CODES, RequestStatus} from "../utils/constants";

export const apiInstance = axios.create({
    baseURL: window._env_.MIMOTO_URL,
    withCredentials: true,
});

export interface RequestConfig {
    url?: string;
    headers?: Record<string, string>;
    body?: any;
    apiConfig: ApiRequest;
}

export interface UseApiReturn<T> {
    data: T | null;
    error: Error | null;
    state: RequestStatus;
    status: number | null;
    fetchData: (arg0: RequestConfig) => Promise<ApiResult<T>>;
    ok: () => boolean;
}

export function useApi<T = any>(): UseApiReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [state, setState] = useState<RequestStatus>(RequestStatus.LOADING);

    const ok = () => {
        return status !== null && status >= HTTP_STATUS_CODES.OK && status < HTTP_STATUS_CODES.MULTIPLE_CHOICES;
    };

    async function fetchData({
                                 headers = undefined,
                                 body,
                                 apiConfig,
                                 url = undefined
                             }: RequestConfig): Promise<ApiResult<T>> {
        setState(RequestStatus.LOADING)
        setError(null);
        setStatus(null);

        let result: ApiResult<T>;

        try {
            const requestHeaders = headers ?? apiConfig.headers();
            const contentType = requestHeaders["Content-Type"] ?? ContentTypes.JSON;
            let requestBody;
            switch (contentType) {
                case ContentTypes.JSON:
                    requestBody = body;
                    break;
                case ContentTypes.FORM_URL_ENCODED:
                    requestBody = new URLSearchParams(body);
                    break;
                default:
                    requestBody = JSON.stringify(body);
                    break;
            }
            const response = await apiInstance.request({
                url: url ?? apiConfig.url(),
                method: MethodType[apiConfig.methodType],
                headers: requestHeaders,
                data: requestBody,
                withCredentials: apiConfig.credentials === "include",
                responseType: apiConfig.responseType ?? "json",
                withXSRFToken: apiConfig.includeXSRFToken ?? false,
            });

            setData(response.data);
            setStatus(response.status);

            result = {
                data: response.data,
                error: null,
                status: response.status,
                state: RequestStatus.DONE,
                headers: response.headers || {},
                ok: () => response.status >= HTTP_STATUS_CODES.OK && response.status < HTTP_STATUS_CODES.MULTIPLE_CHOICES
            };
            setState(RequestStatus.DONE);
        } catch (err: any) {
            const parsedError = err instanceof Error ? err : new Error("Unknown error");

            setError(parsedError);
            setStatus(err?.response?.status ?? null);

            result = {
                data: null,
                error: parsedError,
                status: err?.response?.status ?? null,
                state: RequestStatus.ERROR,
                headers: err?.response?.headers ?? {},
                ok: () => false
            };
            setState(RequestStatus.ERROR)
        }

        return result;
    }

    return {data, error, state, status, fetchData, ok};
}
