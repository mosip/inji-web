import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { IssuersList } from '../../../components/Issuers/IssuersList';
import { reduxStore } from '../../../redux/reduxStore';
import { IssuerObject } from '../../../types/data';
import { RequestStatus } from '../../../hooks/useFetch';

// Mock the i18n configuration
jest.mock('../../../utils/i18n', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    getObjectForCurrentLanguage: jest.fn((displayArray: any, language: string) => displayArray),
}));

// Mock the useSelector hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

const mockIssuers: IssuerObject[] = [
    {
        name: 'Issuer 1',
        desc: 'Description 1',
        protocol: 'OpenId4VCI',
        credential_issuer: 'issuer1',
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
        credential_issuer: 'issuer2',
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
];

describe("Test IssuersList Component", () => {
    beforeEach(() => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            issuers: {
                issuers: mockIssuers,
                filtered_issuers: mockIssuers,
            },
            common: {
                language: 'en',
            },
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderWithProvider = (state: RequestStatus) => {
        render(
            <Provider store={reduxStore}>
                <Router>
                    <IssuersList state={state} />
                </Router>
            </Provider>
        );
    };

    test('renders loading state', () => {
        renderWithProvider(RequestStatus.LOADING);
        expect(screen.getByTestId('SpinningLoader-Container')).toBeInTheDocument();
    });

    test('renders error state', () => {
        renderWithProvider(RequestStatus.ERROR);
        expect(screen.getByText('containerHeading')).toBeInTheDocument();
        expect(screen.getByText('emptyContainerContent')).toBeInTheDocument();
    });

    test('renders empty issuers list', () => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            issuers: {
                issuers: [],
                filtered_issuers: [],
            },
            common: {
                language: 'en',
            },
        }));

        renderWithProvider(RequestStatus.DONE);
        expect(screen.getByText('containerHeading')).toBeInTheDocument();
        expect(screen.getByText('emptyContainerContent')).toBeInTheDocument();
    });

    // Uncomment and adjust this test if needed
    // test('renders issuers using ItemBox', () => {
    //     renderWithProvider(RequestStatus.DONE);
    //     expect(screen.getByText('containerHeading')).toBeInTheDocument();
    //     expect(screen.getByText('Issuer 1')).toBeInTheDocument();
    //     expect(screen.getByText('Issuer 2')).toBeInTheDocument();
    // });
});
