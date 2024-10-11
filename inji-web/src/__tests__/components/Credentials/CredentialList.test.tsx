import React from 'react';
import { CredentialList } from '../../../components/Credentials/CredentialList';
import { RequestStatus } from '../../../hooks/useFetch';
import { mockCredentials } from '../../../test-utils/mockObjects';
import { renderWithProvider } from '../../../test-utils/mockUtils'; // Import from mockutils

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

    test('matches the loading state snapshot', () => {
        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.LOADING} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('matches the error state snapshot', () => {
        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.ERROR} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('matches the empty credentials list snapshot', () => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            credentials: {
                filtered_credentials: []
            },
            common: {
                language: 'en',
            },
        }));

        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.DONE} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('matches the credentials list snapshot', () => {
        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.DONE} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
