import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CredentialRequestModal } from '../../modals/CredentialRequestModal';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';
import { useApiErrorHandler } from '../../hooks/useApiErrorHandler';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../../hooks/useApi', () => ({
    useApi: jest.fn(),
}));

jest.mock('../../hooks/useApiErrorHandler', () => ({
    useApiErrorHandler: jest.fn(),
}));

jest.mock('../../utils/api', () => ({
    api: {
        fetchPresentationCredentials: {
            url: jest.fn((presentationId: string) => `/wallets/test-wallet-id/presentations/${presentationId}/credentials`),
            methodType: 'GET',
            headers: () => ({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        },
        userRejectVerifier: {
            url: jest.fn((presentationId: string) => `/wallets/test-wallet-id/presentations/${presentationId}/reject`),
            methodType: 'POST',
            headers: () => ({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        }
    }
}));

jest.mock('../../utils/errorHandling', () => ({
    withErrorHandling: jest.fn(async (fn) => {
        try {
            await fn();
            return { error: null };
        } catch (error) {
            return { error };
        }
    }),
}));

jest.mock('../../modals/ModalWrapper', () => ({
    ModalWrapper: ({ header, footer, content, zIndex, size }: any) => (
        <>
            <div data-testid="ModalWrapper-BackDrop" className={`fixed inset-0 ${zIndex === 50 ? 'z-40' : 'z-30'} bg-black/60 backdrop-blur-sm`}></div>
            <div data-testid="ModalWrapper-Outer-Container" className={`fixed inset-0 ${zIndex === 50 ? 'z-50' : 'z-40'} overflow-y-auto overflow-x-hidden`}>
                <div className="min-h-full p-4 flex items-center justify-center">
                    <div data-testid="modal-wrapper-content">
                        {header}
                        {content}
                        {footer}
                    </div>
                </div>
            </div>
        </>
    ),
}));

jest.mock('../../modals/NoMatchingCredentialsModal', () => ({
    NoMatchingCredentialsModal: ({ isVisible, onGoToHome }: any) => (
        isVisible ? (
            <div data-testid="no-matching-credentials-modal">
                <button data-testid="btn-go-to-home" onClick={onGoToHome}>Go to Home</button>
            </div>
        ) : null
    ),
}));

jest.mock('../../modals/LoadingModal', () => ({
    LoaderModal: ({ isOpen, message }: any) => (
        isOpen ? (
            <div data-testid="modal-loader-card">
                <p>{message}</p>
            </div>
        ) : null
    ),
}));

jest.mock('../../modals/ErrorCard', () => ({
    ErrorCard: ({ isOpen, onClose, onRetry, isRetrying, title, description, testId }: any) => {
        if (!isOpen) return null;
        const isRetryable = !!onRetry;
        const button = isRetryable
            ? <button onClick={onRetry} disabled={isRetrying}>Retry</button>
            : (onClose ? <button onClick={onClose}>Close</button> : null);

        return (
            <div data-testid={testId}>
                <h2>{title}</h2>
                <p>{description}</p>
                {button}
            </div>
        );
    }
}));

jest.mock('../../components/Credentials/CredentialRequestModalHeader', () => ({
    CredentialRequestModalHeader: ({ verifierName }: any) => (
        <div data-testid="credential-request-modal-header">
            <h2>Request from {verifierName}</h2>
        </div>
    ),
}));

jest.mock('../../components/Credentials/CredentialRequestModalContent', () => ({
    CredentialRequestModalContent: ({ credentials, selectedCredentials, onCredentialToggle }: any) => (
        <div data-testid="credential-request-modal-content">
            {credentials.map((cred: any) => (
                <div key={cred.credentialId} data-testid={`credential-item-${cred.credentialId}`}>
                    <input
                        type="checkbox"
                        checked={selectedCredentials.includes(cred.credentialId)}
                        onChange={() => onCredentialToggle(cred.credentialId)}
                        data-testid={`checkbox-${cred.credentialId}`}
                    />
                    <span>{cred.credentialTypeDisplayName}</span>
                </div>
            ))}
        </div>
    ),
}));

jest.mock('../../components/Credentials/CredentialRequestModalFooter', () => ({
    CredentialRequestModalFooter: ({
                                       isConsentButtonEnabled,
                                       onCancel,
                                       onConsentAndShare
                                   }: any) => (
        <div data-testid="credential-request-modal-footer">
            <button
                data-testid="btn-cancel-desktop"
                onClick={onCancel}
                type="button"
            >
                Cancel
            </button>
            <button
                data-testid="btn-consent-share-desktop"
                onClick={onConsentAndShare}
                disabled={!isConsentButtonEnabled}
                type="button"
            >
                Consent & Share
            </button>
        </div>
    ),
}));

describe('CredentialRequestModal', () => {
    const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
    const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;
    const mockUseApiErrorHandler = useApiErrorHandler as jest.MockedFunction<typeof useApiErrorHandler>;

    const defaultProps = {
        isVisible: true,
        verifierName: 'Test Verifier',
        presentationId: 'test-presentation-id',
        verifier: {
            redirectUri: null,
        },
        onCancel: jest.fn(),
        onConsentAndShare: jest.fn(),
    };

    const mockFetchData = jest.fn();
    const mockHandleApiError = jest.fn();
    const mockHandleCloseErrorCard = jest.fn();
    const mockOnRetry = jest.fn();
    let mockErrorHandlerReturnValue: ReturnType<typeof useApiErrorHandler>;

    const mockCredentials = [
        {
            credentialId: 'cred-1',
            credentialTypeDisplayName: 'Driving License',
            issuer: 'Test Issuer 1',
            credentialType: 'DrivingLicense',
            credentialSubject: {},
            issuanceDate: '2023-01-01',
            expirationDate: '2024-01-01',
        },
        {
            credentialId: 'cred-2',
            credentialTypeDisplayName: 'Passport',
            issuer: 'Test Issuer 2',
            credentialType: 'Passport',
            credentialSubject: {},
            issuanceDate: '2023-01-01',
            expirationDate: '2024-01-01',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseTranslation.mockReturnValue({
            t: (key: string) => key.includes('loading.message') ? 'Loading...' : key,
        } as any);

        // Mock successful API response with credentials by default
        mockFetchData.mockResolvedValue({
            data: {
                availableCredentials: mockCredentials,
                missingClaims: [],
            },
            error: null,
            status: 200,
            ok: () => true,
        });

        mockUseApi.mockReturnValue({
            fetchData: mockFetchData,
            data: null,
            error: null,
            state: 'idle' as any,
            status: null,
            ok: () => true,
        });

        // Initialize the new, simplified hook state
        mockErrorHandlerReturnValue = {
            showError: false,
            isRetrying: false,
            errorTitle: undefined,
            errorDescription: undefined,
            onRetry: mockOnRetry,
            onClose: mockHandleCloseErrorCard,
            handleApiError: mockHandleApiError,
            clearError: jest.fn(),
        };
        mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);
    });

    describe('Rendering', () => {
        it('renders modal when visible', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('ModalWrapper-Outer-Container')).toBeInTheDocument();
                expect(screen.getByTestId('credential-request-modal-header')).toBeInTheDocument();
            });
        });

        it('does not render when not visible', () => {
            render(<CredentialRequestModal {...defaultProps} isVisible={false} />);

            expect(screen.queryByTestId('ModalWrapper-Outer-Container')).not.toBeInTheDocument();
        });

        it('renders with correct verifier name', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByText('Request from Test Verifier')).toBeInTheDocument();
            });
        });

        it('renders credential list with provided credentials', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the API call to complete and component to re-render
            await waitFor(() => {
                expect(mockFetchData).toHaveBeenCalled();
            });

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.queryByTestId('no-matching-credentials-modal')).not.toBeInTheDocument();
                expect(screen.getByTestId('credential-item-cred-1')).toBeInTheDocument();
                expect(screen.getByTestId('credential-item-cred-2')).toBeInTheDocument();
            });
        });
    });

    describe('Loading State', () => {
        it('shows loading state when loading credentials', async () => {
            mockFetchData.mockImplementation(() => new Promise(() => {}));

            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('modal-loader-card')).toBeInTheDocument();
            });
        });

        it('hides loading state when not loading', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the API call to complete
            await waitFor(() => {
                expect(mockFetchData).toHaveBeenCalled();
            });

            // Loading state should be hidden after API call completes
            await waitFor(() => {
                expect(screen.queryByTestId('modal-loader-card')).not.toBeInTheDocument();
            });
        });
    });

    describe('Retry State', () => {
        it('shows ErrorCard with Retry button when hook indicates a retryable error', () => {
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                showError: true, // Use showError
                errorTitle: 'Retryable Error',
                errorDescription: 'Please try again',
                onRetry: mockOnRetry, // Provide retry function
                onClose: undefined, // No close function
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<CredentialRequestModal {...defaultProps} />);

            const retryCard = screen.getByTestId('modal-error-card'); // Use the ErrorCard's testId
            expect(retryCard).toBeInTheDocument();
            expect(retryCard).toHaveTextContent('Retryable ErrorPlease try again');
            expect(screen.getByText('Retry')).toBeInTheDocument(); // Check for Retry button

            expect(screen.queryByTestId('modal-loader-card')).not.toBeInTheDocument();
            expect(screen.queryByTestId('no-matching-credentials-modal')).not.toBeInTheDocument();
            expect(screen.queryByTestId('credential-request-modal-content')).not.toBeInTheDocument();
        });

        it('calls onRetry from hook when ErrorCard retry button is clicked', () => {
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                showError: true,
                onRetry: mockOnRetry,
                onClose: undefined,
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<CredentialRequestModal {...defaultProps} />);

            const retryButton = screen.getByRole('button', { name: 'Retry' });
            fireEvent.click(retryButton);

            expect(mockOnRetry).toHaveBeenCalledTimes(1);
        });

        it('shows LoaderModal when hook indicates isRetrying is true', () => {
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                isRetrying: true,
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<CredentialRequestModal {...defaultProps} />);

            expect(screen.getByTestId('modal-loader-card')).toBeInTheDocument();

            expect(screen.queryByTestId('modal-error-card')).not.toBeInTheDocument();
            expect(screen.queryByTestId('no-matching-credentials-modal')).not.toBeInTheDocument();
            expect(screen.queryByTestId('credential-request-modal-content')).not.toBeInTheDocument();
        });
    });

    describe('Error State', () => {
        it('shows ErrorCard with Close button when hook indicates a final error', () => {
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                showError: true,
                errorTitle: 'Error title',
                errorDescription: 'Error message',
                onRetry: undefined, // No retry function
                onClose: mockHandleCloseErrorCard, // Close function is present
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<CredentialRequestModal {...defaultProps} />);

            const errorCard = screen.getByTestId('modal-error-card');
            expect(errorCard).toBeInTheDocument();
            expect(errorCard).toHaveTextContent('Error titleError message');
            expect(screen.getByText('Close')).toBeInTheDocument(); // Check for Close button
            expect(screen.queryByText('Retry')).not.toBeInTheDocument();
        });

        it('calls handleApiError when fetch credentials throws', async () => {
            const walletError = new Error('Wallet ID not available.');
            mockFetchData.mockRejectedValue(walletError);

            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(mockHandleApiError).toHaveBeenCalledWith(
                    walletError,
                    'fetchPresentationCredentials',
                    expect.any(Function),
                    expect.any(Function)
                );
            });
        });
    });

    describe('No Credentials State', () => {
        it('shows no credentials message when no credentials are available', async () => {
            mockFetchData.mockResolvedValue({
                data: {
                    availableCredentials: [],
                    missingClaims: [],
                },
                error: null,
                status: 200,
                ok: () => true,
            });

            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('no-matching-credentials-modal')).toBeInTheDocument();
            });
        });
    });

    describe('Credential Selection', () => {
        beforeEach(async () => {
            mockFetchData.mockResolvedValue({
                data: {
                    availableCredentials: mockCredentials,
                    missingClaims: []
                },
                error: null,
                status: 200,
                ok: () => true,
            });
        });

        it('allows selecting and deselecting credentials', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.getByTestId('checkbox-cred-1')).toBeInTheDocument();
            });

            const checkbox1 = screen.getByTestId('checkbox-cred-1');
            const checkbox2 = screen.getByTestId('checkbox-cred-2');

            // Initially unchecked
            expect(checkbox1).not.toBeChecked();
            expect(checkbox2).not.toBeChecked();

            // Select first credential
            fireEvent.click(checkbox1);
            expect(checkbox1).toBeChecked();

            // Select second credential
            fireEvent.click(checkbox2);
            expect(checkbox2).toBeChecked();

            // Deselect first credential
            fireEvent.click(checkbox1);
            expect(checkbox1).not.toBeChecked();
        });

        it('enables consent button when credentials are selected', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.getByTestId('checkbox-cred-1')).toBeInTheDocument();
            });

            const consentButton = screen.getByTestId('btn-consent-share-desktop');
            expect(consentButton).toBeDisabled();

            // Select a credential
            fireEvent.click(screen.getByTestId('checkbox-cred-1'));

            await waitFor(() => {
                expect(consentButton).not.toBeDisabled();
            });
        });

        it('disables consent button when no credentials are selected', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.getByTestId('btn-consent-share-desktop')).toBeInTheDocument();
            });

            const consentButton = screen.getByTestId('btn-consent-share-desktop');
            expect(consentButton).toBeDisabled();
        });
    });

    describe('User Interactions', () => {
        it('calls onCancel when cancel button is clicked', async () => {
            // Mock both API calls: 1. fetchCredentials, 2. userRejectVerifier
            mockFetchData
                .mockResolvedValueOnce({
                    data: { availableCredentials: mockCredentials, missingClaims: [] },
                    error: null, status: 200, ok: () => true,
                })
                .mockResolvedValueOnce({
                    data: { success: true }, error: null, status: 200, ok: () => true
                });


            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('btn-cancel-desktop')).toBeInTheDocument();
            });

            const cancelButton = screen.getByTestId('btn-cancel-desktop');
            fireEvent.click(cancelButton);

            // Wait for async operations to complete
            await waitFor(() => {
                expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
            });
        });

        it('calls onConsentAndShare when consent button is clicked with selected credentials', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('checkbox-cred-1')).toBeInTheDocument();
            });

            // Select a credential
            fireEvent.click(screen.getByTestId('checkbox-cred-1'));

            await waitFor(() => {
                expect(screen.getByTestId('btn-consent-share-desktop')).not.toBeDisabled();
            });

            const consentButton = screen.getByTestId('btn-consent-share-desktop');
            fireEvent.click(consentButton);

            expect(defaultProps.onConsentAndShare).toHaveBeenCalledWith([
                expect.objectContaining({
                    credentialId: 'cred-1',
                }),
            ]);
        });


        it('does not call onConsentAndShare when consent button is disabled', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('btn-consent-share-desktop')).toBeInTheDocument();
            });

            const consentButton = screen.getByTestId('btn-consent-share-desktop');
            expect(consentButton).toBeDisabled();

            // Try to click disabled button
            fireEvent.click(consentButton);

            expect(defaultProps.onConsentAndShare).not.toHaveBeenCalled();
        });
    });

    describe('API Integration', () => {
        it('fetches credentials on mount', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(mockFetchData).toHaveBeenCalledTimes(1);
            });

            // Check that the API was called with the correct parameters
            const callArgs = mockFetchData.mock.calls[0][0];
            expect(callArgs).toBeDefined();
            expect(callArgs.apiConfig).toHaveProperty('methodType', 'GET');
            expect(callArgs.apiConfig).toHaveProperty('credentials', 'include');
        });

        it('handles API errors gracefully', async () => {
            const apiError = new Error('API Error');
            mockFetchData.mockRejectedValue(apiError);

            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(mockHandleApiError).toHaveBeenCalledWith(
                    apiError,
                    'fetchPresentationCredentials',
                    expect.any(Function),
                    expect.any(Function)
                );
            });
        });
    });

    describe('ModalWrapper Configuration', () => {
        it('passes correct props to ModalWrapper', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.getByTestId('ModalWrapper-Outer-Container')).toBeInTheDocument();
            });

            const modalWrapper = screen.getByTestId('ModalWrapper-Outer-Container');
            expect(modalWrapper).toHaveClass('z-50');
        });
    });

    describe('Accessibility', () => {
        it('has proper test IDs for testing', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.getByTestId('credential-request-modal-header')).toBeInTheDocument();
                expect(screen.getByTestId('credential-request-modal-content')).toBeInTheDocument();
                expect(screen.getByTestId('credential-request-modal-footer')).toBeInTheDocument();
            });
        });

        it('has proper button types', async () => {
            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('btn-cancel-desktop')).toHaveAttribute('type', 'button');
                expect(screen.getByTestId('btn-consent-share-desktop')).toHaveAttribute('type', 'button');
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles empty credentials array', async () => {
            mockFetchData.mockResolvedValue({
                data: {
                    availableCredentials: [],
                    missingClaims: []
                },
                error: null,
                status: 200,
                ok: () => true,
            });

            render(<CredentialRequestModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('no-matching-credentials-modal')).toBeInTheDocument();
            });
        });

        it('handles undefined verifier redirectUri', async () => {
            const propsWithoutRedirectUri = {
                ...defaultProps,
                verifier: { redirectUri: null },
            };

            render(<CredentialRequestModal {...propsWithoutRedirectUri} />);

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.getByTestId('ModalWrapper-Outer-Container')).toBeInTheDocument();
            });
        });

    });

    describe('Performance', () => {
        it('does not re-render unnecessarily when props are the same', async () => {
            const { rerender } = render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the main modal to render with credentials loaded
            await waitFor(() => {
                expect(screen.getByTestId('credential-request-modal-content')).toBeInTheDocument();
            });

            const initialContent = screen.getByTestId('credential-request-modal-content').innerHTML;

            rerender(<CredentialRequestModal {...defaultProps} />);

            // Content should remain the same after rerender with same props
            const afterRerenderContent = screen.getByTestId('credential-request-modal-content').innerHTML;
            expect(afterRerenderContent).toBe(initialContent);
        });

        it('re-renders when isVisible prop changes', async () => {
            const { rerender } = render(<CredentialRequestModal {...defaultProps} />);

            // Wait for the main modal to render (not NoMatchingCredentialsModal)
            await waitFor(() => {
                expect(screen.getByTestId('ModalWrapper-Outer-Container')).toBeInTheDocument();
            });

            rerender(<CredentialRequestModal {...defaultProps} isVisible={false} />);

            expect(screen.queryByTestId('ModalWrapper-Outer-Container')).not.toBeInTheDocument();
        });
    });
});