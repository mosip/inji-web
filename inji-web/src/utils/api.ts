import {ApiRequest, CodeChallengeObject, CredentialWellknownObject, IssuerObject} from "../types/data";
import i18n from "i18next";

export enum MethodType {
    GET,
    POST
}

export class api {

    // static mimotoHost = "http://localhost:3010";
     static mimotoHost = window.location.origin + "/v1/mimoto";

    static authorizationRedirectionUrl = window.location.origin + "/redirect";


    static fetchIssuers: ApiRequest = {
        url: () => (api.mimotoHost + "/issuers"),
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            }
        }
    }
    static fetchSpecificIssuer: ApiRequest = {
        url: (issuerId: string) => api.mimotoHost + `/issuers/${issuerId}`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            }
        }
    }
    static fetchCredentialTypes: ApiRequest = {
        url: (issuerId: string) => api.mimotoHost + `/issuers/${issuerId}/credentialTypes`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            }
        }
    }
    static fetchTokenAnddownloadVc: ApiRequest = {
        url: () => api.mimotoHost + `/credentials/download`,
        methodType: MethodType.POST,
        headers: () => {
            return {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        }
    }
    static authorization = (currentIssuer: IssuerObject, credentialWellknown: CredentialWellknownObject, state: string, code_challenge: CodeChallengeObject) => {
        return `${currentIssuer.authorization_endpoint}` +
            `?response_type=code&` +
            `client_id=${currentIssuer.client_id}&` +
            `scope=${credentialWellknown.scope}&` +
            `redirect_uri=${api.authorizationRedirectionUrl}&` +
            `state=${state}&` +
            `code_challenge=${code_challenge.codeChallenge}&` +
            `code_challenge_method=S256&`+
            `ui_locales=${i18n.language}`;
    }
}


