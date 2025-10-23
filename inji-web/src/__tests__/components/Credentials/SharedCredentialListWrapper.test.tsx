import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {SharedCredentialListWrapper} from "../../../components/Credentials/SharedCredentialListWrapper";

describe("SharedCredentialListWrapper Component", () => {
    const credentialsMock = [
        {
            credentialId: "cred1",
            credentialTypeDisplayName: "Passport",
            credentialTypeLogo: "/passport.png",
        },
        {
            credentialId: "cred2",
            credentialTypeDisplayName: "Driver License",
            credentialTypeLogo: "/driver.png",
        },
    ];

    it("matches snapshot", () => {
        const { asFragment } = render(
            <SharedCredentialListWrapper credentials={credentialsMock} />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correct number of credential items", () => {
        render(<SharedCredentialListWrapper credentials={credentialsMock} />);
        const items = credentialsMock.map((cred, idx) =>
            screen.getByTestId(`item-${cred.credentialTypeDisplayName}-${idx}`)
        );
        expect(items.length).toBe(credentialsMock.length);
    });

    it("renders each credential with correct image and text", () => {
        render(<SharedCredentialListWrapper credentials={credentialsMock} />);

        credentialsMock.forEach((cred, idx) => {
            const item = screen.getByTestId(`item-${cred.credentialTypeDisplayName}-${idx}`);
            const img = item.querySelector("img");
            const span = item.querySelector("span");

            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute("src", cred.credentialTypeLogo);
            expect(img).toHaveAttribute("alt", cred.credentialTypeDisplayName);

            expect(span).toBeInTheDocument();
            expect(span).toHaveTextContent(cred.credentialTypeDisplayName);

            // Check for responsive classes
            expect(item).toHaveClass("flex");
            expect(item).toHaveClass("items-center");
            expect(item).toHaveClass("w-[388px]");
            expect(item).toHaveClass("h-[78px]");
            expect(item).toHaveClass("rounded-lg");
            expect(item).toHaveClass("bg-white");
        });
    });

    it("renders main container with correct classes", () => {
        render(<SharedCredentialListWrapper credentials={credentialsMock} />);
        const container = screen.getByTestId("shared-credentials-container");

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass("w-[425px]");
        expect(container).toHaveClass("h-[245px]");
        expect(container).toHaveClass("overflow-y-auto");
        expect(container).toHaveClass("rounded-lg");
        expect(container).toHaveClass("bg-[var(--iw-color-shieldSuccessShadow)]");
    });
});
