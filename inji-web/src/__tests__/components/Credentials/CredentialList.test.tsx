import React from 'react';
import { CredentialList } from '../../../components/Credentials/CredentialList';
import { RequestStatus } from '../../../hooks/useFetch';
import { mockCredentials } from '../../../test-utils/mockObjects';
import { renderWithProvider, mockUseSelector, mockUseTranslation, setMockUseSelectorState } from '../../../test-utils/mockUtils';

describe("Testing the Layout of CredentialList Layouts", () => {
    beforeEach(() => {
        mockUseTranslation();
        mockUseSelector();
        setMockUseSelectorState({
            credentials: {
                filtered_credentials: mockCredentials,
            },
            common: {
                language: 'en',
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Check if the layout is matching with the snapshots in Loading State', () => {
        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.LOADING} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if the layout is matching with the snapshots in Error state', () => {
        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.ERROR} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if the layout is matching with the snapshots of Empty List', () => {
        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.DONE} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if the layout is matching with the snapshots of credentials list', () => {
        const { asFragment } = renderWithProvider(<CredentialList state={RequestStatus.DONE} />);
        expect(asFragment()).toMatchSnapshot();
    });
    afterEach(()=>{
        jest.clearAllMocks();
    })
});
