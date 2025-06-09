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
import {KEYS} from "../../../utils/constants";
import {mockVerifiableCredentials} from "../../../test-utils/mockObjects";

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

    it('should open three dots menu with the relevant option when clicked on 3 dots menu', () => {
        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        const threeDotsMenu = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(threeDotsMenu);

        expect(screen.getByText('Delete')).toBeInTheDocument();
        let deleteOption = screen.getByTestId('menu-item-delete');
        expect(deleteOption).toBeInTheDocument();
        expect(deleteOption).toHaveRole("menuitem")
    });

    it('should call delete API when clicked on delete option in delete menu', () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
        });

        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        const threeDotsMenu = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(threeDotsMenu);

        const deleteOption = screen.getByTestId('menu-item-delete');
        fireEvent.click(deleteOption);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("wallets/faa0e18f-0935-4fab-8ab3-0c546c0ca714/credentials/cred-1"),
            expect.objectContaining({
                "credentials": "include",
                "headers": {"Content-Type": "application/json"},
                "method": "DELETE"
            })
        );
    });

    it.todo("should show error when download fails")
    it.todo("should show error when delete fails")
    it.todo("should close the preview of credential when clicked on close icon in preview modal")
    it.todo("should show the content given by the preview API when clicked on the card")
});