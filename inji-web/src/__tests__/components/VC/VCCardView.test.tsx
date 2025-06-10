import React from 'react';
import {fireEvent, screen, within} from '@testing-library/react';
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
        const {asFragment} = renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        expect(asFragment()).toMatchSnapshot();
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

    it('should call download api when clicked on card', () => {
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

        // Simulate clicking on the card
        const card = screen.getByRole('menuitem');
        fireEvent.click(card);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should call download api when pressing enter key', () => {
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
        fireEvent.keyDown(card, {key: 'Enter'});

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("wallets/faa0e18f-0935-4fab-8ab3-0c546c0ca714/credentials/cred-1?action=download"),
            expect.objectContaining({
                "credentials": "include",
                "headers": {"Accept": "application/pdf", "Accept-Language": "en", "Content-Type": "application/json"},
                "method": "GET"
            })
        );
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

    // Tests for menu interactions

    it('should open three dots menu with the relevant option when clicked on 3 dots menu', () => {
        renderWithProvider(
            <VCCardView
                credential={mockCredential}
            />
        );

        const threeDotsMenu = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(threeDotsMenu);

        // Assert that menu has only 3 menu items
        const menu = screen.getByRole('menu');
        expect(within(menu).getAllByRole("menuitem")).toHaveLength(3);
        assertMenuItem("View", "view");
        assertMenuItem("Download", "download");
        assertMenuItem("Delete", "delete");
    });

    it('should call delete API when clicked on delete option in delete menu and confirmed it', () => {
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
        const confirmButton = screen.getByRole('button', {name: 'Confirm'});
        fireEvent.click(confirmButton);

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

    it('should not call delete API when clicked on delete option in delete menu and cancelled it', () => {
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
        const cancelButton = screen.getByRole('button', {name: 'Cancel'});
        fireEvent.click(cancelButton);

        expect(fetchMock).not.toBeCalled()
    });

    it.todo("should show error when download fails")
    it.todo("should show error when delete fails")
    it.todo("should close the preview of credential when clicked on close icon in preview modal")
    it.todo("should show the content given by the preview API when clicked on the card")

    function assertMenuItem(text : string, testId : string) {
        expect(screen.getByText(text)).toBeInTheDocument();
        let menuOption = screen.getByTestId(`menu-item-${testId}`);
        expect(menuOption).toBeInTheDocument();
        expect(menuOption).toHaveRole("menuitem")
    }
});