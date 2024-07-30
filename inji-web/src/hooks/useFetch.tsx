import { useState } from "react";
import { MethodType } from "../utils/api";

export enum RequestStatus {
    LOADING,
    DONE,
    ERROR
}

export const useFetch = () => {
    const [state, setState] = useState<RequestStatus>(RequestStatus.LOADING);
    const [error, setError] = useState<string>("");

    const fetchRequest = async (uri: string, method: MethodType, header: any, body?: any) => {
        try {
            setState(RequestStatus.LOADING);
            const requestOptions = {
                method: MethodType[method],
                headers: header,
                body: body
            }
            const response = await fetch(uri, requestOptions);
            if (!response.ok) {
                 throw new Error();
            }
            if (uri.indexOf("download") !== -1) {
                setState(RequestStatus.DONE);
                return await response.blob();
            }
            setState(RequestStatus.DONE);
            return await response.json();
        } catch (e) {
            setState(RequestStatus.ERROR);
            setError("Error Happened");
        }
    };
    return {state, error, fetchRequest};
}



