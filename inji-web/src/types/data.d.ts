import {MethodType} from "../utils/api";
import React from "react";
// This file contains type definitions for various objects / models used in the application.

export type IssuerWellknownDisplayArrayObject = {
    name: string;
    language: string;
    locale: string;
    logo: LogoObject;
    title: string;
    description: string;
};

export type CredentialTypeDisplayArrayObject = {
    name: string;
    locale: string;
    logo: string;
};

type LogoObject = {
    url: string;
    alt_text: string;
};

export type IssuerConfigurationObject = {
    credentials_supported: CredentialConfigurationObject[];
    authorization_endpoint: string;
    grant_types_supported: string[];
};

export type CredentialConfigurationObject = {
    "name": string;
    "scope": string;
    "display": CredentialTypeDisplayArrayObject[];
};
export type CodeChallengeObject = {
    codeChallenge: string;
    codeVerifier: string;
};
export type IssuerObject = {
    name: string;
    desc: string;
    protocol: "OTP" | "OpenId4VCI";
    issuer_id: string;
    authorization_endpoint: string;
    credentials_endpoint: string;
    display: IssuerWellknownDisplayArrayObject[];
    client_id: string;
    redirect_uri: string;
    token_endpoint: string;
    proxy_token_endpoint: string;
    client_alias: string;
    ovp_qr_enabled: boolean;
    scopes_supported: string[];
};
export type ResponseTypeObject = {
    id?: string;
    version?: string;
    str?: string;
    responsetime?: string;
    metadata?: string;
    response?: any;
    errors?: [];

    access_token?: string;
    expires_in?: number;
    token_type?: string;
};

export type SessionObject = {
    selectedIssuer?: IssuerObject;
    certificateId: string;
    codeVerifier: string;
    vcStorageExpiryLimitInTimes: number;
    state: string;
};

export type ApiRequest = {
    url: (...args: string[]) => string;
    methodType: MethodType;
    headers: (...args: string[]) => any;
    credentials?:RequestCredentials;
};

export type LanguageObject = {
    label: string;
    value: string;
};

export type WalletCredential = {
    issuerDisplayName: string;
    issuerLogo: string;
    credentialTypeDisplayName: string;
    credentialTypeLogo: string;
    credentialId: string;
};

export type FAQAccordionItemType = {
    key: string;
    title: string;
    content: (string | {__html: string})[];
};

export type User = {
    displayName: string;
    profilePictureUrl: string;
    email: string;
};

export type SidebarItemType = {
    icon: React.ReactNode;
    text: string;
    path: string;
    key: string;
};

export type ErrorType = {
    errorCode: string;
    errorMessage: string;
};

export type DropdownItem = {
    label: string;
    onClick: () => void;
    textColor: string;
    key: string;
};

export type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];