import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { CredentialShareHandler } from "../../handlers/CredentialShareHandler";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";

const mockFetchData = jest.fn();
jest.mock("../../hooks/useApi", () => ({
    useApi: () => ({ fetchData: mockFetchData }),
}));

jest.mock("../../hooks/useApiErrorHandler");
const mockUseApiErrorHandler = useApiErrorHandler as jest.Mock;

jest.mock("../../modals/LoadingModal", () => ({
    LoaderModal: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div data-testid="modal-loader-card" /> : null,
}));

jest.mock("../../modals/ErrorCard", () => ({
    ErrorCard: ({ isOpen, onClose, onRetry, isRetrying, title, description, testId }: any) => {
        if (!isOpen) return null;
        const isRetryable = !!onRetry;
        const button = isRetryable
            ? <button onClick={onRetry} disabled={isRetrying}>Retry</button>
            : (onClose ? <button onClick={onClose}>Close</button> : null);

        return (
            <div data-testid={testId}>
                {title}: {description}
                {button}
            </div>
        );
    }
}));

jest.mock("../../modals/CredentialShareSuccessModal", () => ({
    CredentialShareSuccessModal: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div data-testid="success-modal" /> : null,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key === 'message' ? 'Sharing credentials...' : key,
    }),
}));

describe("CredentialShareHandler", () => {
    const defaultProps = {
        verifierName: "TestVerifier",
        returnUrl: "https://verifier.example.com/callback",
        selectedCredentials: [
            {
                credentialId: "cred-1",
                credentialTypeDisplayName: "Test Credential",
                credentialTypeLogo: "https://example.com/logo.png",
                format: "jwt",
            },
        ],
        presentationId: "pres-123",
        onClose: jest.fn(),
    };

    const mockHandleApiError = jest.fn();
    const mockHandleCloseErrorCard = jest.fn();
    const mockOnRetry = jest.fn();
    let mockErrorHandlerReturnValue: ReturnType<typeof useApiErrorHandler>;

    beforeEach(() => {
        jest.clearAllMocks();
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

    it("shows loading modal initially", () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true });
        render(<CredentialShareHandler {...defaultProps} />);
        expect(screen.getByTestId("modal-loader-card")).toBeInTheDocument();
    });

    it("shows success modal when API call succeeds", async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true });
        render(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() =>
            expect(screen.getByTestId("success-modal")).toBeInTheDocument()
        );
        expect(screen.queryByTestId("modal-loader-card")).not.toBeInTheDocument();
    });

    it("shows error card when API call fails (response error)", async () => {
        const errorResponse = {
            ok: () => false,
            error: { message: "Failed to submit presentation" },
        };
        mockFetchData.mockResolvedValueOnce(errorResponse);

        mockUseApiErrorHandler.mockImplementation(() => {
            if (mockHandleApiError.mock.calls.length > 0) {
                return {
                    ...mockErrorHandlerReturnValue,
                    showError: true,
                    errorTitle: 'API Error',
                    errorDescription: 'Failed to submit presentation',
                    onRetry: undefined,
                };
            }
            return mockErrorHandlerReturnValue;
        });

        const { rerender } = render(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() => expect(mockHandleApiError).toHaveBeenCalled());
        rerender(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() =>
            expect(screen.getByTestId("modal-error-card")).toHaveTextContent(
                "Failed to submit presentation"
            )
        );
        expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("shows error card when fetch throws (network/unexpected error)", async () => {
        const networkError = new Error("Network error");
        mockFetchData.mockRejectedValueOnce(networkError);

        mockUseApiErrorHandler.mockImplementation(() => {
            if (mockHandleApiError.mock.calls.length > 0) {
                return {
                    ...mockErrorHandlerReturnValue,
                    showError: true,
                    errorTitle: 'Network Error',
                    errorDescription: 'Network error',
                    onRetry: undefined,
                };
            }
            return mockErrorHandlerReturnValue;
        });

        const { rerender } = render(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() => expect(mockHandleApiError).toHaveBeenCalled());
        rerender(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() =>
            expect(screen.getByTestId("modal-error-card")).toHaveTextContent(
                "Network error"
            )
        );
        expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("shows ErrorCard with Retry button when API fails with a retryable error", async () => {
        const retryableErrorResponse = {
            ok: () => false,
            error: { message: "Server busy, please retry" },
        };
        mockFetchData.mockResolvedValueOnce(retryableErrorResponse);

        mockUseApiErrorHandler.mockImplementation(() => {
            if (mockHandleApiError.mock.calls.length > 0) {
                return {
                    ...mockErrorHandlerReturnValue,
                    showError: true,
                    errorTitle: 'Temporary Issue',
                    errorDescription: 'Server busy, please retry',
                    onRetry: mockOnRetry,
                    onClose: undefined,
                };
            }
            return mockErrorHandlerReturnValue;
        });

        const { rerender } = render(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() => expect(mockHandleApiError).toHaveBeenCalled());
        rerender(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() => {
            const retryCard = screen.getByTestId("modal-error-card");
            expect(retryCard).toBeInTheDocument();
            expect(retryCard).toHaveTextContent("Temporary Issue: Server busy, please retry");
            expect(screen.getByText("Retry")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
    });

    it("calls onRetry from hook when Retry button is clicked", async () => {
        const retryableErrorResponse = { ok: () => false, error: { message: "Retry me" } };
        mockFetchData.mockResolvedValueOnce(retryableErrorResponse);

        mockUseApiErrorHandler.mockImplementation(() => {
            if (mockHandleApiError.mock.calls.length > 0) {
                return {
                    ...mockErrorHandlerReturnValue,
                    showError: true,
                    onRetry: mockOnRetry,
                    onClose: undefined
                };
            }
            return mockErrorHandlerReturnValue;
        });

        const { rerender } = render(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() => expect(mockHandleApiError).toHaveBeenCalled());
        rerender(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() => {
            const retryButton = screen.getByRole('button', { name: 'Retry' });
            expect(retryButton).toBeInTheDocument();
            fireEvent.click(retryButton);
        });
        expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("shows LoaderModal when isRetrying is true", async () => {
        mockErrorHandlerReturnValue = {
            ...mockErrorHandlerReturnValue,
            isRetrying: true,
        };
        mockUseApiErrorHandler.mockReturnValue(mockErrorHandlerReturnValue);
        render(<CredentialShareHandler {...defaultProps} />);
        expect(screen.getByTestId("modal-loader-card")).toBeInTheDocument();
        expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
        expect(screen.queryByTestId("modal-error-card")).not.toBeInTheDocument();
    });
});
