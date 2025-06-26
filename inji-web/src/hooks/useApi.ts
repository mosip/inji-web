import {useState} from "react";
import {NetworkResult, RequestConfig, UseApiReturn} from "../types/data";
import {ContentTypes, MethodType} from "../utils/api";
import axios from "axios";
import {HTTP_STATUS_CODES, RequestStatus} from "../utils/constants";

export const apiInstance = axios.create({
    baseURL: window._env_.MIMOTO_URL,
    withCredentials: true,
});

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
                             }: RequestConfig): Promise<NetworkResult<T>> {
        setState(RequestStatus.LOADING)
        setError(null);
        setStatus(null);

        let result: NetworkResult<T>;

        try {
            console.log("fetching data with config:", body)
//TODO: Move mimoto host as baseURL in here
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
                loading: false,
                headers: response.headers || {},
                ok: () => response.status >= 200 && response.status < 300
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
                loading: false,
                headers: err?.response?.headers ?? {},
                ok: () => false
            };
            setState(RequestStatus.ERROR)
        }

        return result;
    }

    return {data, error, state, status, fetchData, ok};
}
