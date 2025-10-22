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
      noTrustButton: "noTrustButton",
      cancelButton: "cancelButton",
    },
  },
}));

jest.mock("../../../modals/ModalWrapper", () => ({
  ModalWrapper: ({ content, zIndex, size }: any) => (
    <div data-testid="ModalWrapper-Mock" data-z-index={zIndex} data-size={size}>
      {content}
    </div>
  ),
}));

jest.mock("../../../components/Common/Buttons/SolidButton", () => ({
  SolidButton: ({ onClick, title, testId, fullWidth, className }: any) => (
    <button 
      data-testid={testId} 
      onClick={onClick}
      data-full-width={fullWidth}
      className={className}
    >
      {title}
    </button>
  ),
}));

jest.mock("../../../components/Common/Buttons/BorderedButton", () => ({
  BorderedButton: ({ onClick, title, testId, className }: any) => (
    <button 
      data-testid={testId} 
      onClick={onClick}
      className={className}
    > 
      {title}
    </button>
  ),
}));

jest.mock("../../../components/Common/Buttons/TertiaryButton", () => ({
  TertiaryButton: ({ onClick, title, testId, className }: any) => (
    <button 
      data-testid={testId} 
      onClick={onClick}
      className={className}
    >
      {title}
    </button>
  ),
}));

jest.mock("../../../components/Common/ToolTip/InfoTooltipTrigger", () => ({
  InfoTooltipTrigger: ({ infoButtonText, tooltipText, testId }: any) => (
    <div data-testid={testId}>
      {infoButtonText} - {tooltipText}
    </div>
  ),
}));

jest.mock("../../../assets/logo.svg", () => ({
  __esModule: true,
  default: "mocked-logo.svg",
}));

