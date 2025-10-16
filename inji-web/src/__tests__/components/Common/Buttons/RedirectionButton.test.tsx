import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {RedirectionButton} from "../../../../components/Common/Buttons/RedirectionButton.tsx";

describe("RedirectionButton Component", () => {
    const mockClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly with children text", () => {
        render(
            <RedirectionButton onClick={mockClick}>
                Go Back
            </RedirectionButton>
        );

        const button = screen.getByRole("button", { name: /Go Back/i });
        expect(button).toBeInTheDocument();

        // Check that child text is rendered
        expect(button).toHaveTextContent("Go Back");

        // Check for image inside button
        const img = screen.getByAltText("Back");
        expect(img).toBeInTheDocument();
    });

    it("calls onClick when button is clicked", () => {
        render(
            <RedirectionButton onClick={mockClick}>
                Go Back
            </RedirectionButton>
        );

        const button = screen.getByRole("button", { name: /Go Back/i });
        fireEvent.click(button);
        expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it("applies testId if provided", () => {
        render(
            <RedirectionButton onClick={mockClick} testId="redirection-btn">
                Go Back
            </RedirectionButton>
        );

        const button = screen.getByRole("button", { name: /Go Back/i });
        expect(button.id).toBe("redirection-btn");
    });

    it("has responsive classes for mobile and desktop", () => {
        render(
            <RedirectionButton onClick={mockClick}>
                Go Back
            </RedirectionButton>
        );

        const button = screen.getByRole("button", { name: /Go Back/i });
        expect(button).toHaveClass("w-full");
        expect(button).toHaveClass("rounded");
        expect(button).toHaveClass("flex");
        expect(button).toHaveClass("items-center");
        expect(button).toHaveClass("justify-center");
    });
});
