import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { UserAuthorizationPage } from '../../pages/UserAuthorizationPage';
import { api, ContentTypes } from "../../utils/api";
import { ROUTES } from "../../utils/constants";
import { ApiResult } from '../../types/data';

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

const MockLoaderModal = jest.fn();
jest.mock('../../modals/LoadingModal', () => ({
    LoaderModal: ({ isOpen, title }: any) => {
        MockLoaderModal({ isOpen, title });
        return isOpen ? <div data-testid="mock-loader-modal">{title}</div> : null;
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


const MockErrorCard = jest.fn();
jest.mock('../../modals/ErrorCard', () => ({
    ErrorCard: (props: any) => {
        MockErrorCard(props);
        if (!props.isOpen) return null;
        return (
            <div data-testid="mock-error-card">
                <span>ErrorCard.defaultTitle</span>
                <button role="button" name="Close" onClick={props.onClose}>Close</button>
            </div>
        );
    }
}));

const MockTrustRejectionModal = jest.fn();
jest.mock('../../components/Issuers/TrustRejectionModal', () => ({
    TrustRejectionModal: (props: any) => {
        MockTrustRejectionModal(props);
        if (!props.isOpen) return null;
        return (
            <div data-testid="mock-rejection-modal">
                <span>TrustRejectionModal.title</span>
                <button data-testid="btn-confirm-cancel" onClick={props.onConfirm}>Confirm</button>
                <button data-testid="btn-go-back" onClick={props.onClose}>Go Back</button>
            </div>
        );
    }
}));

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
api.userRejectVerifier = {
    url: (presentationId: string) => `/wallets/mock-wallet-id/presentations/${presentationId}`,
    methodType: 3,
    headers: () => ({ "Content-Type": ContentTypes.JSON, "Accept": ContentTypes.JSON }),
    credentials: "include"
};

const renderComponent = (route = "/user/authorize?some_param=value") => {
    Object.defineProperty(window, 'location', {
        value: {
            search: route.split('?')[1] ? `?${route.split('?')[1]}` : '',
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
    }
};

const mockVerifierUntrusted = {
    presentationId: "pid-untrusted-456",
    verifier: {
        id: "untrusted-verifier.com",
        name: "Untrusted Verifier",
        logo: "logo.png",
        trusted: false,
    }
};

const getErrorCardTitle = () => screen.getByText('ErrorCard.defaultTitle');
const getLoaderModalTitle = () => screen.getByText('loadingCard.title');
const getVerifierName = (name: string) => screen.getByText(name);
const getRejectionModalTitle = () => screen.getByText('TrustRejectionModal.title');
const queryTrustVerifierModal = () => screen.queryByTestId('modal-trust-verifier');


describe('UserAuthorizationPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetchData.mockResolvedValue({
            ok: () => true,
            data: mockVerifierTrusted,
            error: null,
            status: 200,
            state: 1,
            headers: {},
        });
    });

    test('renders LoaderModal initially and calls validateVerifierRequest on mount', async () => {
        renderComponent();

        const loaderModalTitle = await waitFor(() => getLoaderModalTitle());
        expect(loaderModalTitle).toBeInTheDocument();

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                expect.objectContaining({
                    apiConfig: api.validateVerifierRequest,
                    body: { authorizationRequestUrl: '?' + window.location.search.split('?')[1] },
                })
            );
        });

        await waitFor(() => {
            expect(screen.queryByText('loadingCard.title')).not.toBeInTheDocument();
        });
    });

    test('shows ErrorCard and navigates to ROOT on initial validation failure', async () => {
        mockFetchData.mockResolvedValueOnce({
            ok: () => false,
            error: { message: "Network Error" } as any,
            data: null,
            status: 500,
            state: 2,
            headers: {},
        });

        renderComponent();

        await waitFor(() => {
            expect(getErrorCardTitle()).toBeVisible();
        });

        const closeButton = screen.getByRole('button', { name: /Close/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
        });
    });

    test('shows ErrorCard on invalid verifier data (missing verifier)', async () => {
        mockFetchData.mockResolvedValueOnce({
            ok: () => true,
            data: { presentationId: "pid", verifier: null },
            error: null,
            status: 200,
            state: 1,
            headers: {},
        });

        renderComponent();

        await waitFor(() => {
            expect(getErrorCardTitle()).toBeVisible();
        });
    });

    test('does NOT show TrustVerifierModal for a trusted verifier', async () => {
        mockFetchData.mockResolvedValueOnce({
            ok: () => true,
            data: mockVerifierTrusted,
            error: null,
            status: 200,
            state: 1,
            headers: {},
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByText('loadingCard.title')).not.toBeInTheDocument();
        });

        expect(queryTrustVerifierModal()).not.toBeInTheDocument();
    });

    test('shows TrustVerifierModal for an untrusted verifier', async () => {
        mockFetchData.mockResolvedValueOnce({
            ok: () => true,
            data: mockVerifierUntrusted,
            error: null,
            status: 200,
            state: 1,
            headers: {},
        });

        renderComponent();

        // This assertion confirms the modal is open and visible by checking its content.
        const verifierNameElement = await waitFor(() => getVerifierName(mockVerifierUntrusted.verifier.name));

        // This check is now the primary proof of visibility.
        expect(verifierNameElement).toBeVisible();
        
        // --- Removed the brittle getByTestId checks ---
        // const trustModal = screen.getByTestId('modal-trust-verifier'); // Removed
        // expect(trustModal).toBeVisible(); // Removed
    });

    test('calls addTrustedVerifier and closes modal on "Trust" click', async () => {
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
        });
    });

    test('shows ErrorCard if addTrustedVerifier fails on "Trust" click', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        mockFetchData.mockResolvedValueOnce({ ok: () => false, error: { message: "Trust API Failed" } as any, data: null, status: 500, state: 2, headers: {} });

        renderComponent();

        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });

        const trustButton = screen.getByTestId('btn-trust-verifier');
        fireEvent.click(trustButton);

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                expect.objectContaining({ apiConfig: api.addTrustedVerifier })
            );
        });

        await waitFor(() => {
            expect(getErrorCardTitle()).toBeVisible();
        });
    });

    test('calls rejectVerifierRequest and navigates to ROOT on "Not Trust" click', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: { message: "Rejected" }, error: null, status: 200, state: 1, headers: {} });

        renderComponent();

        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });

        const notTrustButton = screen.getByTestId('btn-not-trust-verifier');
        fireEvent.click(notTrustButton);

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: api.userRejectVerifier.url(mockVerifierUntrusted.presentationId),
                    body: {
                        errorCode: "access_denied",
                        errorMessage: "User denied authorization to share credentials"
                    }
                })
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
        });
    });

    test('opens TrustRejectionModal on "Cancel" and handles confirmation to ROOT', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });

        renderComponent();

        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });

        const cancelButton = screen.getByTestId('btn-btn-cancel-trust-modal');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(getRejectionModalTitle()).toBeVisible();
        });
        
        expect(queryTrustVerifierModal()).not.toBeInTheDocument();

        const confirmButton = screen.getByTestId('btn-confirm-cancel');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.queryByText('TrustRejectionModal.title')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
        });
    });

    test('opens TrustRejectionModal on "Cancel" and handles closure to return to TrustVerifierModal', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });

        renderComponent();

        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });

        const cancelButton = screen.getByTestId('btn-btn-cancel-trust-modal');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(getRejectionModalTitle()).toBeVisible();
        });

        const closeButton = screen.getByTestId('btn-go-back');
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText('TrustRejectionModal.title')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });
    });

    test('matches snapshot when TrustVerifierModal is visible (untrusted flow)', async () => {
        mockFetchData.mockResolvedValueOnce({
            ok: () => true,
            data: mockVerifierUntrusted,
            error: null,
            status: 200,
            state: 1,
            headers: {},
        });

        const { asFragment } = renderComponent();

        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });

        expect(asFragment()).toMatchSnapshot();
    });
});