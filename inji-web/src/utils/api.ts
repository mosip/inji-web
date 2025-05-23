import {
    ApiRequest,
    CodeChallengeObject,
    CredentialConfigurationObject,
    IssuerObject
} from "../types/data";
import i18n from "i18next";
import { KEYS } from "./constants";

export enum MethodType {
    GET,
    POST
}

export enum ContentTypes {
    JSON = "application/json",
    PDF = "application/pdf",
    FORM_URL_ENCODED = "application/x-www-form-urlencoded",
}

export class api {
    static mimotoHost = window._env_.MIMOTO_URL;

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
        url: () => api.mimotoHost + "/users/me/cache",
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        },
        credentials:"include"
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
        url: () => api.mimotoHost + "/wallets",
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        },
        credentials:"include"
    };

    // Post wallet API with PIN
    static createWalletWithPin: ApiRequest = {
        url: () => api.mimotoHost + "/wallets",
        methodType: MethodType.POST,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };

    // Fetch wallet details by walletId
    static fetchWalletDetails: ApiRequest = {
        url: (walletId: string) =>
            api.mimotoHost + `/wallets/${walletId}/unlock`,
        methodType: MethodType.POST,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        },
        credentials:"include"
    };

    static downloadVCInloginFlow: ApiRequest = {
        url: () => {
            const walletId = localStorage.getItem(KEYS.WALLET_ID);
            return api.mimotoHost + `/wallets/${walletId}/credentials`;
        },
        methodType: MethodType.POST,
        headers: () => {
            return {
                "accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            };
        }
    };

    static fetchWalletVCs: ApiRequest = {
        url: (locale: string) => {
            const walletId = localStorage.getItem(KEYS.WALLET_ID);
            return (
                api.mimotoHost +
                `/wallets/${walletId}/credentials?locale=${locale}`
            );
        },
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };

    static fetchWalletCredentialPreview: ApiRequest = {
        url: (credentialId: string, locale: string) => {
            const walletId = localStorage.getItem(KEYS.WALLET_ID);
            return (
                api.mimotoHost +
                `/wallets/${walletId}/credentials/${credentialId}?locale=${locale}&action=inline`
            );
        },
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            };
        }
    };
}
