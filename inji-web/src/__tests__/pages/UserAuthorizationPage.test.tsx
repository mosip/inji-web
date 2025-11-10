import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { UserAuthorizationPage } from '../../pages/UserAuthorizationPage';
import { api, ContentTypes } from "../../utils/api";
import { ROUTES } from "../../utils/constants";
import { PresentationCredential } from '../../types/components';
import { useUser } from '../../hooks/User/useUser';
import { useApiErrorHandler } from '../../hooks/useApiErrorHandler'; // Import hook

const mockFetchData = jest.fn();
const mockNavigate = jest.fn();
jest.mock('../../hooks/useApi', () => ({
    useApi: () => ({
        fetchData: mockFetchData,
    }),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
jest.mock('../../utils/errorHandling', () => ({
    withErrorHandling: (fn: () => Promise<any>) => fn(),
    ERROR_TYPES: {
        API_TIMEOUT: 'API_TIMEOUT',
        API_NETWORK: 'API_NETWORK',
        API_SERVER: 'API_SERVER',
        API_CLIENT: 'API_CLIENT',
        API_UNAUTHORIZED: 'API_UNAUTHORIZED',
        API_FORBIDDEN: 'API_FORBIDDEN',
        API_NOT_FOUND: 'API_NOT_FOUND',
        WALLET_NOT_AVAILABLE: 'WALLET_NOT_AVAILABLE',
        CREDENTIALS_NOT_FOUND: 'CREDENTIALS_NOT_FOUND',
        UNKNOWN: 'UNKNOWN',
        VALIDATION: 'VALIDATION'
    },
    standardizeError: jest.fn(),
    logError: jest.fn(),
}));
jest.mock('../../hooks/User/useUser'); // Mock the hook's path
jest.mock('../../hooks/useApiErrorHandler'); // Mock the hook's path

const mockStore = {
    getState: () => ({
        common: {
            language: 'en',
            wallet: {
                walletId: 'mock-wallet-id'
            }
        }
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    replaceReducer: jest.fn(),
    [Symbol.observable]: () => ({} as any),
};
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(selector => selector(mockStore.getState()))
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../utils/AppStorage', () => ({
    AppStorage: {
        getItem: (key: string) => {
            if (key === 'WALLET_ID') return 'mock-wallet-id';
            return null;
        },
    },
}));

jest.mock('../../components/User/Sidebar', () => ({
    Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

const MockLoaderModal = jest.fn();
jest.mock('../../modals/LoadingModal', () => ({
    LoaderModal: ({ isOpen, title }: any) => {
        MockLoaderModal({ isOpen, title });
        return isOpen ? <div data-testid="modal-loader">{title}</div> : null;
    }
}));

const MockTrustVerifierModal = jest.fn();
jest.mock('../../components/Issuers/TrustVerifierModal', () => ({
    TrustVerifierModal: (props: any) => {
        MockTrustVerifierModal(props);
        if (!props.isOpen) return null;

        return (
            <div data-testid="modal-trust-verifier">
                <span>{props.verifierName}</span>
                <button data-testid="btn-trust-verifier" onClick={props.onTrust}>Trust</button>
                <button data-testid="btn-not-trust-verifier" onClick={props.onNotTrust}>Not Trust</button>
                <button data-testid="btn-btn-cancel-trust-modal" onClick={props.onCancel}>Cancel</button>
            </div>
        );
    }
}));

const MockCredentialShareHandler = jest.fn();
jest.mock('../../handlers/CredentialShareHandler', () => ({
    CredentialShareHandler: (props: any) => {
        MockCredentialShareHandler(props);
        if (props.selectedCredentials && props.selectedCredentials.length > 0) {
            return (
                <div data-testid="mock-credential-share-handler">
                    Sharing {props.selectedCredentials.length} Credentials for {props.verifierName}
                    <button data-testid="btn-share-handler-close" onClick={props.onClose}>Close Share</button>
                </div>
            );
        }
        return null;
    }
}));


const mockPresentationCredentials: PresentationCredential[] = [
    {
        credentialId: 'mock-cred-id',
        credentialTypeDisplayName: 'Mock Credential',
        credentialTypeLogo: '',
        format: 'vc'
    }
] as PresentationCredential[];


const MockCredentialRequestModal = jest.fn();
jest.mock('../../modals/CredentialRequestModal', () => ({
    CredentialRequestModal: (props: any) => {
        MockCredentialRequestModal(props);
        if (!props.isVisible) return null;

        return (
            <div data-testid="modal-credential-request">
                <span>{`Request for ${props.verifierName}`}</span>
                <button data-testid="btn-cr-cancel" onClick={props.onCancel}>CR-Cancel</button>
                <button data-testid="btn-cr-consent" onClick={() => props.onConsentAndShare(mockPresentationCredentials)}>CR-Consent</button>
            </div>
        );
    }
}));

// Update ErrorCard mock to be "smart"
const MockErrorCard = jest.fn();
jest.mock('../../modals/ErrorCard', () => ({
    ErrorCard: (props: any) => {
        MockErrorCard(props);
        if (!props.isOpen) return null;

        const isRetryable = !!props.onRetry;
        const button = isRetryable
            ? <button onClick={props.onRetry} disabled={props.isRetrying}>Retry</button>
            : (props.onClose ? <button onClick={props.onClose}>Close</button> : null);

        return (
            <div data-testid="modal-error-card">
                <span>{props.title}</span>
                <span>{props.description}</span>
                {button}
            </div>
        );
    }
}));

jest.mock('../../utils/verifierUtils', () => ({
    rejectVerifierRequest: jest.fn(),
}));

const MockTrustRejectionModal = jest.fn();
jest.mock('../../components/Issuers/TrustRejectionModal', () => {
    const React = require('react');
    const { rejectVerifierRequest } = require('../../utils/verifierUtils');
    const { useApi } = require('../../hooks/useApi');
    const { useNavigate } = require('react-router-dom');
    
    return {
        TrustRejectionModal: (props: any) => {
            MockTrustRejectionModal(props);
            if (!props.isOpen) return null;
            
            // Use the mocked hooks
            const { fetchData } = useApi();
            const navigate = useNavigate();
            
            const handleConfirm = async () => {
                await rejectVerifierRequest({
                    presentationId: props.presentationId,
                    fetchData,
                    onSuccess: props.onConfirm,
                    navigate
                });
            };
            
            return (
                <div data-testid="modal-trust-rejection-modal">
                    <span>TrustRejectionModal.title</span>
                    <button data-testid="btn-confirm-cancel" onClick={handleConfirm}>Confirm</button>
                    <button data-testid="btn-go-back" onClick={props.onClose}>Go Back</button>
                </div>
            );
        }
    };
});

// Import mocked function after mock is set up
import { rejectVerifierRequest } from '../../utils/verifierUtils';
const mockRejectVerifierRequest = rejectVerifierRequest as jest.MockedFunction<typeof rejectVerifierRequest>;

// Cast hooks
const mockUseUser = useUser as jest.Mock;
const mockUseApiErrorHandler = useApiErrorHandler as jest.Mock;


api.validateVerifierRequest = {
    url: () => "/wallets/mock-wallet-id/presentations",
    methodType: 1,
    headers: () => ({ "Content-Type": ContentTypes.JSON, "Accept": ContentTypes.JSON }),
    credentials: "include"
};
api.addTrustedVerifier = {
    url: () => "/wallets/mock-wallet-id/trusted-verifiers",
    methodType: 1,
    headers: () => ({ "Content-Type": ContentTypes.JSON, "Accept": ContentTypes.JSON }),
    credentials: "include"
};

const renderComponent = (route = "/user/authorize?authorizationRequestUrl=https%3A%2F%2Fverifier.com%2Frequest%3Fdata%3D123") => {
    const queryString = route.split('?')[1] || '';
    Object.defineProperty(window, 'location', {
        value: {
            search: `?${queryString}`,
            href: route,
        },
        writable: true
    });

    return render(
        <Provider store={mockStore as any}>
            <MemoryRouter initialEntries={[route]}>
                <UserAuthorizationPage />
            </MemoryRouter>
        </Provider>
    );
};

const mockVerifierTrusted = {
    presentationId: "pid-trusted-123",
    verifier: {
        id: "trusted-verifier.com",
        name: "Trusted Verifier",
        logo: "logo.png",
        trusted: true,
        redirectUri: "https://trusted-verifier.com/callback"
    }
};

const mockVerifierUntrusted = {
    presentationId: "pid-untrusted-456",
    verifier: {
        id: "untrusted-verifier.com",
        name: "Untrusted Verifier",
        logo: "logo.png",
        trusted: false,
        redirectUri: "https://untrusted-verifier.com/callback"
    }
};

// Removed getErrorCardTitle, as mock is simpler
const getLoaderModalTitle = () => screen.getByText('loadingCard.title');
const getVerifierName = (name: string) => screen.getByText(name);
const queryTrustVerifierModal = () => screen.queryByTestId('modal-trust-verifier');
const queryCredentialRequestModal = () => screen.queryByTestId('modal-credential-request');

// Define stable mocks for hook functions
const mockHandleApiError = jest.fn();
const mockOnClose = jest.fn();
const mockOnRetry = jest.fn();
let mockErrorHandlerReturnValue: ReturnType<typeof useApiErrorHandler>;


describe('UserAuthorizationPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRejectVerifierRequest.mockImplementation(async (options) => {
            if (options.onSuccess) {
                options.onSuccess();
            }
            if (options.navigate) {
                options.navigate(ROUTES.ROOT);
            }
        });

        // Default mock for useUser (logged in, not loading)
        mockUseUser.mockReturnValue({
            user: { displayName: 'Test User' },
            walletId: 'mock-wallet-id',
            isLoading: false,
            isUserLoggedIn: () => true,
        });

        // Default mock for useApiErrorHandler
        mockErrorHandlerReturnValue = {
            showError: false,
            isRetrying: false,
            errorTitle: undefined,
            errorDescription: undefined,
            onRetry: mockOnRetry,
            onClose: mockOnClose,
            handleApiError: mockHandleApiError,
            clearError: jest.fn(),
        };
        mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

        mockFetchData.mockResolvedValue({
            ok: () => true,
            data: mockVerifierTrusted,
            error: null,
            status: 200,
            state: 1,
            headers: {},
        });
    });

    test('does not call loadInitialData if user is not logged in', async () => {
        // Override useUser mock for this test
        mockUseUser.mockReturnValue({
            user: null,
            walletId: null,
            isLoading: false,
            isUserLoggedIn: () => false, // User is logged out
        });

        renderComponent();

        // Wait a tick to ensure useEffect runs
        await waitFor(() => {
            // Loader should NOT appear
            expect(screen.queryByTestId('modal-loader')).not.toBeInTheDocument();
        });

        // API call should NOT be made
        expect(mockFetchData).not.toHaveBeenCalled();
    });

    test('renders Sidebar and LoaderModal initially and calls validateVerifierRequest', async () => {
        const route = "/user/authorize?https%3A%2F%2Fverifier.com%2Frequest%3Fdata%3D123";
        renderComponent(route);

        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();

        // Loader should be visible because isLoading is set to true in loadInitialData
        const loaderModalTitle = await waitFor(() => getLoaderModalTitle());
        expect(loaderModalTitle).toBeInTheDocument();

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                expect.objectContaining({
                    apiConfig: api.validateVerifierRequest,
                    body: { authorizationRequestUrl: "openid4vp://authorize?https%3A%2F%2Fverifier.com%2Frequest%3Fdata%3D123" },
                })
            );
        });

        // Loader should disappear after API call finishes
        await waitFor(() => {
            expect(screen.queryByText('loadingCard.title')).not.toBeInTheDocument();
        });
    });

    test('shows ErrorCard with "Close" button on initial validation failure', async () => {
        const apiError = { message: "Network Error" };
        mockFetchData.mockResolvedValueOnce({
            ok: () => false, error: apiError as any, data: null, status: 500, state: 2, headers: {},
        });

        // Simulate hook updating its state after handleApiError is called
        mockUseApiErrorHandler.mockImplementation(() => {
            if (mockHandleApiError.mock.calls.length > 0) {
                return {
                    ...mockErrorHandlerReturnValue,
                    showError: true,
                    errorTitle: 'Error',
                    errorDescription: 'Failed',
                    onRetry: undefined, // It's a final error
                    onClose: mockOnClose,
                };
            }
            return mockErrorHandlerReturnValue;
        });

        const { rerender } = renderComponent();

        // Wait for handleApiError to be called
        await waitFor(() => {
            expect(mockHandleApiError).toHaveBeenCalledWith(
                apiError,
                "validateVerifierRequest",
                expect.any(Function),
                expect.any(Function)
            );
        });

        rerender(<UserAuthorizationPage />); // Re-render to show updated hook state

        await waitFor(() => {
            expect(screen.getByTestId('modal-error-card')).toBeVisible();
            expect(screen.getByText('Close')).toBeInTheDocument();
            expect(screen.queryByText('Retry')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Close'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('shows CredentialRequestModal for a trusted verifier', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.queryByText('loadingCard.title')).not.toBeInTheDocument();
        });
        expect(queryTrustVerifierModal()).not.toBeInTheDocument();
        const credentialRequestModal = screen.getByTestId('modal-credential-request');
        expect(credentialRequestModal).toBeVisible();
        expect(screen.getByText(`Request for ${mockVerifierTrusted.verifier.name}`)).toBeVisible();
    });

    test('shows TrustVerifierModal for an untrusted verifier', async () => {
        mockFetchData.mockResolvedValueOnce({
            ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {},
        });
        renderComponent();
        const verifierNameElement = await waitFor(() => getVerifierName(mockVerifierUntrusted.verifier.name));
        expect(verifierNameElement).toBeVisible();
        expect(queryCredentialRequestModal()).not.toBeInTheDocument();
    });

    test('untrusted flow: calls addTrustedVerifier and proceeds on "Trust" click', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: { message: "Added" }, error: null, status: 200, state: 1, headers: {} });
        renderComponent();
        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });
        const trustButton = screen.getByTestId('btn-trust-verifier');
        fireEvent.click(trustButton);
        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                expect.objectContaining({
                    apiConfig: api.addTrustedVerifier,
                    body: { verifierId: mockVerifierUntrusted.verifier.id },
                })
            );
        });
        await waitFor(() => {
            expect(queryTrustVerifierModal()).not.toBeInTheDocument();
            expect(screen.getByTestId('modal-credential-request')).toBeVisible();
        });
    });

    test('untrusted flow: shows ErrorCard with "Retry" button if addTrustedVerifier fails', async () => {
        const apiError = { message: "Trust API Failed" };
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        mockFetchData.mockResolvedValueOnce({ ok: () => false, error: apiError as any, data: null, status: 500, state: 2, headers: {} });

        mockUseApiErrorHandler.mockImplementation(() => {
            if (mockHandleApiError.mock.calls.length > 0) {
                return {
                    ...mockErrorHandlerReturnValue,
                    showError: true,
                    errorTitle: 'Error',
                    errorDescription: 'Failed',
                    onRetry: mockOnRetry, // It's a retryable error
                    onClose: undefined,
                };
            }
            return mockErrorHandlerReturnValue;
        });

        const { rerender } = renderComponent();
        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });

        const trustButton = screen.getByTestId('btn-trust-verifier');
        fireEvent.click(trustButton);

        await waitFor(() => {
            expect(mockHandleApiError).toHaveBeenCalledWith(
                apiError,
                "addTrustedVerifier",
                expect.any(Function),
                expect.any(Function)
            );
        });

        rerender(<UserAuthorizationPage />);

        await waitFor(() => {
            expect(screen.getByTestId('modal-error-card')).toBeVisible();
            expect(screen.getByText('Retry')).toBeInTheDocument(); // Should show retry
        });
        expect(queryTrustVerifierModal()).not.toBeInTheDocument();
    });

    test('untrusted flow: proceeds to CredentialRequestModal on "Not Trust" click', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        renderComponent();
        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });
        const notTrustButton = screen.getByTestId('btn-not-trust-verifier');
        fireEvent.click(notTrustButton);
        await waitFor(() => {
            expect(queryTrustVerifierModal()).not.toBeInTheDocument();
            expect(screen.getByTestId('modal-credential-request')).toBeVisible();
        });
    });

    test('CredentialRequestModal cancel navigates to ROOT', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByTestId('modal-credential-request')).toBeVisible();
        });
        const cancelButton = screen.getByTestId('btn-cr-cancel');
        fireEvent.click(cancelButton);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
            expect(queryCredentialRequestModal()).not.toBeInTheDocument();
        });
    });

    test('CredentialRequestModal consent renders CredentialShareHandler', async () => {
        const presentationId = mockVerifierTrusted.presentationId;
        const verifierName = mockVerifierTrusted.verifier.name;
        const redirectUri = mockVerifierTrusted.verifier.redirectUri;
        renderComponent();
        await waitFor(() => {
            expect(screen.getByTestId('modal-credential-request')).toBeVisible();
        });
        const consentButton = screen.getByTestId('btn-cr-consent');
        fireEvent.click(consentButton);
        await waitFor(() => {
            expect(queryCredentialRequestModal()).not.toBeInTheDocument();
            const shareHandler = screen.getByTestId('mock-credential-share-handler');
            expect(shareHandler).toBeVisible();
            expect(MockCredentialShareHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    selectedCredentials: mockPresentationCredentials,
                    presentationId: presentationId,
                    verifierName: verifierName,
                    returnUrl: redirectUri,
                })
            );
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test('CredentialShareHandler onClose navigates to ROOT and clears state', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByTestId('modal-credential-request')).toBeVisible();
        });
        fireEvent.click(screen.getByTestId('btn-cr-consent'));
        await waitFor(() => {
            expect(screen.getByTestId('mock-credential-share-handler')).toBeVisible();
        });
        const closeButton = screen.getByTestId('btn-share-handler-close');
        fireEvent.click(closeButton);
        await waitFor(() => {
            expect(screen.queryByTestId('mock-credential-share-handler')).not.toBeInTheDocument();
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
        });
    });

    test('untrusted flow: TrustRejectionModal "Confirm" button makes API call and navigates to ROOT', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        renderComponent();
        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });
        const cancelButton = screen.getByTestId('btn-btn-cancel-trust-modal');
        fireEvent.click(cancelButton);
        await waitFor(() => {
            expect(screen.getByTestId('modal-trust-rejection-modal')).toBeVisible();
        });
        const confirmButton = screen.getByTestId('btn-confirm-cancel');
        fireEvent.click(confirmButton);
        await waitFor(() => {
            expect(mockRejectVerifierRequest).toHaveBeenCalledTimes(1);
            expect(mockRejectVerifierRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    presentationId: expect.any(String),
                    fetchData: expect.any(Function),
                    onSuccess: expect.any(Function),
                    navigate: mockNavigate
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
        });
    });

    test('untrusted flow: TrustRejectionModal "Close" button returns to TrustVerifierModal', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        renderComponent();
        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });
        const cancelButton = screen.getByTestId('btn-btn-cancel-trust-modal');
        fireEvent.click(cancelButton);
        await waitFor(() => {
            expect(screen.getByTestId('modal-trust-rejection-modal')).toBeVisible();
        });
        const closeButton = screen.getByTestId('btn-go-back');
        fireEvent.click(closeButton);
        await waitFor(() => {
            expect(screen.queryByTestId('modal-trust-rejection-modal')).not.toBeInTheDocument();
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });
    });

    test('matches snapshot when CredentialRequestModal is visible (trusted flow)', async () => {
        const { asFragment } = renderComponent();
        await waitFor(() => {
            expect(screen.getByTestId('modal-credential-request')).toBeVisible();
        });
        expect(asFragment()).toMatchSnapshot();
    });

    test('matches snapshot when TrustVerifierModal is visible (untrusted flow)', async () => {
        mockFetchData.mockResolvedValueOnce({
            ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {},
        });
        const { asFragment } = renderComponent();
        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });
        expect(asFragment()).toMatchSnapshot();
    });
});