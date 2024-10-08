import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { CredentialList } from '../../../components/Credentials/CredentialList';
import { reduxStore } from '../../../redux/reduxStore';
import { RequestStatus } from '../../../hooks/useFetch';
import { IssuerWellknownObject } from '../../../types/data';

// Mock the i18n configuration
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    initReactI18next: {
        type: '3rdParty',
        init: jest.fn(),
    },
}));

// Mock the useSelector hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

const mockCredentials: IssuerWellknownObject = {
    credential_issuer: "",
    credential_endpoint: "",
    authorization_servers: [""],
    credential_configurations_supported: {
        InsuranceCredential: {
            format: "ldp_vc",
            scope: "mosip_ldp_vc",
            order: [],
            display: [{
                name: "Name1",
                language: "en",
                locale: "en",
                logo: {
                    url: "https://url.com",
                    alt_text: "alt text of the url"
                },
                title: "Title",
                description: "Description",
            }],
            proof_types_supported: [],
            credential_definition: {
                type: [],
                credentialSubject: {
                    fullName: {
                        display: [{
                            name: "Name1",
                            language: "en",
                            locale: "en",
                            logo: {
                                url: "https://url.com",
                                alt_text: "alt text of the url"
                            },
                            title: "Title",
                            description: "Description",
                        }],
                    }
                }
            }
        },
        AnotherCredential: {
            format: "ldp_vc",
            scope: "mosip_ldp_vc",
            order: [],
            display: [{
                name: "Name2",
                language: "en",
                locale: "en",
                logo: {
                    url: "https://url.com",
                    alt_text: "alt text of the url"
                },
                title: "Title",
                description: "Description",
            }],
            proof_types_supported: [],
            credential_definition: {
                type: [],
                credentialSubject: {
                    fullName: {
                        display: [{
                            name: "Name2",
                            language: "en",
                            locale: "en",
                            logo: {
                                url: "https://url.com",
                                alt_text: "alt text of the url"
                            },
                            title: "Title",
                            description: "Description",
                        }],
                    }
                }
            }
        }
    }
};

describe("Test CredentialList Component", () => {
    beforeEach(() => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            credentials: {
                filtered_credentials: mockCredentials,
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
                <CredentialList state={state} />
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

    test('renders empty credentials list', () => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            credentials: {
                filtered_credentials: []
            },
            common: {
                language: 'en',
            },
        }));

        renderWithProvider(RequestStatus.DONE);
        expect(screen.getByText('containerHeading')).toBeInTheDocument();
        expect(screen.getByText('emptyContainerContent')).toBeInTheDocument();
    });

    test('renders credentials list', () => {
        renderWithProvider(RequestStatus.DONE);
        expect(screen.getByText('containerHeading')).toBeInTheDocument();
        expect(screen.getByText('Name1')).toBeInTheDocument();
    });
});
