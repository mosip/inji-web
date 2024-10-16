import { generateCodeChallenge, generateRandomString, isObjectEmpty, getTokenRequestBody, downloadCredentialPDF, getErrorObject, constructContent } from '../../utils/misc';
import { mockApi, mockCrypto } from '../../utils/mockUtils';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

describe('misc.ts tests', () => {
    beforeAll(() => {
        global.crypto = mockCrypto;
        global.URL.createObjectURL = jest.fn(); // Mock createObjectURL
        global.URL.revokeObjectURL = jest.fn(); // Mock revokeObjectURL
    });

    test('generateCodeChallenge should return correct code challenge and verifier', () => {
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

    test('generateRandomString should return a string of specified length', () => {
        const randomString = generateRandomString(43);
        expect(randomString).toHaveLength(43);
    });

    test('isObjectEmpty should correctly identify empty objects', () => {
        expect(isObjectEmpty({})).toBe(true);
        expect(isObjectEmpty(null)).toBe(true);
        expect(isObjectEmpty(undefined)).toBe(true);
        expect(isObjectEmpty({ key: 'value' })).toBe(false);
    });

    test('getTokenRequestBody should return correct request body', () => {
        const requestBody = getTokenRequestBody('code', 'verifier', 'issuer', 'credential', 'expiry');
        expect(requestBody).toEqual({
            'grant_type': 'authorization_code',
            'code': 'code',
            'redirect_uri': 'http://localhost/redirect', 
            'code_verifier': 'verifier',
            'issuer': 'issuer',
            'credential': 'credential',
            'vcStorageExpiryLimitInTimes': 'expiry'
        });
    });

    test('downloadCredentialPDF should create and click a download link', async () => {
        const response = new Blob(['test'], { type: 'application/pdf' });
        const certificateId = '12345';
        const createElementSpy = jest.spyOn(document, 'createElement');
        const appendChildSpy = jest.spyOn(document.body, 'appendChild');
        const removeChildSpy = jest.spyOn(document.body, 'removeChild');
        const clickSpy = jest.fn();

        const mockLink = document.createElement('a');
        mockLink.setAttribute = jest.fn();
        mockLink.click = clickSpy;

        createElementSpy.mockReturnValue(mockLink);

        await downloadCredentialPDF(response, certificateId);

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    });


    test('getErrorObject should return correct error object', () => {
        const downloadResponse = { errors: [{ errorCode: 'proof_type_not_supported' }] };
        const errorObject = getErrorObject(downloadResponse);
        expect(errorObject).toEqual({
            code: 'error.verification.proof_type_not_supported.title',
            message: 'error.verification.proof_type_not_supported.subTitle'
        });
    });

    test('constructContent should return correct content array', () => {
        const descriptions = ['desc1', 'desc2'];
        const content = constructContent(descriptions, true);
        expect(content).toEqual([{ __html: 'desc1' }, { __html: 'desc2' }]);
    });
});
