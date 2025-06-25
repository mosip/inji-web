import {useState} from "react";
import {NetworkResult, RequestConfig, UseApiReturn} from "../types/data";
import {MethodType} from "../utils/api";
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
                                 headers,
                                 body,
                                 apiRequest,
                                 url = undefined
                             }: RequestConfig): Promise<NetworkResult<T>> {
        setState(RequestStatus.LOADING)
        setError(null);
        setStatus(null);

        let result: NetworkResult<T>;

        try {
            console.log("fetching data with config:", body)
//TODO: Move mimoto host as baseURL in here
            const response = await apiInstance.request({
                url: url ?? apiRequest.url(),
                method: MethodType[apiRequest.methodType],
                headers: headers ?? apiRequest.headers(),
                data: JSON.stringify(body),
                withCredentials: apiRequest.credentials === "include",
                responseType: apiRequest.responseType ?? "json",
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
