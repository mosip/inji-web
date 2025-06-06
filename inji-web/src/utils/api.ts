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
    POST,
    DELETE
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
                "Content-Type": ContentTypes.JSON
            };
        }
    };
    static fetchSpecificIssuer: ApiRequest = {
        url: (issuerId: string) => api.mimotoHost + `/issuers/${issuerId}`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": ContentTypes.JSON
            };
        }
    };
    static fetchIssuersConfiguration: ApiRequest = {
        url: (issuerId: string) =>
            api.mimotoHost + `/issuers/${issuerId}/configuration`,
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": ContentTypes.JSON
            };
        }
    };
    static fetchTokenAnddownloadVc: ApiRequest = {
        url: () => api.mimotoHost + `/credentials/download`,
        methodType: MethodType.POST,
        headers: () => {
            return {
                "accept": ContentTypes.PDF,
                "Content-Type": ContentTypes.FORM_URL_ENCODED,
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
                "Content-Type": ContentTypes.JSON
            };
        },
        credentials:"include"
    };

    static userLogout: ApiRequest = {
        url: () => api.mimotoHost + "/logout",
        methodType: MethodType.POST,
        headers: () => {
            return {
                "Content-Type": ContentTypes.JSON
            };
        }
    };

    // Fetch wallets API
    static fetchWallets: ApiRequest = {
        url: () => api.mimotoHost + "/wallets",
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": ContentTypes.JSON
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
                "Content-Type": ContentTypes.JSON
            };
        }
    };

    static fetchWalletDetails: ApiRequest = {
        url: (walletId: string) =>
            api.mimotoHost + `/wallets/${walletId}/unlock`,
        methodType: MethodType.POST,
        headers: () => {
            return {
                "Content-Type": ContentTypes.JSON
            };
        },
        credentials:"include"
    };

    static deleteWallet: ApiRequest = {
        url: (walletId: string) => api.mimotoHost + `/wallets/${walletId}`,
        methodType: MethodType.DELETE,
        headers: () => {
            return {
                "Content-Type": ContentTypes.JSON
            };
        },
        credentials: "include"
    };

    static downloadVCInloginFlow: ApiRequest = {
        url: () => {
            const walletId = localStorage.getItem(KEYS.WALLET_ID);
            return api.mimotoHost + `/wallets/${walletId}/credentials`;
        },
        methodType: MethodType.POST,
        headers: (locale: string) => {
            return {
                "accept": ContentTypes.JSON,
                "Content-Type": ContentTypes.JSON,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Accept-Language": locale
            };
        },
        credentials: "include"
    };

    static fetchWalletVCs: ApiRequest = {
        url: () => {
            const walletId = localStorage.getItem(KEYS.WALLET_ID);
            return (
                api.mimotoHost +
                `/wallets/${walletId}/credentials`
            );
        },
        methodType: MethodType.GET,
        headers: (locale: string) => {
            return {
                "Content-Type": ContentTypes.JSON,
                "Accept-Language": locale,
            };
        }
    };

    static fetchWalletCredentialPreview: ApiRequest = {
        url: (credentialId: string) => {
            const walletId = localStorage.getItem(KEYS.WALLET_ID);
            return (
                api.mimotoHost +
                `/wallets/${walletId}/credentials/${credentialId}?action=download`
            );
        },
        methodType: MethodType.GET,
        headers: (locale: string) => {
            return {
                "Content-Type": ContentTypes.JSON,
                "Accept-Language": locale,
                "Accept": ContentTypes.PDF
            };
        },
        credentials: "include"
    };
}