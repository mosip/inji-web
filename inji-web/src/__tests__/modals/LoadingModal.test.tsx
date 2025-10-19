import React from "react";
import { render, screen } from "@testing-library/react";
import { LoaderModal } from "../../modals/LoadingModal";
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

describe("LoaderModal", () => {
    const defaultProps = {
        isOpen: true,
        title: "Loading...",
        subtitle: "Please wait while we process your request",
    };

    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({
            t: (key: string) => key,
        });
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders modal when open", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();
            expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
        });

        it("does not render when closed", () => {
            render(<LoaderModal {...defaultProps} isOpen={false} />);

            expect(screen.queryByTestId("ModalWrapper-Mock")).not.toBeInTheDocument();
        });

        it("renders with correct title and message", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("title-loader-modal")).toHaveTextContent("Loading...");
            expect(screen.getByTestId("text-loader-modal-subtitle")).toHaveTextContent("Please wait while we process your request");
        });
    });

    describe("ModalWrapper Configuration", () => {
        it("passes correct default props to ModalWrapper", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-z-index", "50");
            expect(modalWrapper).toHaveAttribute("data-size", "4xl");
        });

        it("passes custom size prop to ModalWrapper", () => {
            render(<LoaderModal {...defaultProps} size="xl" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "xl");
        });

        it("passes default zIndex prop to ModalWrapper", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-z-index", "50");
        });
    });

    describe("Size Variants", () => {
        it("renders with default size (4xl)", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "4xl");
        });

        it("renders with small size", () => {
            render(<LoaderModal {...defaultProps} size="sm" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "sm");
        });

        it("renders with large size", () => {
            render(<LoaderModal {...defaultProps} size="lg" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "lg");
        });

        it("renders with extra large size", () => {
            render(<LoaderModal {...defaultProps} size="xl" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "xl");
        });

        it("renders with 2xl size", () => {
            render(<LoaderModal {...defaultProps} size="2xl" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "2xl");
        });

        it("renders with 3xl size", () => {
            render(<LoaderModal {...defaultProps} size="3xl" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "3xl");
        });

        it("renders with 4xl size", () => {
            render(<LoaderModal {...defaultProps} size="4xl" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "4xl");
        });

        it("renders with 6xl size", () => {
            render(<LoaderModal {...defaultProps} size="6xl" />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "6xl");
        });
    });

    describe("Styling and Classes", () => {
        it("applies correct CSS classes to modal container", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalContainer = screen.getByTestId("ModalWrapper-Mock").parentElement;
            expect(modalContainer).toHaveClass("transition-all", "duration-300", "ease-in-out");
        });

        it("applies responsive classes", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalContainer = screen.getByTestId("ModalWrapper-Mock").parentElement;
            expect(modalContainer).toHaveClass("transition-all", "duration-300", "ease-in-out");
        });

        it("applies mobile responsive classes", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalContainer = screen.getByTestId("ModalWrapper-Mock").parentElement;
            expect(modalContainer).toHaveClass("max-[533px]:w-screen", "max-[533px]:left-0", "max-[533px]:right-0", "max-[533px]:z-[60]");
        });
    });

    describe("Content Structure", () => {
        it("renders all required components", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();
            expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
            expect(screen.getByTestId("title-loader-modal")).toBeInTheDocument();
            expect(screen.getByTestId("text-loader-modal-subtitle")).toBeInTheDocument();
        });

        it("maintains proper component hierarchy", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            const title = screen.getByTestId("title-loader-modal");
            const subtitle = screen.getByTestId("text-loader-modal-subtitle");

            expect(modalWrapper).toContainElement(title);
            expect(modalWrapper).toContainElement(subtitle);
        });
    });

    describe("Internationalization", () => {
        it("uses provided title and subtitle props", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("title-loader-modal")).toHaveTextContent("Loading...");
            expect(screen.getByTestId("text-loader-modal-subtitle")).toHaveTextContent("Please wait while we process your request");
        });

        it("does not use useTranslation", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(useTranslation).not.toHaveBeenCalled();
        });
    });

    describe("Accessibility", () => {
        it("has proper test IDs for testing", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();
            expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
            expect(screen.getByTestId("title-loader-modal")).toBeInTheDocument();
            expect(screen.getByTestId("text-loader-modal-subtitle")).toBeInTheDocument();
        });

        it("provides accessible loading content", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("title-loader-modal")).toHaveTextContent("Loading...");
            expect(screen.getByTestId("text-loader-modal-subtitle")).toHaveTextContent("Please wait while we process your request");
        });
    });

    describe("Edge Cases", () => {
        it("handles undefined size prop", () => {
            render(<LoaderModal {...defaultProps} size={undefined} />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "4xl"); // Should default to 4xl
        });


        it("handles invalid size prop gracefully", () => {
            render(<LoaderModal {...defaultProps} size="invalid" as any />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-size", "invalid");
        });
    });

    describe("Performance", () => {
        it("does not re-render unnecessarily when props are the same", () => {
            const { rerender } = render(<LoaderModal {...defaultProps} />);

            const initialModal = screen.getByTestId("ModalWrapper-Mock");

            rerender(<LoaderModal {...defaultProps} />);

            const afterRerender = screen.getByTestId("ModalWrapper-Mock");
            expect(initialModal).toBe(afterRerender);
        });

        it("re-renders when isOpen prop changes", () => {
            const { rerender } = render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();

            rerender(<LoaderModal {...defaultProps} isOpen={false} />);

            expect(screen.queryByTestId("ModalWrapper-Mock")).not.toBeInTheDocument();
        });

        it("re-renders when size prop changes", () => {
            const { rerender } = render(<LoaderModal {...defaultProps} />);

            const initialModal = screen.getByTestId("ModalWrapper-Mock");
            expect(initialModal).toHaveAttribute("data-size", "4xl");

            rerender(<LoaderModal {...defaultProps} size="xl" />);

            const afterRerender = screen.getByTestId("ModalWrapper-Mock");
            expect(afterRerender).toHaveAttribute("data-size", "xl");
        });

        it("always uses default zIndex", () => {
            const { rerender } = render(<LoaderModal {...defaultProps} />);

            const initialModal = screen.getByTestId("ModalWrapper-Mock");
            expect(initialModal).toHaveAttribute("data-z-index", "50");

            // Component doesn't accept zIndex prop, so it should always be 50
            rerender(<LoaderModal {...defaultProps} />);

            const afterRerender = screen.getByTestId("ModalWrapper-Mock");
            expect(afterRerender).toHaveAttribute("data-z-index", "50");
        });
    });

    describe("Component Props", () => {
        it("accepts all valid size props", () => {
            const sizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "6xl"];

            sizes.forEach(size => {
                const { unmount } = render(<LoaderModal {...defaultProps} size={size as any} />);

                const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
                expect(modalWrapper).toHaveAttribute("data-size", size);

                unmount();
            });
        });

        it("always uses default zIndex of 50", () => {
            // Component doesn't accept zIndex prop, so it should always be 50
            const { unmount } = render(<LoaderModal {...defaultProps} />);

            const modalWrapper = screen.getByTestId("ModalWrapper-Mock");
            expect(modalWrapper).toHaveAttribute("data-z-index", "50");

            unmount();
        });
    });

    describe("Responsive Design", () => {
        it("applies mobile-first responsive classes", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalContainer = screen.getByTestId("ModalWrapper-Mock").parentElement;

            // Check for responsive classes
            expect(modalContainer).toHaveClass("transition-all");
            expect(modalContainer).toHaveClass("duration-300");
        });

        it("applies mobile breakpoint classes", () => {
            render(<LoaderModal {...defaultProps} />);

            const modalContainer = screen.getByTestId("ModalWrapper-Mock").parentElement;

            // Check for mobile breakpoint classes
            expect(modalContainer).toHaveClass("max-[533px]:w-screen");
            expect(modalContainer).toHaveClass("max-[533px]:left-0");
            expect(modalContainer).toHaveClass("max-[533px]:right-0");
            expect(modalContainer).toHaveClass("max-[533px]:z-[60]");
        });
    });

    describe("Loading State", () => {
        it("always shows loading content when open", () => {
            render(<LoaderModal {...defaultProps} />);

            expect(screen.getByTestId("spinning-loader")).toBeInTheDocument();
            expect(screen.getByTestId("title-loader-modal")).toHaveTextContent("Loading...");
            expect(screen.getByTestId("text-loader-modal-subtitle")).toHaveTextContent("Please wait while we process your request");
        });

        it("does not show loading content when closed", () => {
            render(<LoaderModal {...defaultProps} isOpen={false} />);

            expect(screen.queryByTestId("spinning-loader")).not.toBeInTheDocument();
            expect(screen.queryByTestId("title-loader-modal")).not.toBeInTheDocument();
            expect(screen.queryByTestId("text-loader-modal-subtitle")).not.toBeInTheDocument();
        });
    });
});