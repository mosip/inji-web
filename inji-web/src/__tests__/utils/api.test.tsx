import { ApiRequest, CodeChallengeObject, CredentialConfigurationObject, IssuerObject, IssuerWellknownObject } from "../../types/data";
import i18n from "i18next";
import { api as originalApi, MethodType } from '../../utils/api';

type ApiModule = {
  api: typeof originalApi;
  MethodType: typeof MethodType;
};

describe('api class', () => {
  let apiModule: ApiModule;
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv, BASE_URL: 'https://example.com' };

    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3010'
      },
      writable: true
    });

    jest.resetModules();
    apiModule = require('../../utils/api') as ApiModule;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should have the correct mimotoHost', () => {
    expect(apiModule.api.mimotoHost).toBe('http://localhost:3010/v1/mimoto');
  });

  it('should have the correct authorizationRedirectionUrl', () => {
    expect(apiModule.api.authorizationRedirectionUrl).toBe('http://localhost:3010/redirect');
  });

  it('should have the correct fetchIssuers request', () => {
    const fetchIssuers: ApiRequest = apiModule.api.fetchIssuers;
    expect(fetchIssuers.url()).toBe('http://localhost:3010/v1/mimoto/issuers');
    expect(fetchIssuers.methodType).toBe(apiModule.MethodType.GET);
    expect(fetchIssuers.headers()).toEqual({
      'Content-Type': 'application/json'
    });
  });

  it('should have the correct fetchSpecificIssuer request', () => {
    const issuerId = '123';
    const fetchSpecificIssuer: ApiRequest = apiModule.api.fetchSpecificIssuer;
    expect(fetchSpecificIssuer.url(issuerId)).toBe('http://localhost:3010/v1/mimoto/issuers/123');
    expect(fetchSpecificIssuer.methodType).toBe(apiModule.MethodType.GET);
    expect(fetchSpecificIssuer.headers()).toEqual({
      'Content-Type': 'application/json'
    });
  });

  it('should have the correct fetchIssuersWellknown request', () => {
    const issuerId = '123';
    const fetchIssuersWellknown: ApiRequest = apiModule.api.fetchIssuersWellknown;
    expect(fetchIssuersWellknown.url(issuerId)).toBe('http://localhost:3010/v1/mimoto/issuers/123/well-known-proxy');
    expect(fetchIssuersWellknown.methodType).toBe(apiModule.MethodType.GET);
    expect(fetchIssuersWellknown.headers()).toEqual({
      'Content-Type': 'application/json'
    });
  });

  it('should have the correct fetchTokenAnddownloadVc request', () => {
    const fetchTokenAnddownloadVc: ApiRequest = apiModule.api.fetchTokenAnddownloadVc;
    expect(fetchTokenAnddownloadVc.url()).toBe('http://localhost:3010/v1/mimoto/credentials/download');
    expect(fetchTokenAnddownloadVc.methodType).toBe(apiModule.MethodType.POST);
    expect(fetchTokenAnddownloadVc.headers()).toEqual({
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
  });

  it('should generate the correct authorization URL', () => {
    const currentIssuer: IssuerObject = {
      name: 'Issuer Name',
      desc: 'Issuer Description',
      protocol: 'OpenId4VCI',
      credential_issuer: 'issuer123',
      authorization_endpoint: 'http://auth.server/authorize',
      credentials_endpoint: 'http://credentials.endpoint',
      display: [
        {
          name: 'Issuer Display Name',
          language: 'en',
          locale: 'en-US',
          logo: { url: 'http://example.com/logo.png', alt_text:'Logo' },
          title: 'Issuer Title',
          description: 'Description of the issuer'
        }
      ],
      client_id: 'client123',
      redirect_uri: 'http://localhost:3010/redirect',
      token_endpoint: 'http://token.endpoint',
      proxy_token_endpoint: 'http://proxy.token.endpoint',
      client_alias: 'clientAlias',
      ovp_qr_enabled: true,
      scopes_supported: ['openid', 'profile']
    };

    const credentialWellknown: IssuerWellknownObject = {
      credential_issuer: 'issuer123',
      credential_endpoint: 'http://credential.endpoint',
      authorization_servers: ['http://auth.server'],
      credential_configurations_supported: {}
    };

    const filterCredentialWellknown: CredentialConfigurationObject = {
      format: 'jwt',
      scope: 'openid',
      display: [
        {
          name: 'Credential Name',
          language: 'en',
          locale: 'en-US',
          logo: { url: 'http://example.com/logo.png', alt_text: 'Logo' },
          title: 'Credential Title',
          description: 'Description of the credential'
        }
      ],
      order: ['name', 'dateOfBirth'],
      proof_types_supported: ['jwt', 'ldp'],
      credential_definition: {
        type: ['VerifiableCredential'],
        credentialSubject: {
          name: {
            display: [
              {
                name: 'Name',
                language: 'en',
                locale: 'en-US',
                logo: { url: 'http://example.com/logo.png', alt_text: 'Logo' },
                title: 'Name Title',
                description: 'Description of the name'
              }
            ]
          }
        }
      }
    };

    const state = 'state123';
    const code_challenge: CodeChallengeObject = {
      codeChallenge: 'challenge123',
      codeVerifier: 'verifier123'
    };

    const url = apiModule.api.authorization(currentIssuer, credentialWellknown, filterCredentialWellknown, state, code_challenge);
    expect(url).toBe(
      'http://auth.server/authorize' +
      '?response_type=code&' +
      'client_id=client123&' +
      'scope=openid&' +
      `redirect_uri=http://localhost:3010/redirect&` +
      'state=state123&' +
      'code_challenge=challenge123&' +
      'code_challenge_method=S256&' +
      'ui_locales=' + i18n.language
    );
  });
});