import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {WalletCredential} from '../../../types/data';
import {VCCardView} from '../../../components/VC/VCCardView';
import {
    mockLocalStorage,
    mockUseSelector,
    renderWithProvider,
    setMockUseSelectorState
} from "../../../test-utils/mockUtils";
import {fetchMock} from "../../../test-utils/setupFetchMock";
import {KEYS} from "../../../utils/constants.ts";
import {mockVerifiableCredentials} from "../../../test-utils/mockObjects.tsx";

describe('VCCardView Component', () => {
    const mockCredential: WalletCredential = mockVerifiableCredentials[0]
    let localStorageMock


    beforeEach(() => {
        jest.clearAllMocks();

        mockUseSelector();
        setMockUseSelectorState({
            common: {
                language: 'en',
            },
        });

        localStorageMock = mockLocalStorage();

        localStorageMock.setItem(KEYS.WALLET_ID, "faa0e18f-0935-4fab-8ab3-0c546c0ca714")
    });

    it('should match snapshot', () => {
        const {container} = renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        expect(container).toMatchSnapshot();
    });

    it('should render with correct credential information', () => {
        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        expect(screen.getByTestId("vc-card-view")).toBeInTheDocument();
        const logo = screen.getByTestId('issuer-logo');
        const name = screen.getByTestId('credential-type-display-name');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'logo1.png');
        expect(logo).toHaveAttribute('alt', 'Credential Type Logo');

        expect(name).toBeInTheDocument();
        expect(name).toHaveTextContent('Drivers License');
    });

    it('should call download api when clicked', () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            blob: async () => new Blob(),
            headers: {
                get: () => 'attachment; filename="credential.pdf"',
            },
        });
        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.click(card);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should call download api when pressing enter key', () => {
        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.keyDown(card, {key: 'Enter'});


    });

    it('should not call download api when pressing key other than enter key', () => {
        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.keyDown(card, {key: '1'});

        expect(fetchMock).not.toBeCalled()
    });

    it('should call download api when download icon is clicked', () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            blob: async () => new Blob(),
            headers: {
                get: () => 'attachment; filename="credential.pdf"',
            },
        });
        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        const downloadIcon = screen.getByTestId('icon-download');
        fireEvent.click(downloadIcon);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("wallets/faa0e18f-0935-4fab-8ab3-0c546c0ca714/credentials/cred-1?action=download"),
            expect.objectContaining({
                "credentials": "include",
                "headers": {"Accept": "application/pdf", "Accept-Language": "en", "Content-Type": "application/json"},
                "method": "GET"
            })
        );
    })
});