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

const MockCredentialRequestModal = jest.fn();
jest.mock('../../modals/CredentialRequestModal', () => ({
    CredentialRequestModal: (props: any) => {
        MockCredentialRequestModal(props);
        if (!props.isVisible) return null;
        return (
            <div data-testid="modal-credential-request">
                <span>{`Request for ${props.verifierName}`}</span>
                <button data-testid="btn-cr-cancel" onClick={props.onCancel}>CR-Cancel</button>
                <button data-testid="btn-cr-consent" onClick={() => props.onConsentAndShare(['mock-cred-id'])}>CR-Consent</button>
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
            <div data-testid="modal-error-card">
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
            <div data-testid="modal-trust-rejection-modal">
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

const getErrorCardTitle = () => screen.getByText('ErrorCard.defaultTitle');
const getLoaderModalTitle = () => screen.getByText('loadingCard.title');
const getVerifierName = (name: string) => screen.getByText(name);
const queryTrustVerifierModal = () => screen.queryByTestId('modal-trust-verifier');
const queryCredentialRequestModal = () => screen.queryByTestId('modal-credential-request');


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

    test('renders Sidebar and LoaderModal initially and calls validateVerifierRequest with correct URL parsing', async () => {
        const route = "/user/authorize?authorizationRequestUrl=https%3A%2F%2Fverifier.com%2Frequest%3Fdata%3D123";
        renderComponent(route);

        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();

        const loaderModalTitle = await waitFor(() => getLoaderModalTitle());
        expect(loaderModalTitle).toBeInTheDocument();

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                expect.objectContaining({
                    apiConfig: api.validateVerifierRequest,
                    body: { authorizationRequestUrl: 'https%3A%2F%2Fverifier.com%2Frequest%3Fdata%3D123' },
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
            expect(screen.getByTestId('modal-error-card')).toBeVisible();
        });

        const closeButton = screen.getByRole('button', { name: /Close/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
        });
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
            ok: () => true,
            data: mockVerifierUntrusted,
            error: null,
            status: 200,
            state: 1,
            headers: {},
        });

        renderComponent();

        const verifierNameElement = await waitFor(() => getVerifierName(mockVerifierUntrusted.verifier.name));
        expect(verifierNameElement).toBeVisible();

        expect(queryCredentialRequestModal()).not.toBeInTheDocument();
    });

    test('untrusted flow: calls addTrustedVerifier and proceeds to CredentialRequestModal on "Trust" click', async () => {
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

    test('untrusted flow: shows ErrorCard if addTrustedVerifier fails on "Trust" click', async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true, data: mockVerifierUntrusted, error: null, status: 200, state: 1, headers: {} });
        mockFetchData.mockResolvedValueOnce({ ok: () => false, error: { message: "Trust API Failed" } as any, data: null, status: 500, state: 2, headers: {} });

        renderComponent();

        await waitFor(() => {
            expect(getVerifierName(mockVerifierUntrusted.verifier.name)).toBeVisible();
        });

        const trustButton = screen.getByTestId('btn-trust-verifier');
        fireEvent.click(trustButton);

        await waitFor(() => {
            expect(getErrorCardTitle()).toBeVisible();
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

    test('CredentialRequestModal consent navigates to ROOT (pending implementation)', async () => {
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByTestId('modal-credential-request')).toBeVisible();
        });

        const consentButton = screen.getByTestId('btn-cr-consent');
        fireEvent.click(consentButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
            expect(queryCredentialRequestModal()).not.toBeInTheDocument();
        });
    });

    test('untrusted flow: opens TrustRejectionModal on "Cancel" and handles confirmation to ROOT', async () => {
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

    test('untrusted flow: opens TrustRejectionModal on "Cancel" and handles closure to return to TrustVerifierModal', async () => {
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
            expect(screen.queryByText('TrustRejectionModal.title')).not.toBeInTheDocument();
            expect(screen.queryByTestId('modal-credential-request')).not.toBeInTheDocument();
        });

        await waitFor(() => {
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