import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TrustVerifierModal } from "../../../components/Issuers/TrustVerifierModal";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("../../../components/Issuers/TrustVerifierModalStyles", () => ({
  TrustVerifierModalStyles: {
    trustModal: {
      wrapper: "wrapper",
      logoContainer: "logoContainer",
      logoImage: "logoImage",
      logoPlaceholder: "logoPlaceholder",
      title: "title",
      description: "description",
      list: "list",
      listItem: "listItem",
      listItemBullet: "listItemBullet",
      buttonsContainer: "buttonsContainer",
      trustButton: "trustButton",
      cancelButton: "cancelButton",
    },
  },
}));

// FIX: Explicitly handle props in mock to resolve 'any' type error
jest.mock("../../../modals/ModalWrapper", () => ({
  // Using explicit destructuring 'content' without ': any' avoids the error
  ModalWrapper: ({ content}) => (
    <div data-testid="ModalWrapper-Mock">{content}</div>
  ),
}));

jest.mock("../../../components/Common/Buttons/SolidButton", () => ({
  SolidButton: ({ onClick, title, testId }) => (
    <button data-testid={testId} onClick={onClick}>
      {title}
    </button>
  ),
}));

jest.mock("../../../components/Common/Buttons/SecondaryBorderedButton", () => ({
  SecondaryBorderedButton: ({ onClick, title, testId }) => (
    <button data-testid={testId} onClick={onClick}>
      {title}
    </button>
  ),
}));

jest.mock("../../../components/Common/Buttons/PlainButtonNormal", () => ({
  PlainButtonNormal: ({ onClick, title, testId }) => (
    <button data-testid={testId} onClick={onClick}>
      {title}
    </button>
  ),
}));

jest.mock("../../../components/Common/ToolTip/InfoTooltipTrigger", () => ({
  InfoTooltipTrigger: ({ infoButtonText, tooltipText }) => (
    <div data-testid="btn-info-tooltip">
      {infoButtonText} - {tooltipText}
    </div>
  ),
}));

describe("TrustVerifierModal", () => {
  const mockOnTrust = jest.fn();
  const mockOnNotTrust = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    (useTranslation).mockReturnValue({
      t: (key) => key,
    });
    jest.clearAllMocks();
  });

  it("renders modal content when open", () => {
    const { container } = render(
      <TrustVerifierModal
        isOpen={true}
        verifierName="Test Verifier"
        verifierDomain="test.com"
        onTrust={mockOnTrust}
        onNotTrust={mockOnNotTrust}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();
    expect(screen.getByText("Test Verifier")).toBeInTheDocument();
    
    expect(screen.getByTestId("trust-verifier-content")).toBeInTheDocument(); 
    
    expect(screen.getByTestId("btn-trust-verifier")).toBeInTheDocument();
    expect(screen.getByTestId("btn-not-trust-verifier")).toBeInTheDocument();
    expect(screen.getByTestId("btn-cancel-trust-modal")).toBeInTheDocument();
    expect(screen.getByTestId("btn-info-tooltip")).toBeInTheDocument(); 
    
    expect(container).toMatchSnapshot();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <TrustVerifierModal
        isOpen={false}
        onTrust={mockOnTrust}
        onNotTrust={mockOnNotTrust}
        onCancel={mockOnCancel}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls onTrust when Yes button is clicked", () => {
    render(
      <TrustVerifierModal
        isOpen={true}
        onTrust={mockOnTrust}
        onNotTrust={mockOnNotTrust}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByTestId("btn-trust-verifier"));
    expect(mockOnTrust).toHaveBeenCalledTimes(1);
  });

  it("calls onNotTrust when No button is clicked", () => {
    render(
      <TrustVerifierModal
        isOpen={true}
        onTrust={mockOnTrust}
        onNotTrust={mockOnNotTrust}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByTestId("btn-not-trust-verifier"));
    expect(mockOnNotTrust).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Cancel button is clicked", () => {
    render(
      <TrustVerifierModal
        isOpen={true}
        onTrust={mockOnTrust}
        onNotTrust={mockOnNotTrust}
        onCancel={mockOnCancel}
      />
    );
    fireEvent.click(screen.getByTestId("btn-cancel-trust-modal"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});