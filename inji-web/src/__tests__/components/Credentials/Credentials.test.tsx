import React from 'react';
import { render, screen} from '@testing-library/react';
import { Credential } from '../../../components/Credentials/Crendential';
import { IssuerWellknownObject } from '../../../types/data';
import { Provider } from 'react-redux';
import { reduxStore } from '../../../redux/reduxStore';
import { getObjectForCurrentLanguage } from '../../../utils/i18n';

// Mock the i18n configuration
jest.mock('../../../utils/i18n', () => ({
    getObjectForCurrentLanguage: jest.fn(),
}));

// Mock the useSelector hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

const mockCredentialObject = {
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

const getCredentialObject = (): IssuerWellknownObject => {
    return {
        credential_issuer: "",
        credential_endpoint: "",
        authorization_servers: [""],
        credential_configurations_supported: {
            InsuranceCredential: {
                format: "ldp_vc",
                scope: "mosip_ldp_vc",
                order: [],
                display: [mockCredentialObject],
                proof_types_supported: [],
                credential_definition: {
                    type: [],
                    credentialSubject: {
                        fullName: {
                            display: [mockCredentialObject],
                        }
                    }
                }
            }
        }
    }
};

describe("Test Credentials Item Layout", () => {
    let originalOpen: typeof window.open;

    beforeAll(() => {
        originalOpen = window.open;
        window.open = jest.fn();
    });

    afterAll(() => {
        window.open = originalOpen;
    });

    beforeEach(() => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            issuers: {
                selected_issuer: "issuer1",
            },
            common: {
                language: 'en',
            },
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('check the presence of the container', () => {
        const credential: IssuerWellknownObject = getCredentialObject();
        // @ts-ignore
        getObjectForCurrentLanguage.mockReturnValue(mockCredentialObject);

        render(
            <Provider store={reduxStore}>
                <Credential credentialId="InsuranceCredential" index={1} credentialWellknown={credential} />
            </Provider>
        );

        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toBeInTheDocument();
    });

    test('check if content is rendered properly', () => {
        const credential: IssuerWellknownObject = getCredentialObject();
        // @ts-ignore
        getObjectForCurrentLanguage.mockReturnValue(mockCredentialObject);

        render(
            <Provider store={reduxStore}>
                <Credential credentialId="InsuranceCredential" index={1} credentialWellknown={credential} />
            </Provider>
        );

        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("Name");
    });
});
