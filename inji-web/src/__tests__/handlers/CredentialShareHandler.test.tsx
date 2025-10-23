import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CredentialShareHandler } from "../../handlers/CredentialShareHandler";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";

const mockFetchData = jest.fn();
jest.mock("../../hooks/useApi", () => ({
    useApi: () => ({ fetchData: mockFetchData }),
}));

jest.mock("../../hooks/useApiErrorHandler");
const mockUseApiErrorHandler = useApiErrorHandler as jest.Mock;

jest.mock("../../modals/LoadingModalLandscape", () => ({
    LoadingModalLandscape: () => <div data-testid="loading-modal" />,
}));
jest.mock("../../modals/ErrorCard", () => ({
    ErrorCard: ({ isOpen, description }: { isOpen: boolean; description: string }) =>
        isOpen ? <div data-testid="error-card">{description}</div> : null,
}));
jest.mock("../../modals/CredentialShareSuccessModal", () => ({
    CredentialShareSuccessModal: () => <div data-testid="success-modal" />,
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

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseApiErrorHandler.mockReturnValue({
            showErrorCard: false,
            errorCardMessage: "",
            handleApiError: jest.fn(),
            handleCloseErrorCard: jest.fn(),
        });
    });

    it("shows loading modal initially", () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true });
        render(<CredentialShareHandler {...defaultProps} />);
        expect(screen.getByTestId("loading-modal")).toBeInTheDocument();
    });

    it("shows success modal when API call succeeds", async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true });
        render(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() =>
            expect(screen.getByTestId("success-modal")).toBeInTheDocument()
        );
    });

    it("shows error card when API call fails (response error)", async () => {
        const mockHandleApiError = jest.fn();
        const mockHandleCloseErrorCard = jest.fn();

        const errorResponse = {
            ok: () => false,
            error: { message: "Failed to submit presentation" },
        };
        mockFetchData.mockResolvedValueOnce(errorResponse);

        mockUseApiErrorHandler.mockImplementationOnce(() => ({
            showErrorCard: true,
            errorCardMessage: "Failed to submit presentation",
            handleApiError: mockHandleApiError,
            handleCloseErrorCard: mockHandleCloseErrorCard,
        }));

        render(<CredentialShareHandler {...defaultProps} />);

        await waitFor(() =>
            expect(screen.getByTestId("error-card")).toHaveTextContent(
                "Failed to submit presentation"
            )
        );
    });

    it("shows error card when fetch throws (network/unexpected error)", async () => {
        const mockHandleApiError = jest.fn();
        const mockHandleCloseErrorCard = jest.fn();

        mockFetchData.mockRejectedValueOnce(new Error("Network error"));

        mockUseApiErrorHandler.mockImplementationOnce(() => ({
            showErrorCard: true,
            errorCardMessage: "Network error",
            handleApiError: mockHandleApiError,
            handleCloseErrorCard: mockHandleCloseErrorCard,
        }));

        render(<CredentialShareHandler {...defaultProps} />);

        await waitFor(() =>
            expect(screen.getByTestId("error-card")).toHaveTextContent("Network error")
        );
    });
});
