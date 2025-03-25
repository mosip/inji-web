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
    static mimotoHost = window._env_.MIMOTO_HOST;

    static authorizationRedirectionUrl = window.location.origin + "/redirect";

    static fetchIssuers: ApiRequest = {
        url: () => api.mimotoHost + "/issuers",
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };
    static fetchSpecificIssuer: ApiRequest = {
        url: (issuerId: string) => api.mimotoHost + `/issuers/${issuerId}`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };
    static fetchIssuersConfiguration: ApiRequest = {
        url: (issuerId: string) =>
            api.mimotoHost + `/issuers/${issuerId}/configuration`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };
    static fetchTokenAnddownloadVc: ApiRequest = {
        url: () => api.mimotoHost + `/credentials/download`,
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
    // method to fetch user profile
    static fetchUserProfile: ApiRequest = {
        url: () => api.mimotoHost + "/users/me",
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };

    static fetchUserLoginStatus: ApiRequest = {
        url: () => api.mimotoHost + "/session/status",
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };

    static userLogout: ApiRequest = {
        url: () => api.mimotoHost + "/logout",
        methodType: MethodType.POST,
        headers: () => {
            return {
            "Content-Type": "application/json"
            };
        }
    };

    // Fetch wallets API
    static fetchWallets: ApiRequest = {
        url: () => api.mimotoHost + "/users/me/wallets",
        methodType: MethodType.GET,
        headers: () => {
            return {
            "Content-Type": "application/json"
            };
        }
    };

// Post wallet API with PIN
    static createWalletWithPin: ApiRequest = {
        url: () => api.mimotoHost + "/users/me/wallets",
        methodType: MethodType.POST,
        headers: () => {
            return {
            "Content-Type": "application/json"
            };
        }
    };

// Fetch wallet details by walletId
    static fetchWalletDetails: ApiRequest = {
        url: (walletId: string) => api.mimotoHost + `/users/me/wallets/${walletId}`,
        methodType: MethodType.POST,
        headers: () => {
            return {
            "Content-Type": "application/json"
            };
        }
    };

}
