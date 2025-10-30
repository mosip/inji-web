import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NoMatchingCredentialsModal } from '../../modals/NoMatchingCredentialsModal';
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

// Mock the error handler hook
jest.mock('../../hooks/useApiErrorHandler', () => ({
    useApiErrorHandler: jest.fn(),
}));

// Mock the new "smart" ErrorCard
jest.mock('../../modals/ErrorCard', () => ({
    ErrorCard: ({ isOpen, onClose, onRetry, isRetrying, title, description, testId }: any) => {
        if (!isOpen) return null;

        const isRetryable = !!onRetry;
        const button = isRetryable
            ? <button onClick={onRetry} disabled={isRetrying}>Retry</button>
            : (onClose ? <button onClick={onClose}>Close</button> : null);

        return (
            <div data-testid={testId}>
                ErrorCard Mock: {title} - {description}
                {button}
            </div>
        );
    }
}));
// Removed RetryCard mock

jest.mock('../../modals/ModalWrapper', () => ({
    ModalWrapper: ({ header, footer, content, zIndex, size }: any) => (
        <div data-testid="ModalWrapper-Mock" data-z-index={zIndex} data-size={size}>
            {header}
            {content}
            {footer}
        </div>
    ),
}));

jest.mock('../../components/Common/Buttons/SolidButton', () => ({
    SolidButton: ({ onClick, title, testId, fullWidth, className, disabled }: any) => (
        <button
            data-testid={testId}
            onClick={onClick}
            data-full-width={fullWidth}
            className={className}
            type="button"
            disabled={disabled}
        >
            {title}
        </button>
    ),
}));

jest.mock('../../assets/error_message.svg', () => 'error-message-icon-mock.svg');

