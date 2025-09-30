import React from "react";
import { render, screen } from "@testing-library/react";
import { LandingGuard } from "../../../components/Guards/LandingGuard";
import { Navigate, useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate-mock">Navigate to {to}</div>,
    useLocation: () => ({ pathname: "/test-path" }),
}));

const landingGuardTestCases = [
    { sessionValue: "true", shouldRenderChild: true, description: "renders the child when landingVisited is true" },
    { sessionValue: "false", shouldRenderChild: false, description: "redirects to root when landingVisited is false" },
    { sessionValue: null, shouldRenderChild: false, description: "redirects to root when landingVisited is not set" },
];

describe("LandingGuard", () => {
    const TestChild = () => <div data-testid="child">Protected Content</div>;

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    it.each(landingGuardTestCases)("$description", ({ sessionValue, shouldRenderChild }) => {
        if (sessionValue) sessionStorage.setItem("landingVisited", sessionValue);

        render(<LandingGuard><TestChild /></LandingGuard>);

        if (shouldRenderChild) {
            expect(screen.getByTestId("child")).toBeInTheDocument();
            expect(screen.queryByTestId("navigate-mock")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("navigate-mock")).toHaveTextContent("Navigate to /");
            expect(screen.queryByTestId("child")).not.toBeInTheDocument();
        }
    });
});
