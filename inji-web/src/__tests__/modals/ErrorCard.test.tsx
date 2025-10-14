import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorCard } from "../../modals/ErrorCard";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("../../modals/ModalWrapper", () => ({
  ModalWrapper: ({ content }: any) => (
    <div data-testid="ModalWrapper-Mock">{content}</div>
  ),
}));

jest.mock("../../components/Common/Buttons/SolidButton", () => ({
  SolidButton: ({ onClick, title, testId }: any) => (
    <button data-testid={testId} onClick={onClick}>
      {title}
    </button>
  ),
}));

describe("ErrorCard", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
    jest.clearAllMocks();
  });

  it("renders modal content when open", () => {
    render(<ErrorCard onClose={mockOnClose} isOpen={true} />);
    expect(screen.getByTestId("ModalWrapper-Mock")).toBeInTheDocument();
    expect(screen.getByText("ErrorCard.defaultTitle")).toBeInTheDocument();
    expect(screen.getByText("ErrorCard.defaultDescription")).toBeInTheDocument();
    expect(screen.getByText("ErrorCard.closeButton")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(<ErrorCard onClose={mockOnClose} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("calls onClose when close button is clicked", () => {
    render(<ErrorCard onClose={mockOnClose} isOpen={true} />);
    fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
