import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingModal } from "../../modals/LoadingModal";
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

jest.mock("../../components/Common/SpinningLoader", () => ({
  SpinningLoader: () => <div data-testid="spinning-loader">Loading...</div>,
}));

describe("LoadingModal", () => {
  const defaultProps = {
    isOpen: true,
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders modal when open", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(screen.getByTestId("loading-modal")).toBeInTheDocument();
      expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(<LoadingModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId("loading-modal")).not.toBeInTheDocument();
    });

    it("renders with correct title and message", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(screen.getByText("loading.title")).toBeInTheDocument();
      expect(screen.getByText("loading.message")).toBeInTheDocument();
    });
  });

  describe("ModalWrapper Configuration", () => {
    it("passes correct default props to ModalWrapper", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-z-index", "50");
      expect(modalWrapper).toHaveAttribute("data-size", "md");
    });

    it("passes custom size prop to ModalWrapper", () => {
      render(<LoadingModal {...defaultProps} size="xl" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "xl");
    });

    it("passes custom zIndex prop to ModalWrapper", () => {
      render(<LoadingModal {...defaultProps} zIndex={100} />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-z-index", "100");
    });
  });

  describe("Size Variants", () => {
    it("renders with default size (md)", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "md");
    });

    it("renders with small size", () => {
      render(<LoadingModal {...defaultProps} size="sm" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "sm");
    });

    it("renders with large size", () => {
      render(<LoadingModal {...defaultProps} size="lg" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "lg");
    });

    it("renders with extra large size", () => {
      render(<LoadingModal {...defaultProps} size="xl" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "xl");
    });

    it("renders with 2xl size", () => {
      render(<LoadingModal {...defaultProps} size="2xl" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "2xl");
    });

    it("renders with 3xl size", () => {
      render(<LoadingModal {...defaultProps} size="3xl" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "3xl");
    });

    it("renders with 4xl size", () => {
      render(<LoadingModal {...defaultProps} size="4xl" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "4xl");
    });

    it("renders with 6xl size", () => {
      render(<LoadingModal {...defaultProps} size="6xl" />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "6xl");
    });
  });

  describe("Styling and Classes", () => {
    it("applies correct CSS classes to modal container", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("loading-modal");
      expect(modalContainer).toHaveClass("w-full", "max-w-[500px]");
    });

    it("applies responsive classes", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("loading-modal");
      expect(modalContainer).toHaveClass("transition-all", "duration-300", "ease-in-out");
    });

    it("applies mobile responsive classes", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("loading-modal");
      expect(modalContainer).toHaveClass("max-[533px]:w-screen", "max-[533px]:left-0", "max-[533px]:right-0", "max-[533px]:z-[60]");
    });
  });

  describe("Content Structure", () => {
    it("renders all required components", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(screen.getByTestId("loading-modal")).toBeInTheDocument();
      expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();
      expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
      expect(screen.getByText("loading.title")).toBeInTheDocument();
      expect(screen.getByText("loading.message")).toBeInTheDocument();
    });

    it("maintains proper component hierarchy", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("loading-modal");
      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");

      expect(modalContainer).toContainElement(modalWrapper);
    });
  });

  describe("Internationalization", () => {
    it("uses translation keys for all text content", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(screen.getByText("loading.title")).toBeInTheDocument();
      expect(screen.getByText("loading.message")).toBeInTheDocument();
    });

    it("calls useTranslation with correct namespace", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(useTranslation).toHaveBeenCalledWith(["loading"]);
    });
  });

  describe("Accessibility", () => {
    it("has proper test IDs for testing", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(screen.getByTestId("loading-modal")).toBeInTheDocument();
      expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();
      expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
    });

    it("provides accessible loading content", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(screen.getByText("loading.title")).toBeInTheDocument();
      expect(screen.getByText("loading.message")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined size prop", () => {
      render(<LoadingModal {...defaultProps} size={undefined} />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "md"); // Should default to md
    });

    it("handles undefined zIndex prop", () => {
      render(<LoadingModal {...defaultProps} zIndex={undefined} />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-z-index", "50"); // Should default to 50
    });

    it("handles invalid size prop gracefully", () => {
      render(<LoadingModal {...defaultProps} size="invalid" as any />);

      const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
      expect(modalWrapper).toHaveAttribute("data-size", "invalid");
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily when props are the same", () => {
      const { rerender } = render(<LoadingModal {...defaultProps} />);
      
      const initialModal = screen.getByTestId("loading-modal");
      
      rerender(<LoadingModal {...defaultProps} />);
      
      const afterRerender = screen.getByTestId("loading-modal");
      expect(initialModal).toBe(afterRerender);
    });

    it("re-renders when isOpen prop changes", () => {
      const { rerender } = render(<LoadingModal {...defaultProps} />);
      
      expect(screen.getByTestId("loading-modal")).toBeInTheDocument();
      
      rerender(<LoadingModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId("loading-modal")).not.toBeInTheDocument();
    });

    it("re-renders when size prop changes", () => {
      const { rerender } = render(<LoadingModal {...defaultProps} />);
      
      const initialModal = screen.getByTestId("loading-modal");
      
      rerender(<LoadingModal {...defaultProps} size="xl" />);
      
      const afterRerender = screen.getByTestId("loading-modal");
      expect(initialModal).not.toBe(afterRerender);
    });

    it("re-renders when zIndex prop changes", () => {
      const { rerender } = render(<LoadingModal {...defaultProps} />);
      
      const initialModal = screen.getByTestId("loading-modal");
      
      rerender(<LoadingModal {...defaultProps} zIndex={100} />);
      
      const afterRerender = screen.getByTestId("loading-modal");
      expect(initialModal).not.toBe(afterRerender);
    });
  });

  describe("Component Props", () => {
    it("accepts all valid size props", () => {
      const sizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "6xl"];
      
      sizes.forEach(size => {
        const { unmount } = render(<LoadingModal {...defaultProps} size={size as any} />);
        
        const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
        expect(modalWrapper).toHaveAttribute("data-size", size);
        
        unmount();
      });
    });

    it("accepts numeric zIndex prop", () => {
      const zIndexes = [10, 50, 100, 1000];
      
      zIndexes.forEach(zIndex => {
        const { unmount } = render(<LoadingModal {...defaultProps} zIndex={zIndex} />);
        
        const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
        expect(modalWrapper).toHaveAttribute("data-z-index", zIndex.toString());
        
        unmount();
      });
    });
  });

  describe("Responsive Design", () => {
    it("applies mobile-first responsive classes", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("loading-modal");
      
      // Check for responsive classes
      expect(modalContainer).toHaveClass("w-full");
      expect(modalContainer).toHaveClass("max-w-[500px]");
    });

    it("applies mobile breakpoint classes", () => {
      render(<LoadingModal {...defaultProps} />);

      const modalContainer = screen.getByTestId("loading-modal");
      
      // Check for mobile breakpoint classes
      expect(modalContainer).toHaveClass("max-[533px]:w-screen");
      expect(modalContainer).toHaveClass("max-[533px]:left-0");
      expect(modalContainer).toHaveClass("max-[533px]:right-0");
      expect(modalContainer).toHaveClass("max-[533px]:z-[60]");
    });
  });

  describe("Loading State", () => {
    it("always shows loading content when open", () => {
      render(<LoadingModal {...defaultProps} />);

      expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
      expect(screen.getByText("loading.title")).toBeInTheDocument();
      expect(screen.getByText("loading.message")).toBeInTheDocument();
    });

    it("does not show loading content when closed", () => {
      render(<LoadingModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId("spinning-loader")).not.toBeInTheDocument();
      expect(screen.queryByText("loading.title")).not.toBeInTheDocument();
      expect(screen.queryByText("loading.message")).not.toBeInTheDocument();
    });
  });
});
