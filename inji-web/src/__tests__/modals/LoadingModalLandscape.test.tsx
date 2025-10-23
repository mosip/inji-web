import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadingModalLandscape } from "../../modals/LoadingModalLandscape";
import { mockUseTranslation } from "../../test-utils/mockUtils";

mockUseTranslation();

describe("LoadingModalLandscape Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("matches snapshot when open", () => {
        const { asFragment } = render(<LoadingModalLandscape isOpen={true} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("does not render when isOpen is false", () => {
        const { container } = render(<LoadingModalLandscape isOpen={false} />);
        expect(container.querySelector("#card-loading-container")).not.toBeInTheDocument();
        expect(container.querySelector("#spinner-loading")).not.toBeInTheDocument();
        expect(container.querySelector("#text-loading-message")).not.toBeInTheDocument();
    });

    it("renders spinner and message when open", () => {
        const { container } = render(<LoadingModalLandscape isOpen={true} />);

        expect(container.querySelector("#card-loading-container")).toBeInTheDocument();

        expect(container.querySelector("#spinner-loading")).toBeInTheDocument();

        const messageEl = container.querySelector("#text-loading-message");
        expect(messageEl).toBeInTheDocument();
    });
});