describe("TrustVerifierModal", () => {
  const mockOnTrust = jest.fn();
  const mockOnNotTrust = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
    jest.clearAllMocks();
  });

  it("renders modal content when open", () => {
    const { container } = render(
      <TrustVerifierModal
        isOpen={true}
        verifierName="Test Verifier"
        onTrust={mockOnTrust}
        onNotTrust={mockOnNotTrust}
        onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
      />
    );
    
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
        testId={"trust-verifier-content"}
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
        testId={"trust-verifier-content"}
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
        testId={"trust-verifier-content"}
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
        testId={"trust-verifier-content"}
      />
    );
    fireEvent.click(screen.getByTestId("btn-cancel-trust-modal"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  describe("Logo Display", () => {
    it("displays provided logo when available", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          logo="https://example.com/logo.png"
          verifierName="Test Verifier"
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const logo = screen.getByTestId("img-verifier-logo");
      expect(logo).toHaveAttribute("src", "https://example.com/logo.png");
      expect(logo).toHaveAttribute("alt", "Test Verifier logo");
    });

    it("displays default logo when no logo provided", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          verifierName="Test Verifier"
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const logo = screen.getByTestId("img-default-logo");
      expect(logo).toHaveAttribute("src", "mocked-logo.svg");
      expect(logo).toHaveAttribute("alt", "Test Verifier logo");
    });

    it("displays default logo when logo is null", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          logo={null}
          verifierName="Test Verifier"
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const logo = screen.getByTestId("img-default-logo");
      expect(logo).toHaveAttribute("src", "mocked-logo.svg");
    });
  });

  describe("Verifier Information", () => {
    it("displays verifier name when provided", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          verifierName="Custom Verifier"
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("title-verifier-name")).toHaveTextContent("Custom Verifier");
    });

    it("displays default title when verifier name is not provided", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("title-verifier-name")).toHaveTextContent("modal.title");
    });

    it("displays modal description", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("text-modal-description")).toHaveTextContent("modal.description");
    });
  });

  describe("Trust Instructions", () => {
    it("displays all trust benefit instructions", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("text-trust-point-1")).toHaveTextContent("modal.benefitSaveSecurely");
      expect(screen.getByTestId("text-trust-point-2")).toHaveTextContent("modal.benefitAddToTrustedList");
      expect(screen.getByTestId("text-trust-point-3")).toHaveTextContent("modal.benefitSkipReviewFuture");
    });

    it("displays bullet points for each instruction", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const bullets = screen.getAllByText("•");
      expect(bullets).toHaveLength(3);
    });
  });

  describe("Button Functionality", () => {
    it("renders all three buttons with correct test IDs", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("btn-trust-verifier")).toBeInTheDocument();
      expect(screen.getByTestId("btn-not-trust-verifier")).toBeInTheDocument();
      expect(screen.getByTestId("btn-cancel-trust-modal")).toBeInTheDocument();
    });

    it("renders trust button with fullWidth prop", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const trustButton = screen.getByTestId("btn-trust-verifier");
      expect(trustButton).toHaveAttribute("data-full-width", "true");
    });

    it("renders buttons with correct titles", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("btn-trust-verifier")).toHaveTextContent("modal.trustButton");
      expect(screen.getByTestId("btn-not-trust-verifier")).toHaveTextContent("modal.notTrustButton");
      expect(screen.getByTestId("btn-cancel-trust-modal")).toHaveTextContent("Common:cancel");
    });
  });

  describe("Info Tooltip", () => {
    it("renders info tooltip with correct content", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const tooltip = screen.getByTestId("btn-info-tooltip");
      expect(tooltip).toHaveTextContent("modal.infoTooltipButton - modal.infoTooltipText");
    });
  });

  describe("ModalWrapper Configuration", () => {
    it("passes correct props to ModalWrapper", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-z-index", "50");
      expect(modalWrapper).toHaveAttribute("data-size", "md");
    });
  });

  describe("Styling and Classes", () => {
    it("applies correct CSS classes to elements", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const content = screen.getByTestId("trust-verifier-content");
      expect(content).toHaveClass("wrapper");
    });

    it("applies correct button classes", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const trustButton = screen.getByTestId("btn-trust-verifier");
      const noTrustButton = screen.getByTestId("btn-not-trust-verifier");
      const cancelButton = screen.getByTestId("btn-cancel-trust-modal");

      expect(trustButton).toHaveClass("trustButton");
      expect(noTrustButton).toHaveClass("noTrustButton");
      expect(cancelButton).toHaveClass("cancelButton");
    });
  });

  describe("Edge Cases", () => {

    it("handles empty string verifier name", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          verifierName=""
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("title-verifier-name")).toHaveTextContent("modal.title");
    });

    it("handles very long verifier name", () => {
      const longName = "Very Long Verifier Name That Should Be Handled Properly";
      render(
        <TrustVerifierModal
          isOpen={true}
          verifierName={longName}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("title-verifier-name")).toHaveTextContent(longName);
    });
  });

  describe("Accessibility", () => {
    it("has proper test IDs for all interactive elements", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      expect(screen.getByTestId("trust-verifier-content")).toBeInTheDocument();
      expect(screen.getByTestId("title-verifier-name")).toBeInTheDocument();
      expect(screen.getByTestId("text-modal-description")).toBeInTheDocument();
      expect(screen.getByTestId("btn-trust-verifier")).toBeInTheDocument();
      expect(screen.getByTestId("btn-not-trust-verifier")).toBeInTheDocument();
      expect(screen.getByTestId("btn-cancel-trust-modal")).toBeInTheDocument();
      expect(screen.getByTestId("btn-info-tooltip")).toBeInTheDocument();
    });

    it("has proper alt text for images", () => {
      render(
        <TrustVerifierModal
          isOpen={true}
          verifierName="Test Verifier"
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );

      const logo = screen.getByTestId("img-default-logo");
      expect(logo).toHaveAttribute("alt", "Test Verifier logo");
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily when props are the same", () => {
      const { rerender } = render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );
      
      const initialContent = screen.getByTestId("trust-verifier-content");
      
      rerender(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );
      
      const afterRerender = screen.getByTestId("trust-verifier-content");
      expect(initialContent).toBe(afterRerender);
    });

    it("re-renders when isOpen prop changes", () => {
      const { rerender } = render(
        <TrustVerifierModal
          isOpen={true}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );
      
      expect(screen.getByTestId("trust-verifier-content")).toBeInTheDocument();
      
      rerender(
        <TrustVerifierModal
          isOpen={false}
          onTrust={mockOnTrust}
          onNotTrust={mockOnNotTrust}
          onCancel={mockOnCancel}
        testId={"trust-verifier-content"}
        />
      );
      
      expect(screen.queryByTestId("trust-verifier-content")).not.toBeInTheDocument();
    });
  });
});
