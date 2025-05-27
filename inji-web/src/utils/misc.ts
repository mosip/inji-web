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

export const generateRandomString = (length = 43, charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~') => {
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

export const getTokenRequestBody = (code: string, codeVerifier: string, issuerId: string, credentialConfigurationId: string, vcStorageExpiryLimitInTimes: string, isLoggedIn = false) => {
    const tokenRequestBody : { [key: string]: string } = {
        'code': code,
        'issuer': issuerId,
        'vcStorageExpiryLimitInTimes': vcStorageExpiryLimitInTimes,
    };
    // naming convention is handled separately for logged in and non logged in users as they use camelcase and snake case respectively
    const credentialType = isLoggedIn ? 'credentialConfigurationId' : 'credential';
    const grantType = isLoggedIn ? 'grantType' : 'grant_type';
    const redirectUri = isLoggedIn ? 'redirectUri' : 'redirect_uri';
    const  codeVerifierKey = isLoggedIn ? 'codeVerifier' : 'code_verifier';
    tokenRequestBody[credentialType] = credentialConfigurationId;
    tokenRequestBody[grantType] = "authorization_code";
    tokenRequestBody[redirectUri] = api.authorizationRedirectionUrl;
    tokenRequestBody[codeVerifierKey] = codeVerifier;
    return tokenRequestBody
}

export const downloadCredentialPDF = async (
    response: any,
    certificateId: string
) => {
    let fileName = `${certificateId}.pdf`;
    const url = window.URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const previewCredentialPDF = async (
    response: any,
    certificateId: string
) => {
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
};

export const getErrorObject = (downloadResponse: any) => {
    const errorCode = downloadResponse?.errors ? downloadResponse?.errors[0]?.errorCode : "";
    if([
        "errMissingIssuanceDate",
        "errInvalidIssuanceDate",
        "errIssuanceDateIsFutureDate",
        "errInvalidExpirationDate",
        "errVcExpired",
        "errInvalidValidFrom",
        "errValidFromIsFutureDate",
        "errInvalidValidUntil"
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
export const constructContent = (descriptions: string[],applyHTML:boolean) => {
    return descriptions.map((desc, index) => {
        if (applyHTML) {
            return { __html: desc };
        }
        return desc;
    });
};
