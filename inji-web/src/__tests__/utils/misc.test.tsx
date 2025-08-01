import {
    generateCodeChallenge,
    generateRandomString,
    isObjectEmpty,
    getTokenRequestBody,
    downloadCredentialPDF,
    getErrorObject,
    convertStringIntoPascalCase
} from '../../utils/misc';
import { mockCrypto } from '../../test-utils/mockUtils';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

describe('Test misc.ts utility functions', () => {
    beforeAll(() => {
        global.crypto = mockCrypto;
        global.URL.createObjectURL = jest.fn(); 
        global.URL.revokeObjectURL = jest.fn(); 
    });

    test('Check if generateCodeChallenge returns correct code challenge and verifier', () => {
        const verifier = 'testVerifier';
        const hashedVerifier = sha256(verifier);
        const base64Verifier = Base64.stringify(hashedVerifier);
        const expectedCodeChallenge = base64Verifier
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const { codeChallenge, codeVerifier } = generateCodeChallenge(verifier);
        expect(codeVerifier).toBe(verifier);
        expect(codeChallenge).toBe(expectedCodeChallenge);
    });
    
    test('Check if generateRandomString returns a string of specified length', () => {
        const randomString = generateRandomString(43);
        expect(randomString).toHaveLength(43);
    });

    test('Check if isObjectEmpty correctly identifies empty objects', () => {
        expect(isObjectEmpty({})).toBe(true);
        expect(isObjectEmpty(null)).toBe(true);
        expect(isObjectEmpty(undefined)).toBe(true);
        expect(isObjectEmpty({ key: 'value' })).toBe(false);
    });

   test('Check if getTokenRequestBody returns correct request body', () => {
    const requestBody = getTokenRequestBody('code', 'verifier', 'issuer', 'credential', 'expiry');
    expect(requestBody).toEqual({
        'grant_type': 'authorization_code',
        'code': 'code',
        'redirect_uri': window.location.origin + "/redirect", 
        'code_verifier': 'verifier',
        'issuer': 'issuer',
        'credential': 'credential',
        'vcStorageExpiryLimitInTimes': 'expiry'
    });

    const requestBodyForLoggedIn = getTokenRequestBody('code', 'verifier', 'issuer', 'credential', 'expiry', true);
    expect(requestBodyForLoggedIn).toEqual({
        'grantType': 'authorization_code',
        'code': 'code',
        'redirectUri': window.location.origin + "/redirect",
        'codeVerifier': 'verifier',
        'issuer': 'issuer',
        'credentialConfigurationId': 'credential',
    });
});

    test('Check if downloadCredentialPDF creates and clicks a download link', async () => {
        const response = new Blob(['test'], { type: 'application/pdf' });
        const credentialType = '12345';
        const createElementSpy = jest.spyOn(document, 'createElement');
        const appendChildSpy = jest.spyOn(document.body, 'appendChild');
        const removeChildSpy = jest.spyOn(document.body, 'removeChild');
        const clickSpy = jest.fn();

        const mockLink = document.createElement('a');
        mockLink.setAttribute = jest.fn();
        mockLink.click = clickSpy;

        createElementSpy.mockReturnValue(mockLink);

        await downloadCredentialPDF(response, credentialType);

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    });

    test('Check if getErrorObject returns correct error object', () => {
        const downloadResponse = { errors: [{ errorCode: 'errInvalidIssuanceDate'}] };
        const errorObject = getErrorObject(downloadResponse);
        expect(errorObject).toEqual({
            code: 'error.verification.errInvalidIssuanceDate.title',
            message: 'error.verification.errInvalidIssuanceDate.subTitle'
        });
    });

    test("Check if conversion of string pascal case works correctly", () => {
        const input = "This is pascal case";
        const expectedOutput = "This Is Pascal Case";

        const result = convertStringIntoPascalCase(input)

        expect(result).toEqual(expectedOutput);
    })
});