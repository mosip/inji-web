import {MethodType} from "../utils/api";

export type DisplayArrayObject = {
    name: string;
    language: string;
    locale: string;
    logo: LogoObject,
    title: string;
    description: string;
}
type LogoObject = {
    url: string;
    alt_text: string;
}

export type IssuerWellknownObject = {
    credential_issuer: string;
    credential_endpoint: string;
    authorization_servers: string[];
    credential_configurations_supported: CredentialsSupportedObject;
}

export type CredentialsSupportedObject = {
    [type: string] : CredentialConfigurationObject
}

export type CredentialConfigurationObject = {
    format: string;
    "scope": string;
    "display": DisplayArrayObject[];
    "order": string[];
    "proof_types_supported": string[];
    "credential_definition": {
        "type": string[],
        "credentialSubject": {
            [name: any]: {
                "display": DisplayArrayObject[]
            }
        }
    }
}
export type CodeChallengeObject = {
    codeChallenge: string;
    codeVerifier: string;
}
export type IssuerObject = {
    name: string;
    desc: string;
    protocol: 'OTP' | 'OpenId4VCI';
    credential_issuer: string,
    authorization_endpoint: string;
    credentials_endpoint: string;
    display: DisplayArrayObject[];
    client_id: string;
    redirect_uri: string;
    token_endpoint: string;
    proxy_token_endpoint: string;
    client_alias: string;
    ovp_qr_enabled: boolean,
    scopes_supported: string[];
}
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
}

export type SessionObject = {
    selectedIssuer?: IssuerObject;
    certificateId: string;
    codeVerifier: string;
    vcStorageExpiryLimitInTimes: number;
    state: string;
}
export type ApiRequest = {
    url: (...args: string[]) => string;
    methodType: MethodType;
    headers: (...args: string[]) => any;
}
export type LanguageObject = {
    label: string;
    value: string;
}
