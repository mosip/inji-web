import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NoMatchingCredentialsModal } from "../../modals/NoMatchingCredentialsModal";
import { useTranslation } from "react-i18next";

// Mock dependencies
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("../../modals/ModalWrapper", () => ({
  ModalWrapper: ({ header, footer, content, zIndex, size }: any) => (
    <div data-testid="ModalWrapper-Mock" data-z-index={zIndex} data-size={size}>
      {header}
      {content}
      {footer}
    </div>
  ),
}));

jest.mock("../../components/Common/Buttons/SolidButton", () => ({
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

jest.mock("../../components/Error/ErrorCard", () => ({
  ErrorCard: ({ title, description, buttonText, onButtonClick, testId }: any) => (
    <div data-testid={testId}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onButtonClick}>{buttonText}</button>
    </div>
  ),
}));

jest.mock("../../components/Common/Error/ErrorShieldIcon", () => ({
  ErrorShieldIcon: () => <div data-testid="error-shield-icon">Error Icon</div>,
}));

describe("NoMatchingCredentialsModal", () => {
  const mockOnGoToHome = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    onGoToHome: mockOnGoToHome,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders modal when open", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByTestId("card-no-matching-credentials-modal")).toBeInTheDocument();
      expect(screen.getByTestId("error-shield-icon")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId("card-no-matching-credentials-modal")).not.toBeInTheDocument();
    });

    it("renders with correct title and description", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText("NoMatchingCredentialsModal.title")).toBeInTheDocument();
      expect(screen.getByText("NoMatchingCredentialsModal.description")).toBeInTheDocument();
    });

    it("renders go to home button", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText("NoMatchingCredentialsModal.goToHomeButton")).toBeInTheDocument();
    });
  });

  describe("ModalWrapper Configuration", () => {
    it("passes correct props to ModalWrapper", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-z-index", "50");
      expect(modalWrapper).toHaveAttribute("data-size", "md");
    });
  });

  describe("User Interactions", () => {
    it("calls onGoToHome when go to home button is clicked", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByText("NoMatchingCredentialsModal.goToHomeButton");
      fireEvent.click(goToHomeButton);

      expect(mockOnGoToHome).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when close button is clicked", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const closeButton = screen.getByTestId("btn-close-no-matching-credentials-modal");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling and Classes", () => {
    it("applies correct CSS classes to modal container", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("card-no-matching-credentials-modal");
      expect(modalContainer).toHaveClass("w-full", "max-w-[400px]", "min-h-[350px]");
    });

    it("applies responsive classes", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("card-no-matching-credentials-modal");
      expect(modalContainer).toHaveClass("transition-all", "duration-300", "ease-in-out");
    });

    it("applies mobile responsive classes", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("card-no-matching-credentials-modal");
      expect(modalContainer).toHaveClass("max-[533px]:w-screen", "max-[533px]:left-0", "max-[533px]:right-0", "max-[533px]:z-[60]");
    });
  });

  describe("ErrorCard Integration", () => {
    it("renders ErrorCard with correct props", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const errorCard = screen.getByTestId("error-card-no-matching-credentials-modal");
      expect(errorCard).toBeInTheDocument();
    });

    it("passes correct title to ErrorCard", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText("NoMatchingCredentialsModal.title")).toBeInTheDocument();
    });

    it("passes correct description to ErrorCard", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText("NoMatchingCredentialsModal.description")).toBeInTheDocument();
    });

    it("passes correct button text to ErrorCard", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText("NoMatchingCredentialsModal.goToHomeButton")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper test IDs for testing", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByTestId("card-no-matching-credentials-modal")).toBeInTheDocument();
      expect(screen.getByTestId("error-card-no-matching-credentials-modal")).toBeInTheDocument();
      expect(screen.getByTestId("btn-close-no-matching-credentials-modal")).toBeInTheDocument();
      expect(screen.getByTestId("error-shield-icon")).toBeInTheDocument();
    });

    it("has proper button accessibility", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByText("NoMatchingCredentialsModal.goToHomeButton");
      const closeButton = screen.getByTestId("btn-close-no-matching-credentials-modal");

      expect(goToHomeButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Internationalization", () => {
    it("uses translation keys for all text content", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText("NoMatchingCredentialsModal.title")).toBeInTheDocument();
      expect(screen.getByText("NoMatchingCredentialsModal.description")).toBeInTheDocument();
      expect(screen.getByText("NoMatchingCredentialsModal.goToHomeButton")).toBeInTheDocument();
    });

    it("calls useTranslation with correct namespace", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(useTranslation).toHaveBeenCalledWith(["NoMatchingCredentialsModal"]);
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined onGoToHome callback", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} onGoToHome={undefined} />);

      const goToHomeButton = screen.getByText("NoMatchingCredentialsModal.goToHomeButton");
      expect(goToHomeButton).toBeInTheDocument();
      
      // Should not throw error when clicked
      expect(() => fireEvent.click(goToHomeButton)).not.toThrow();
    });

    it("handles undefined onClose callback", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} onClose={undefined} />);

      const closeButton = screen.getByTestId("btn-close-no-matching-credentials-modal");
      expect(closeButton).toBeInTheDocument();
      
      // Should not throw error when clicked
      expect(() => fireEvent.click(closeButton)).not.toThrow();
    });

    it("handles rapid button clicks", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByText("NoMatchingCredentialsModal.goToHomeButton");
      
      // Click multiple times rapidly
      fireEvent.click(goToHomeButton);
      fireEvent.click(goToHomeButton);
      fireEvent.click(goToHomeButton);

      expect(mockOnGoToHome).toHaveBeenCalledTimes(3);
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily when props are the same", () => {
      const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);
      
      const initialModal = screen.getByTestId("card-no-matching-credentials-modal");
      
      rerender(<NoMatchingCredentialsModal {...defaultProps} />);
      
      const afterRerender = screen.getByTestId("card-no-matching-credentials-modal");
      expect(initialModal).toBe(afterRerender);
    });

    it("re-renders when isOpen prop changes", () => {
      const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);
      
      expect(screen.getByTestId("card-no-matching-credentials-modal")).toBeInTheDocument();
      
      rerender(<NoMatchingCredentialsModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId("card-no-matching-credentials-modal")).not.toBeInTheDocument();
    });

    it("re-renders when callback props change", () => {
      const newOnGoToHome = jest.fn();
      const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);
      
      const initialModal = screen.getByTestId("card-no-matching-credentials-modal");
      
      rerender(<NoMatchingCredentialsModal {...defaultProps} onGoToHome={newOnGoToHome} />);
      
      const afterRerender = screen.getByTestId("card-no-matching-credentials-modal");
      expect(initialModal).not.toBe(afterRerender);
    });
  });

  describe("Component Structure", () => {
    it("renders all required components in correct order", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("card-no-matching-credentials-modal");
      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      const errorCard = screen.getByTestId("error-card-no-matching-credentials-modal");
      const errorIcon = screen.getByTestId("error-shield-icon");

      expect(modalContainer).toContainElement(modalWrapper);
      expect(modalWrapper).toContainElement(errorCard);
      expect(errorCard).toContainElement(errorIcon);
    });

    it("maintains proper component hierarchy", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("card-no-matching-credentials-modal");
      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");

      expect(modalContainer).toBeInTheDocument();
      expect(modalWrapper).toBeInTheDocument();
      expect(modalContainer).toContainElement(modalWrapper);
    });
  });

  describe("Responsive Design", () => {
    it("applies mobile-first responsive classes", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("card-no-matching-credentials-modal");
      
      // Check for responsive classes
      expect(modalContainer).toHaveClass("w-full");
      expect(modalContainer).toHaveClass("max-w-[400px]");
      expect(modalContainer).toHaveClass("min-h-[350px]");
    });

    it("applies mobile breakpoint classes", () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("card-no-matching-credentials-modal");
      
      // Check for mobile breakpoint classes
      expect(modalContainer).toHaveClass("max-[533px]:w-screen");
      expect(modalContainer).toHaveClass("max-[533px]:left-0");
      expect(modalContainer).toHaveClass("max-[533px]:right-0");
      expect(modalContainer).toHaveClass("max-[533px]:z-[60]");
    });
  });
});
