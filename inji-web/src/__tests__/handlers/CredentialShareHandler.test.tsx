import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CredentialShareHandler } from "../../handlers/CredentialShareHandler";

// Mock the useApi hook correctly
const mockFetchData = jest.fn();
jest.mock("../../hooks/useApi", () => ({
    useApi: () => ({ fetchData: mockFetchData }),
}));


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
    });

    it("shows loading modal initially", () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true });
        render(<CredentialShareHandler {...defaultProps} />);
        expect(screen.getByTestId("loading-modal")).toBeInTheDocument();
    });

    it("shows success modal when API call succeeds", async () => {
        mockFetchData.mockResolvedValueOnce({ ok: () => true });
        render(<CredentialShareHandler {...defaultProps} />);
        await waitFor(() => expect(screen.getByTestId("success-modal")).toBeInTheDocument());
    });
});
