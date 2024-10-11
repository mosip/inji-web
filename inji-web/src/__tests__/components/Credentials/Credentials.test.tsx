import React from 'react';
import {  screen } from '@testing-library/react';
import { Credential } from '../../../components/Credentials/Crendential';
import { IssuerWellknownObject } from '../../../types/data';
import { getObjectForCurrentLanguage } from '../../../utils/i18n';
import { mockCredentials, mockDisplayArrayObject } from '../../../test-utils/mockObjects';
import { renderWithProvider } from '../../../test-utils/mockUtils';

// Mock the i18n configuration
jest.mock('../../../utils/i18n', () => ({
    getObjectForCurrentLanguage: jest.fn(),
}));

// Mock the useSelector hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

const credential: IssuerWellknownObject = {
    ...mockCredentials,
    credential_configurations_supported: {
        InsuranceCredential: mockCredentials.credential_configurations_supported.InsuranceCredential
    }
};

describe("Test Credentials Item Layout", () => {
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

    test('renders correctly and matches snapshot', () => {
        
        // @ts-ignore
        getObjectForCurrentLanguage.mockReturnValue(mockDisplayArrayObject);

        const { asFragment } = renderWithProvider(<Credential credentialId="InsuranceCredential" index={1} credentialWellknown={credential} />);

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Test Credentials Item Functionality", () => {
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
        const credential: IssuerWellknownObject = {
            ...mockCredentials,
            credential_configurations_supported: {
                InsuranceCredential: mockCredentials.credential_configurations_supported.InsuranceCredential
            }
        };
        // @ts-ignore
        getObjectForCurrentLanguage.mockReturnValue(mockDisplayArrayObject);

        renderWithProvider(<Credential credentialId="InsuranceCredential" index={1} credentialWellknown={credential} />);

        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toBeInTheDocument();
    });

    test('check if content is rendered properly', () => {
        const credential: IssuerWellknownObject = {
            ...mockCredentials,
            credential_configurations_supported: {
                InsuranceCredential: mockCredentials.credential_configurations_supported.InsuranceCredential
            }
        };
        // @ts-ignore
        getObjectForCurrentLanguage.mockReturnValue(mockDisplayArrayObject);
        renderWithProvider(<Credential credentialId="InsuranceCredential" index={1} credentialWellknown={credential} />);
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("Name");
    });
});