describe('NoMatchingCredentialsModal', () => {
    const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
    const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;
    const mockUseApiErrorHandler = useApiErrorHandler as jest.MockedFunction<typeof useApiErrorHandler>;

    const defaultProps = {
        isVisible: true,
        missingClaims: ['claim1', 'claim2'],
        onGoToHome: jest.fn(),
        redirectUri: 'https://example.com/redirect',
        presentationId: 'test-presentation-id',
    };

    const mockFetchData = jest.fn();
    let mockErrorHandlerReturnValue: ReturnType<typeof useApiErrorHandler>;

    let originalLocation: Location;

    beforeEach(() => {
        jest.clearAllMocks();

        originalLocation = window.location;

        mockUseTranslation.mockReturnValue({
            t: (key: string) => {
                const translations: Record<string, string> = {
                    'title': 'No Matching Credentials',
                    'description': 'You do not have the required credentials to proceed.',
                    'goToHomeButton': 'Go to Home',
                    'ErrorCard.defaultTitle': 'Default Error Title',
                    'ErrorCard.defaultDescription': 'Default Error Description',
                    'ErrorCard.closeButton': 'Close',
                    'RetryCard.defaultDescription': 'Default Retry Description',
                    'RetryCard.retryButton': 'Retry',
                };
                return translations[key] || key;
            },
        } as any);

        mockUseApi.mockReturnValue({
            fetchData: mockFetchData,
            data: null,
            error: null,
            state: 'idle' as any,
            status: null,
            ok: () => true,
        });

        // Default mock return value for the new error handler
        mockErrorHandlerReturnValue = {
            showError: false,
            isRetrying: false,
            errorTitle: undefined,
            errorDescription: undefined,
            onRetry: undefined, // Default to non-retryable
            onClose: jest.fn(), // Default to having a close function
            handleApiError: jest.fn(),
            clearError: jest.fn(),
        };
        mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
            configurable: true,
        });
    });

    const setupWindowLocationMock = (initialHref: string = '') => {
        delete (window as any).location;
        window.location = { href: initialHref } as any;
    };

    describe('Rendering', () => {
        it('renders nothing when not visible', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} isVisible={false} />);
            expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
        });

        it('renders modal when visible and no error', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
            expect(screen.getByTestId('img-no-matching-credentials-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('modal-error-handler-no-matching')).not.toBeInTheDocument();
        });

        it('renders error icon', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const errorIcon = screen.getByTestId('img-no-matching-credentials-icon');
            expect(errorIcon).toBeInTheDocument();
            expect(errorIcon).toHaveAttribute('src', 'error-message-icon-mock.svg');
            expect(errorIcon).toHaveAttribute('alt', 'Error Icon');
        });

        it('renders title and description from translations', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            expect(screen.getByText('No Matching Credentials')).toBeInTheDocument();
            expect(screen.getByText('You do not have the required credentials to proceed.')).toBeInTheDocument();
        });

        it('renders go to home button', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            expect(goToHomeButton).toBeInTheDocument();
            expect(goToHomeButton).toHaveTextContent('Go to Home');
        });
    });

    describe('User Interactions', () => {
        it('calls onGoToHome when go to home button is clicked without presentationId', async () => {
            const propsWithoutPresentationId = {
                ...defaultProps,
                presentationId: undefined,
                redirectUri: undefined,
            };
            render(<NoMatchingCredentialsModal {...propsWithoutPresentationId} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            await waitFor(() => {
                expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1);
            });
            expect(mockFetchData).not.toHaveBeenCalled();
        });

        it('redirects when go to home button is clicked without presentationId but with redirectUri', () => {
            const propsWithoutPresentationId = {
                ...defaultProps,
                presentationId: undefined,
            };
            setupWindowLocationMock();
            render(<NoMatchingCredentialsModal {...propsWithoutPresentationId} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            expect(window.location.href).toBe('https://example.com/redirect');
        });

        it('calls API to reject verifier when presentationId is provided', async () => {
            mockFetchData.mockResolvedValue({ data: { success: true }, error: null, status: 200, ok: () => true });
            setupWindowLocationMock();
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            await waitFor(() => {
                expect(mockFetchData).toHaveBeenCalledWith({
                    url: expect.stringContaining('/presentations/test-presentation-id'),
                    apiConfig: expect.any(Object),
                    body: { errorCode: 'access_denied', errorMessage: 'User denied authorization to share credentials' },
                });
            });
            expect(window.location.href).toBe('https://example.com/redirect');
        });

        it('calls onGoToHome when no redirectUri is provided after successful API call', async () => {
            const propsWithoutRedirectUri = { ...defaultProps, redirectUri: undefined };
            mockFetchData.mockResolvedValue({ data: { success: true }, error: null, status: 200, ok: () => true });
            render(<NoMatchingCredentialsModal {...propsWithoutRedirectUri} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            await waitFor(() => { expect(mockFetchData).toHaveBeenCalled(); });
            expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1);
        });
    });

    describe('API Integration', () => {
        it('handles API success correctly and redirects', async () => {
            mockFetchData.mockResolvedValue({ data: { success: true }, error: null, status: 200, ok: () => true });
            setupWindowLocationMock();
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            await waitFor(() => {
                expect(mockFetchData).toHaveBeenCalledWith({
                    url: expect.stringContaining('/presentations/test-presentation-id'),
                    apiConfig: expect.any(Object),
                    body: { errorCode: 'access_denied', errorMessage: 'User denied authorization to share credentials' },
                });
            });
            expect(window.location.href).toBe('https://example.com/redirect');
        });

        it('calls handleApiError when API throws error', async () => {
            const error = new Error('API Error');
            mockFetchData.mockRejectedValue(error);
            setupWindowLocationMock('');
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');

            fireEvent.click(goToHomeButton);

            await waitFor(() => {
                expect(mockErrorHandlerReturnValue.handleApiError).toHaveBeenCalledWith(
                    error,
                    "rejectVerifier",
                    expect.any(Function), // rejectVerifierCore
                    expect.any(Function)  // handleExit
                );
            });

            expect(mockErrorHandlerReturnValue.handleApiError).toHaveBeenCalledWith(
                error,
                "rejectVerifier",
                expect.any(Function), // rejectVerifierCore
                expect.any(Function)  // handleExit
            );
            expect(window.location.href).toBe('');
            expect(goToHomeButton).not.toBeDisabled();
        });
    });

    describe('Error/Retry Handling', () => {
        it('shows ErrorCard with "Close" button for non-retryable error', async () => {
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                showError: true,
                errorTitle: 'Final Error',
                errorDescription: 'This is a final error.',
                onRetry: undefined,
                onClose: jest.fn(),
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<NoMatchingCredentialsModal {...defaultProps} />);

            const errorCard = screen.getByTestId('modal-error-handler-no-matching');
            expect(errorCard).toBeInTheDocument();
            expect(errorCard).toHaveTextContent('ErrorCard Mock: Final Error - This is a final error.');

            expect(screen.getByText('Close')).toBeInTheDocument();
            expect(screen.queryByText('Retry')).not.toBeInTheDocument();

            expect(screen.queryByTestId('card-no-matching-credentials-modal')).not.toBeInTheDocument();
        });

        it('shows ErrorCard with "Retry" button for retryable error', async () => {
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                showError: true,
                errorTitle: 'Retryable Error',
                errorDescription: 'Please try again.',
                onRetry: jest.fn(),
                onClose: undefined,
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<NoMatchingCredentialsModal {...defaultProps} />);

            const errorCard = screen.getByTestId('modal-error-handler-no-matching');
            expect(errorCard).toBeInTheDocument();
            expect(errorCard).toHaveTextContent('ErrorCard Mock: Retryable Error - Please try again.');

            expect(screen.getByText('Retry')).toBeInTheDocument();
            expect(screen.queryByText('Close')).not.toBeInTheDocument();

            expect(screen.queryByTestId('card-no-matching-credentials-modal')).not.toBeInTheDocument();
        });

        it('calls onClose from hook when ErrorCard close button is clicked', () => {
            const mockOnClose = jest.fn();
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                showError: true,
                onClose: mockOnClose
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<NoMatchingCredentialsModal {...defaultProps} />);

            const closeButton = screen.getByText('Close');
            fireEvent.click(closeButton);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('calls onRetry from hook when ErrorCard retry button is clicked', () => {
            const mockOnRetry = jest.fn();
            mockErrorHandlerReturnValue = {
                ...mockErrorHandlerReturnValue,
                showError: true,
                onRetry: mockOnRetry
            };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<NoMatchingCredentialsModal {...defaultProps} />);

            const retryButton = screen.getByText('Retry');
            fireEvent.click(retryButton);
            expect(mockOnRetry).toHaveBeenCalledTimes(1);
        });

        it('disables Go To Home button when isRetrying is true', () => {
            mockErrorHandlerReturnValue = { ...mockErrorHandlerReturnValue, isRetrying: true };
            mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);

            render(<NoMatchingCredentialsModal {...defaultProps} />);

            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            expect(goToHomeButton).toBeDisabled();
        });

        it('disables Go To Home button when isSubmitting is true', async () => {
            mockFetchData.mockImplementation(() => new Promise(() => {}));

            render(<NoMatchingCredentialsModal {...defaultProps} />);

            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            expect(goToHomeButton).not.toBeDisabled(); // Enabled before click

            fireEvent.click(goToHomeButton);

            await waitFor(() => {
                expect(goToHomeButton).toBeDisabled(); // Disabled after click
            });
        });

        it('prevents multiple API calls on rapid clicks', async () => {
            mockFetchData.mockResolvedValueOnce({ data: { success: true }, error: null, status: 200, ok: () => true });
            setupWindowLocationMock('');

            render(<NoMatchingCredentialsModal {...defaultProps} />);

            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            fireEvent.click(goToHomeButton);
            fireEvent.click(goToHomeButton);

            await waitFor(() => { expect(mockFetchData).toHaveBeenCalledTimes(1); });
            expect(window.location.href).toBe(defaultProps.redirectUri);
        });
    });

    describe('Component Structure', () => {
        it('renders all required elements', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
            expect(screen.getByTestId('img-no-matching-credentials-icon')).toBeInTheDocument();
            expect(screen.getByTestId('text-no-matching-credentials-description')).toBeInTheDocument();
            expect(screen.getByTestId('btn-go-to-home')).toBeInTheDocument();
        });

        it('has correct CSS classes for responsive design', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const modalContainer = screen.getByTestId('card-no-matching-credentials-modal');
            expect(modalContainer).toHaveClass('w-full', 'max-w-[400px]', 'min-h-[350px]');
        });

        it('passes correct props to ModalWrapper', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const modalWrapper = screen.getByTestId('ModalWrapper-Mock');
            expect(modalWrapper).toHaveAttribute('data-z-index', '50');
            expect(modalWrapper).toHaveAttribute('data-size', 'md');
        });
    });

    describe('Props Handling', () => {
        it('handles missing claims prop', () => {
            const propsWithoutMissingClaims = { ...defaultProps, missingClaims: undefined };
            render(<NoMatchingCredentialsModal {...propsWithoutMissingClaims} />);
            expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
        });

        it('handles empty missing claims array', () => {
            const propsWithEmptyMissingClaims = { ...defaultProps, missingClaims: [] };
            render(<NoMatchingCredentialsModal {...propsWithEmptyMissingClaims} />);
            expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
        });

        it('handles undefined redirectUri', async () => {
            const propsWithoutRedirectUri = { ...defaultProps, redirectUri: undefined };
            mockFetchData.mockResolvedValue({ data: { success: true }, error: null, status: 200, ok: () => true });
            render(<NoMatchingCredentialsModal {...propsWithoutRedirectUri} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            await waitFor(() => { expect(mockFetchData).toHaveBeenCalled(); });
            expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1);
        });

        it('handles undefined presentationId', async () => {
            const propsWithoutPresentationId = { ...defaultProps, presentationId: undefined, redirectUri: undefined };
            render(<NoMatchingCredentialsModal {...propsWithoutPresentationId} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            await waitFor(() => { expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1); });
            expect(mockFetchData).not.toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const title = screen.getByText('No Matching Credentials');
            expect(title).toHaveAttribute('id', 'title-no-matching-credentials');
            const description = screen.getByTestId('text-no-matching-credentials-description');
            expect(description).toBeInTheDocument();
        });

        it('has proper button attributes', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            expect(goToHomeButton).toBeInTheDocument();
            expect(goToHomeButton.tagName).toBe('BUTTON');
            expect(goToHomeButton).toHaveAttribute('type', 'button');
        });
    });

    describe('Edge Cases', () => {
        it('handles undefined onGoToHome callback', () => {
            const propsWithoutCallback = { ...defaultProps, onGoToHome: undefined as any, presentationId: undefined, redirectUri: undefined };
            render(<NoMatchingCredentialsModal {...propsWithoutCallback} />);
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            expect(() => { fireEvent.click(goToHomeButton); }).not.toThrow();
        });

        it('handles special characters in missing claims', () => {
            const propsWithSpecialClaims = { ...defaultProps, missingClaims: ['claim@#$%', 'claim with spaces', 'claim-with-dashes'] };
            render(<NoMatchingCredentialsModal {...propsWithSpecialClaims} />);
            const description = screen.getByTestId('text-no-matching-credentials-description');
            expect(description).toHaveTextContent(/Missing: claim@#\$%, claim with spaces, claim-with-dashes/);
        });
    });

    describe('Internationalization', () => {
        it('uses correct translation namespace', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            expect(mockUseTranslation).toHaveBeenCalledWith('NoMatchingCredentialsModal');
        });

        it('handles missing translation keys gracefully', () => {
            mockUseTranslation.mockReturnValue({ t: (key: string) => key } as any);
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            expect(screen.getByText('title')).toBeInTheDocument();
            expect(screen.getByText('description')).toBeInTheDocument();
            expect(screen.getByText('goToHomeButton')).toBeInTheDocument();
        });
    });

    describe('Performance', () => {
        it('does not re-render unnecessarily when props are the same', () => {
            const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);
            const initialModal = screen.getByTestId('ModalWrapper-Mock');
            rerender(<NoMatchingCredentialsModal {...defaultProps} />);
            const afterRerender = screen.getByTestId('ModalWrapper-Mock');
            expect(initialModal).toBe(afterRerender);
        });

        it('re-renders when isVisible prop changes', () => {
            const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);
            expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
            rerender(<NoMatchingCredentialsModal {...defaultProps} isVisible={false} />);
            expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
        });

        it('re-renders when callback props change', () => {
            const newOnGoToHome = jest.fn();
            const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);
            const initialModal = screen.getByTestId('ModalWrapper-Mock');
            rerender(<NoMatchingCredentialsModal {...defaultProps} onGoToHome={newOnGoToHome} />);
            const afterRerender = screen.getByTestId('ModalWrapper-Mock');
            expect(afterRerender).toBeInTheDocument();
        });
    });

    describe('Responsive Design', () => {
        it('applies mobile-first responsive classes', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const modalContainer = screen.getByTestId('card-no-matching-credentials-modal');
            expect(modalContainer).toHaveClass('w-full', 'max-w-[400px]', 'min-h-[350px]');
        });

        it('applies mobile breakpoint classes', () => {
            render(<NoMatchingCredentialsModal {...defaultProps} />);
            const modalContainer = screen.getByTestId('card-no-matching-credentials-modal');
            expect(modalContainer).toHaveClass('max-[533px]:w-screen', 'max-[533px]:fixed', 'max-[533px]:inset-x-0', 'max-[533px]:z-[60]');
        });
    });
});