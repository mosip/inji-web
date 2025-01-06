import {
    ApiRequest,
    CodeChallengeObject,
    CredentialConfigurationObject,
    IssuerObject
} from "../types/data";
import i18n from "i18next";

export enum MethodType {
    GET,
    POST
}

export class api {
    static proxyServerHost = window._env_.MIMOTO_HOST;

    static authorizationRedirectionUrl = window.location.origin + "/redirect";

    static fetchIssuers: ApiRequest = {
        url: () => api.proxyServerHost + "/issuers",
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };
    static fetchSpecificIssuer: ApiRequest = {
        url: (issuerId: string) => api.proxyServerHost + `/issuers/${issuerId}`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };
    static fetchIssuersWellknown: ApiRequest = {
        url: (issuerId: string) =>
            api.proxyServerHost + `/issuers/${issuerId}/well-known-proxy`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };
    static fetchTokenAnddownloadVc: ApiRequest = {
        url: () => api.proxyServerHost + `/credentials/download`,
        methodType: MethodType.POST,
        headers: () => {
            return {
                "accept": "application/pdf",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            };
        }
    };
    static authorization = (
        currentIssuer: IssuerObject,
        filterCredentialWellknown: CredentialConfigurationObject,
        state: string,
        code_challenge: CodeChallengeObject,
        authorizationEndPoint: String
    ) => {
        return (
            `${authorizationEndPoint}` +
            `?response_type=code&` +
            `client_id=${currentIssuer.client_id}&` +
            `scope=${filterCredentialWellknown.scope}&` +
            `redirect_uri=${api.authorizationRedirectionUrl}&` +
            `state=${state}&` +
            `code_challenge=${code_challenge.codeChallenge}&` +
            `code_challenge_method=S256&` +
            `ui_locales=${i18n.language}`
        );
    };

    static fetchAuthorizationServerWellknown = (authorizationServerUrl: String) => {
        return {
            url: () =>
                api.proxyServerHost + `/.well-known/oauth-authorization-server`,
            methodType: MethodType.GET,
            headers: () => {
                return {
                    "Content-Type": "application/json",
                    "target-server": "oauth",
                    "target-host": authorizationServerUrl
                };
            }
        };
    };
}
