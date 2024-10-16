import React from 'react';
import {  screen } from '@testing-library/react';
import { Credential } from '../../../components/Credentials/Crendential';
import { IssuerWellknownObject } from '../../../types/data';
import { getObjectForCurrentLanguage } from '../../../utils/i18n';
import { mockCredentials, mockDisplayArrayObject } from '../../../test-utils/mockObjects';
import { renderWithProvider,mockUseSelector } from '../../../test-utils/mockUtils';


// todo : extract the local method to mockUtils, which is added to bypass the problems
// Mock the i18n configuration
jest.mock('../../../utils/i18n', () => ({
    getObjectForCurrentLanguage: jest.fn(),
}));


const credential: IssuerWellknownObject = {
    ...mockCredentials,
    credential_configurations_supported: {
        InsuranceCredential: mockCredentials.credential_configurations_supported.InsuranceCredential
    }
};

describe("Testing the Layout of Credentials", () => {
    beforeEach(() => {
        mockUseSelector();
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

    test('Check if the layout is matching with the snapshots', () => {
        
        // @ts-ignore
        getObjectForCurrentLanguage.mockReturnValue(mockDisplayArrayObject);

        const { asFragment } = renderWithProvider(<Credential credentialId="InsuranceCredential" index={1} credentialWellknown={credential} />);

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality of Credentials", () => {
    let originalOpen: typeof window.open;

    beforeAll(() => {
        originalOpen = window.open;
        window.open = jest.fn();
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

    test('Check the presence of the container', () => {
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

    test('Check if content is rendered properly', () => {
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
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        window.open = originalOpen;
    });
});
