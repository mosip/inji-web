import React from 'react';
import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import {WalletCredential} from '../../../types/data';
import {VCCardView} from '../../../components/VC/VCCardView';
import {
    mockLocalStorage,
    mockusei18n,
    mockUseSelector,
    mockUseTranslation,
    renderWithProvider,
    setMockUseSelectorState
} from "../../../test-utils/mockUtils";
import {fetchMock} from "../../../test-utils/setupFetchMock";
import {KEYS} from "../../../utils/constants";
import {mockVerifiableCredentials} from "../../../test-utils/mockObjects";
import {toast} from 'react-toastify';

jest.mock('react-toastify', () => {
    return {
        toast: {
            warning: jest.fn(),
            error: jest.fn(),
        },
        ToastContainer: () => <div data-testid="toast-wrapper"/>
    };
});


jest.mock("../../../components/VC/VCDetailView", () => ({
    VCDetailView: ({previewContent, onDownload, onClick, credential}: {
        previewContent: string,
        onDownload: () => void,
        onClick: () => Promise<void>,
        credential: WalletCredential
    }) => (
        <div data-testid="vc-detail-view">
            <title>{credential.credentialTypeDisplayName}</title>
            <div>{previewContent}</div>
            <button onClick={onClick}>download</button>
            <button onClick={onDownload}>chylose</button>
        </div>
    )
}));

describe('VCCardView Component', () => {
    const mockCredential: WalletCredential = mockVerifiableCredentials[0]
    let localStorageMock
    let refreshCredentialsMock: jest.Mock

    const mockObjectUrl = 'Name:Simon';

    // Save the original implementation
    const originalCreateObjectURL = URL.createObjectURL;

    afterAll(() => {
        // Restore the original implementation
        URL.createObjectURL = originalCreateObjectURL;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTranslation()
        mockusei18n();

        URL.createObjectURL = jest.fn(() => mockObjectUrl);

        mockUseSelector();
        setMockUseSelectorState({
            common: {
                language: 'en',
            },
        });

        localStorageMock = mockLocalStorage();
        localStorageMock.setItem(KEYS.WALLET_ID, "faa0e18f-0935-4fab-8ab3-0c546c0ca714")

        refreshCredentialsMock = jest.fn();
    });

    it('should match snapshot', () => {
        const {asFragment} = renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with correct credential information', () => {
        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
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

    //Preview of Card

    it('should call download api when clicked on card for previewing VC', () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            blob: async () => new Blob(),
            headers: {
                get: () => 'attachment; filename="credential.pdf"',
            },
        });
        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        // Simulate clicking on the card
        const card = screen.getByRole('menuitem');
        fireEvent.click(card);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should call download api when pressing enter key for previewing VC', () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            blob: async () => new Blob(),
            headers: {
                get: () => 'attachment; filename="credential.pdf"',
            },
        });
        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.keyDown(card, {key: 'Enter'});

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("wallets/faa0e18f-0935-4fab-8ab3-0c546c0ca714/credentials/cred-1?action=inline"),
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
                refreshCredentials={refreshCredentialsMock}
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
                refreshCredentials={refreshCredentialsMock}
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

    it("should show error when preview fails", async () => {
        fetchMock.mockRejectedValueOnce({
            ok: false,
            status: 500,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        const threeDotsMenu = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(threeDotsMenu);

        const viewOption = screen.getByTestId('menu-item-view');
        fireEvent.click(viewOption);

        await waitFor(() => {
            expect(toast.error).toBeCalled()
        })
        expect(toast.error).toHaveBeenCalledWith("Download failed. Please retry.")
    });

    it('should redirect to root page when user clicks on preview an unauthorized access is detetected', () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        const card = screen.getByTestId("vc-card-view");
        fireEvent.click(card);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(window.location.href).toBe("http://localhost/");
    });

    it("should show the content given by the preview API when clicked on the card", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            blob: async () => new Blob(['{"Name": "John"}'], {type: "application/pdf"}),
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        const card = screen.getByTestId("vc-card-view");
        fireEvent.click(card);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText("Name:Simon")).toBeInTheDocument()
        });
    })

    // Tests for menu interactions

    it("should show error when download fails", async () => {
        fetchMock.mockRejectedValueOnce({
            ok: false,
            status: 500,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        const downloadIcon = screen.getByTestId('icon-download');
        fireEvent.click(downloadIcon);

        await waitFor(() => {
            expect(toast.error).toBeCalled()
        })
        expect(toast.error).toHaveBeenCalledWith("Download failed. Please retry.")
    })

    it('should redirect to root page when user downloads card but response is unauthorized', () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        const downloadIcon = screen.getByTestId('icon-download');
        fireEvent.click(downloadIcon);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(window.location.href).toBe("http://localhost/");
    });

    it('should open three dots menu with the relevant option when clicked on 3 dots menu', () => {
        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
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
                refreshCredentials={refreshCredentialsMock}
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

    it('should call refresh credentials method from prop post deletion of VC', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
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

        await waitFor(() =>
            expect(refreshCredentialsMock).toHaveBeenCalledTimes(1)
        )
    });

    it('should not call delete API when clicked on delete option in delete menu and cancelled it', () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
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

    it("should show error when delete fails", async () => {
        fetchMock.mockRejectedValueOnce({
            ok: false,
            status: 500,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
                credential={mockCredential}
            />
        );

        const threeDotsMenu = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(threeDotsMenu);

        const deleteOption = screen.getByTestId('menu-item-delete');
        fireEvent.click(deleteOption);
        const confirmButton = screen.getByRole('button', {name: 'Confirm'});
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(toast.error).toBeCalled()
        })
        expect(toast.error).toHaveBeenCalledWith("Failed to delete. Try again.")
    });

    it('should redirect to root page when user deletes card but response is unauthorized access', () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        renderWithProvider(
            <VCCardView
                refreshCredentials={refreshCredentialsMock}
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
        expect(window.location.href).toBe("http://localhost/");
    });

    function assertMenuItem(text: string, testId: string) {
        expect(screen.getByText(text)).toBeInTheDocument();
        let menuOption = screen.getByTestId(`menu-item-${testId}`);
        expect(menuOption).toBeInTheDocument();
        expect(menuOption).toHaveRole("menuitem")
    }
});