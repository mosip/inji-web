import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import forge from 'node-forge';
import {jwtDecode} from "jwt-decode";
import * as jose from 'node-jose';
import {api} from "./api";
import {IssuerWellknownObject} from "../types/data";

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
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
};

export const isObjectEmpty = (object: any) => {
    return object === null || object === undefined || Object.keys(object).length === 0;
}

export const generateKeys = async() => {
    const keys = await forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 });
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keys.publicKey);
    return {publicKey: publicKeyPem, privateKey: privateKeyPem};
}

export const pem2jwk = async(pem: string) => {
    const jwk = await jose.JWK.asKey(pem, 'pem');
    return jwk.toJSON(true);
}

export const getTokenRequestBody = (code: string, clientId: string, codeVerifier: string) => {
    return {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': clientId,
        'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        'client_assertion': '',
        'redirect_uri': api.authorizationRedirectionUrl,
        'code_verifier': codeVerifier
    }
}

export const getCredentialRequestBody = async(accessToken: string,
                                              clientId: string,
                                              credentialAudience:string,
                                              issuerWellknown: IssuerWellknownObject,
                                              credentialId: string) => {
    const { publicKey, privateKey } = await generateKeys();
    const header = {
        alg: 'RS256',
        jwk: await pem2jwk(publicKey),
        typ: 'openid4vci-proof+jwt',
    };
    const decodedToken:any = jwtDecode(accessToken);
    const payload = {
        iss: clientId,
        nonce: decodedToken.c_nonce,
        aud: credentialAudience,
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(new Date().getTime() / 1000) + 18000,
    };

    const proofJWT = await getJWT(privateKey, header, payload);
    const credentialTypeWellknown = filterCredentialTypeFromWellknown(issuerWellknown, credentialId);
    return {
        format: 'ldp_vc',
        credential_definition: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: credentialTypeWellknown ? credentialTypeWellknown.credential_definition.type : ["VerifiableCredential", "MosipVerifiableCredential"] ,
        },
        proof: {
            proof_type: 'jwt',
            jwt: proofJWT,
        },
    };
}

export async function getJWT(
    privateKey: string,
    header: object,
    payLoad: object
) {
    try {
        const header64 = encodeB64(JSON.stringify(header));
        const payLoad64 = encodeB64(JSON.stringify(payLoad));
        const preHash = header64 + '.' + payLoad64;
        const signature64 = createSignature(privateKey, preHash);
        return header64 + '.' + payLoad64 + '.' + signature64;
    } catch (e) {
        console.error('Exception Occurred While Constructing JWT ', e);
        throw e;
    }
}

export const createSignature = (privateKey: string, preHash: string): string  => {
    const key = forge.pki.privateKeyFromPem(privateKey);
    const md = forge.md.sha256.create();
    md.update(preHash, 'utf8');

    const signature = key.sign(md);
    return encodeB64(signature);
}
export function encodeB64(str: string) {
    const encodedB64 = forge.util.encode64(str);
    return replaceCharactersInB64(encodedB64);
}
function replaceCharactersInB64(encodedB64: string) {
    return encodedB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


export const downloadCredentialPDF = async (response: any, certificateId: string) => {

    let fileName = `${certificateId}.pdf`;
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank'); // Open the link in a new tab or window
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export const filterCredentialTypeFromWellknown = (credentialWellknown: IssuerWellknownObject, credentialId: string) => {
    return credentialWellknown.supportedCredentials.find(credentialType => credentialType.id === credentialId);
}
