import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import {api} from "./api";

export const generateCodeChallenge = (verifier = generateRandomString()) => {
    const hashedVerifier = sha256(verifier);
    const base64Verifier = Base64.stringify(hashedVerifier);
    return {
        codeChallenge: base64Verifier
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_'),
        codeVerifier: verifier
    };
}

export const generateRandomString = (length = 43) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let randomString = '';
    for (let i = 0; i < 43; i++) {
        const array = new Uint32Array(1);
        const randomOffset = crypto.getRandomValues(array)[0] / (2 ** 32) * charset.length;
        const randomIndex = Math.floor( randomOffset );
        randomString += charset[randomIndex];
    }
    return randomString;
};

export const isObjectEmpty = (object: any) => {
    return object === null || object === undefined || Object.keys(object).length === 0;
}

export const getTokenRequestBody = (code: string, codeVerifier: string, issuerId: string, credentialType: string) => {
    return {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': api.authorizationRedirectionUrl,
        'code_verifier': codeVerifier,
        'issuer': issuerId,
        'credential': credentialType
    }
}

export const downloadCredentialPDF = async (response: any, certificateId: string) => {
    let fileName = `${certificateId}.pdf`;
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export const getErrorObject = (downloadResponse: any) => {
    const errorCode = downloadResponse?.errors ? downloadResponse?.errors[0]?.errorCode : "";
    if([
        "proof_type_not_supported",
        "json_parsing_failed",
        "signature_verification_failed",
        "unknown_exception",
        "proof_document_not_found",
        "public_key_not_found"
    ].indexOf(errorCode) != -1 ){
        return {
            code: `error.verification.${errorCode}.title`,
            message: `error.verification.${errorCode}.subTitle`
        }
    }
    return {
        code: "error.generic.title",
        message: "error.generic.subTitle"
    }
}

