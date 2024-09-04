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
            if (uri.indexOf("download") !== -1) {
                if (!response.ok) {
                    setState(RequestStatus.ERROR);
                    setError("Error");
                    return await response.json();
                }
                setState(RequestStatus.DONE);
                return await response.blob();
            }
            if (!response.ok) {
                throw new Error();
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



