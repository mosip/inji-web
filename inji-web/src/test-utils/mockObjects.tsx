import { IssuerConfigurationObject } from '../types/data';
import { LandingPageWrapperProps } from '../components/Common/LandingPageWrapper';
import { NavBarProps } from '../types/components';
export const mockIssuerDisplayArrayObject = {
    name: "Name",
    language: "en",
    locale: "en",
    logo: {
        url: "https://url.com",
        alt_text: "alt text of the url"
    },
    title: "Title",
    description: "Description",
};

export const mockCredentialTypeDisplayArrayObject = {
    name: "Name",
    locale: "en",
    logo: "https://url.com",
};

export const mockCredentials: IssuerConfigurationObject = {
    credentials_supported: [
        {
            name: "InsuranceCredential",
            scope: "mosip_vc_ldp",
            display: [
                {
                    name: "Health Insurance",
                    locale: "en",
                    logo: "https://url.com"
                }
            ]
        },
        {
            name: "AnotherCredential",
            scope: "mosip_ldp_vc",
            display: [
                {
                    name: "Another Credential",
                    locale: "en",
                    logo: "https://url.com"
                }
            ]
        }
    ],
    "authorization_endpoint": "https://env.net/authorize",
    "grant_types_supported": ["authorization_code"]
};


export const mockIssuerObject = {
        name: 'Test Issuer',
        desc: 'Test Description',
        protocol: 'OTP' as 'OTP', // Explicitly set the type to 'OTP' or 'OpenId4VCI'
        issuer_id: 'test-issuer',
        authorization_endpoint: 'https://auth.test.com',
        credentials_endpoint: 'https://credentials.test.com',
        display: [{
            name: "Name",
            language: "en",
            locale: "en",
            logo: {
                url: "https://url.com",
                alt_text: "alt text of the url"
            },
            title: "Title",
            description: "Description",
        }],
        client_id: 'test-client-id',
        redirect_uri:'test-redirect-uri',
        token_endpoint:'test-token_endpoint',
        proxy_token_endpoint:'test-proxy_token_endpoint',
        client_alias:'',
        ovp_qr_enabled: true,
        scopes_supported: ['scope1', 'scope2']
}

export const mockIssuerObjectList =  [
    {
        name: 'Issuer 1',
        desc: 'Description 1',
        protocol: 'OpenId4VCI',
        issuer_id: 'issuer1',
        authorization_endpoint: 'https://issuer1.com/auth',
        credentials_endpoint: 'https://issuer1.com/credentials',
        display: [
            {
                name: 'Issuer 1',
                language: 'en',
                locale: 'en-US',
                logo: { url: 'https://issuer1.com/logo.png', alt_text: 'Issuer 1 Logo' },
                title: 'Issuer 1 Title',
                description: 'Issuer 1 Description',
            },
        ],
        client_id: 'client1',
        redirect_uri: 'https://issuer1.com/redirect',
        token_endpoint: 'https://issuer1.com/token',
        proxy_token_endpoint: 'https://issuer1.com/proxy-token',
        client_alias: 'client1-alias',
        ovp_qr_enabled: true,
        scopes_supported: ['openid', 'profile'],
    },
    {
        name: 'Issuer 2',
        desc: 'Description 2',
        protocol: 'OpenId4VCI',
        issuer_id: 'issuer2',
        authorization_endpoint: 'https://issuer2.com/auth',
        credentials_endpoint: 'https://issuer2.com/credentials',
        display: [
            {
                name: 'Issuer 2',
                language: 'en',
                locale: 'en-US',
                logo: { url: 'https://issuer2.com/logo.png', alt_text: 'Issuer 2 Logo' },
                title: 'Issuer 2 Title',
                description: 'Issuer 2 Description',
            },
        ],
        client_id: 'client2',
        redirect_uri: 'https://issuer2.com/redirect',
        token_endpoint: 'https://issuer2.com/token',
        proxy_token_endpoint: 'https://issuer2.com/proxy-token',
        client_alias: 'client2-alias',
        ovp_qr_enabled: false,
        scopes_supported: ['openid', 'profile'],
    },
]

export const mockLandingPageWrapperProps: LandingPageWrapperProps = {
    icon: <div data-testid="Test-Icon">Icon</div>,
    title: "Test Title",
    subTitle: "Test SubTitle",
    gotoHome: true,
};

export const mockNavBarProps: NavBarProps = {
    title: 'Test Title',
    link: '/test-link',
    search: true,
};