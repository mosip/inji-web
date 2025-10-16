import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CredentialRequestModal } from "../../modals/CredentialRequestModal";
import { WalletCredential } from "../../types/data";
import { mockVerifiableCredentials } from "../../test-utils/mockObjects";

// Mock dependencies
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("../../modals/ModalWrapper", () => ({
  ModalWrapper: ({ header, footer, content }: any) => (
    <div data-testid="ModalWrapper-Mock">
      {header}
      {content}
      {footer}
    </div>
  ),
}));

jest.mock("../../components/Credentials/CredentialRequestModalHeader", () => ({
  CredentialRequestModalHeader: ({ verifierName, description }: any) => (
    <div data-testid="credential-request-modal-header">
      <h2>{verifierName}</h2>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock("../../components/Credentials/CredentialRequestModalFooter", () => ({
  CredentialRequestModalFooter: ({ onCancel, onConsentAndShare, isConsentDisabled }: any) => (
    <div data-testid="credential-request-modal-footer">
      <button data-testid="btn-cancel" onClick={onCancel}>
        Cancel
      </button>
      <button 
        data-testid="btn-consent-share" 
        onClick={onConsentAndShare}
        disabled={isConsentDisabled}
      >
        Consent & Share
      </button>
    </div>
  ),
}));

jest.mock("../../components/Credentials/CredentialList", () => ({
  CredentialList: ({ credentials, selectedCredentials, onToggleCredential }: any) => (
    <div data-testid="credential-list">
      {credentials.map((cred: WalletCredential) => (
        <div key={cred.credentialId}>
          <input
            type="checkbox"
            data-testid={`credential-checkbox-${cred.credentialId}`}
            checked={selectedCredentials.includes(cred.credentialId)}
            onChange={() => onToggleCredential(cred.credentialId)}
          />
          <span>{cred.credentialTypeDisplayName}</span>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../../hooks/useApi", () => ({
  useApi: jest.fn(),
}));

jest.mock("../../hooks/useApiErrorHandler", () => ({
  useApiErrorHandler: jest.fn(),
}));

import { useTranslation } from "react-i18next";
import { useApi } from "../../hooks/useApi";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";

describe("CredentialRequestModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConsentAndShare = jest.fn();
  
  const defaultProps = {
    isOpen: true,
    verifierName: "Test Verifier",
    requestedCredentials: mockVerifiableCredentials,
    onClose: mockOnClose,
    onConsentAndShare: mockOnConsentAndShare,
  };

  const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;
  const mockUseApiErrorHandler = useApiErrorHandler as jest.MockedFunction<typeof useApiErrorHandler>;

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    mockUseApi.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      execute: jest.fn(),
    });

    mockUseApiErrorHandler.mockReturnValue({
      handleError: jest.fn(),
    });

    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders modal when open", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByTestId("card-credential-request-modal")).toBeInTheDocument();
      expect(screen.getByTestId("credential-request-modal-header")).toBeInTheDocument();
      expect(screen.getByTestId("credential-list")).toBeInTheDocument();
      expect(screen.getByTestId("credential-request-modal-footer")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(<CredentialRequestModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId("card-credential-request-modal")).not.toBeInTheDocument();
    });

    it("renders with correct verifier name", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByText("Test Verifier")).toBeInTheDocument();
    });

    it("renders credential list with provided credentials", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByText("Drivers License")).toBeInTheDocument();
      expect(screen.getByText("Health Card")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading state when loading credentials", () => {
      mockUseApi.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        execute: jest.fn(),
      });

      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByText("loading.title")).toBeInTheDocument();
      expect(screen.getByText("loading.message")).toBeInTheDocument();
    });

    it("hides loading state when not loading", () => {
      mockUseApi.mockReturnValue({
        data: mockVerifiableCredentials,
        loading: false,
        error: null,
        execute: jest.fn(),
      });

      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.queryByText("loading.title")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("shows error state when there is an error", () => {
      mockUseApi.mockReturnValue({
        data: null,
        loading: false,
        error: { message: "Test error" },
        execute: jest.fn(),
      });

      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByText("error.title")).toBeInTheDocument();
    });

    it("shows wallet ID error message when wallet ID is missing", () => {
      mockUseApi.mockReturnValue({
        data: null,
        loading: false,
        error: { message: "walletId" },
        execute: jest.fn(),
      });

      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByText("error.walletIdMessage")).toBeInTheDocument();
    });
  });

  describe("No Credentials State", () => {
    it("shows no credentials message when no credentials are available", () => {
      mockUseApi.mockReturnValue({
        data: [],
        loading: false,
        error: null,
        execute: jest.fn(),
      });

      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByText("noCredentials.message")).toBeInTheDocument();
    });
  });

  describe("Credential Selection", () => {
    it("allows selecting and deselecting credentials", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      const checkbox1 = screen.getByTestId("credential-checkbox-cred-1");
      const checkbox2 = screen.getByTestId("credential-checkbox-cred-2");

      // Initially no credentials selected
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

    it("enables consent button when credentials are selected", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      const consentButton = screen.getByTestId("btn-consent-share");
      expect(consentButton).toBeDisabled();

      // Select a credential
      const checkbox = screen.getByTestId("credential-checkbox-cred-1");
      fireEvent.click(checkbox);

      expect(consentButton).not.toBeDisabled();
    });

    it("disables consent button when no credentials are selected", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      const consentButton = screen.getByTestId("btn-consent-share");
      expect(consentButton).toBeDisabled();
    });
  });

  describe("User Interactions", () => {
    it("calls onClose when cancel button is clicked", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      const cancelButton = screen.getByTestId("btn-cancel");
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onConsentAndShare when consent button is clicked with selected credentials", async () => {
      render(<CredentialRequestModal {...defaultProps} />);

      // Select a credential
      const checkbox = screen.getByTestId("credential-checkbox-cred-1");
      fireEvent.click(checkbox);

      // Click consent button
      const consentButton = screen.getByTestId("btn-consent-share");
      fireEvent.click(consentButton);

      await waitFor(() => {
        expect(mockOnConsentAndShare).toHaveBeenCalledWith(["cred-1"]);
      });
    });

    it("does not call onConsentAndShare when no credentials are selected", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      const consentButton = screen.getByTestId("btn-consent-share");
      expect(consentButton).toBeDisabled();
    });
  });

  describe("API Integration", () => {
    it("fetches credentials on mount", () => {
      const mockExecute = jest.fn();
      mockUseApi.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        execute: mockExecute,
      });

      render(<CredentialRequestModal {...defaultProps} />);

      expect(mockExecute).toHaveBeenCalled();
    });

    it("handles API errors correctly", () => {
      const mockHandleError = jest.fn();
      mockUseApiErrorHandler.mockReturnValue({
        handleError: mockHandleError,
      });

      mockUseApi.mockReturnValue({
        data: null,
        loading: false,
        error: { message: "API Error" },
        execute: jest.fn(),
      });

      render(<CredentialRequestModal {...defaultProps} />);

      expect(mockHandleError).toHaveBeenCalledWith({ message: "API Error" });
    });
  });

  describe("Accessibility", () => {
    it("has proper test IDs for testing", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      expect(screen.getByTestId("card-credential-request-modal")).toBeInTheDocument();
      expect(screen.getByTestId("credential-request-modal-header")).toBeInTheDocument();
      expect(screen.getByTestId("credential-list")).toBeInTheDocument();
      expect(screen.getByTestId("credential-request-modal-footer")).toBeInTheDocument();
    });

    it("has proper button accessibility", () => {
      render(<CredentialRequestModal {...defaultProps} />);

      const cancelButton = screen.getByTestId("btn-cancel");
      const consentButton = screen.getByTestId("btn-consent-share");

      expect(cancelButton).toBeInTheDocument();
      expect(consentButton).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty requested credentials array", () => {
      render(<CredentialRequestModal {...defaultProps} requestedCredentials={[]} />);

      expect(screen.getByText("noCredentials.message")).toBeInTheDocument();
    });

    it("handles undefined verifier name", () => {
      render(<CredentialRequestModal {...defaultProps} verifierName={undefined} />);

      expect(screen.getByTestId("credential-request-modal-header")).toBeInTheDocument();
    });

    it("handles multiple credential selections", async () => {
      render(<CredentialRequestModal {...defaultProps} />);

      // Select multiple credentials
      const checkbox1 = screen.getByTestId("credential-checkbox-cred-1");
      const checkbox2 = screen.getByTestId("credential-checkbox-cred-2");

      fireEvent.click(checkbox1);
      fireEvent.click(checkbox2);

      // Click consent button
      const consentButton = screen.getByTestId("btn-consent-share");
      fireEvent.click(consentButton);

      await waitFor(() => {
        expect(mockOnConsentAndShare).toHaveBeenCalledWith(["cred-1", "cred-2"]);
      });
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily when props are the same", () => {
      const { rerender } = render(<CredentialRequestModal {...defaultProps} />);
      
      const initialModal = screen.getByTestId("card-credential-request-modal");
      
      rerender(<CredentialRequestModal {...defaultProps} />);
      
      const afterRerender = screen.getByTestId("card-credential-request-modal");
      expect(initialModal).toBe(afterRerender);
    });

    it("re-renders when isOpen prop changes", () => {
      const { rerender } = render(<CredentialRequestModal {...defaultProps} />);
      
      expect(screen.getByTestId("card-credential-request-modal")).toBeInTheDocument();
      
      rerender(<CredentialRequestModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId("card-credential-request-modal")).not.toBeInTheDocument();
    });
  });
});
