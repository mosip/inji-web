import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CredentialShareSuccessModal } from "../../modals/CredentialShareSuccessModal";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, vars?: Record<string, any>) => {
            if (key === "redirectMessage" && vars?.count !== undefined) {
                return `Redirecting to verifier in ${vars.count} seconds...`;
            }
            if (key === "sharedWith" && vars?.verifierName) {
                return `Shared with ${vars.verifierName}`;
            }
            if (key === "credentialsPresented" && vars?.verifierName) {
                return `Your credentials were successfully presented to ${vars.verifierName}`;
            }
            return key;
        },
    }),
}));

describe("CredentialShareSuccessModal", () => {
    const verifierName = "Verifier Portal";
    const credentials = [
        {
            credentialId: "1d3d8224-c1ff-4ae2-bd85-2d82b498de1e",
            credentialTypeDisplayName: "MOSIP National ID",
            credentialTypeLogo: "https://mosip.github.io/inji-config/logos/mosipid-logo.png",
            format: "ldp_vc",
        },
        {
            credentialId: "35800b9a-5d94-48bb-84b0-012a1a7a1116",
            credentialTypeDisplayName: "Life Insurance",
            credentialTypeLogo: "https://mosip.github.io/inji-config/logos/mosipid-logo.png",
            format: "ldp_vc",
        },
        {
            credentialId: "7cbd870a-acc6-4d47-b035-dd1065463222",
            credentialTypeDisplayName: "Health Insurance",
            credentialTypeLogo: "https://mosip.github.io/inji-config/logos/mosipid-logo.png",
            format: "ldp_vc",
        },
    ];

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    it("matches snapshot when open", () => {
        let asFragment;
        act(() => {
            const rendered = render(
                <CredentialShareSuccessModal
                    isOpen={true}
                    verifierName={verifierName}
                    credentials={credentials}
                    returnUrl="/"
                />
            );
            asFragment = rendered.asFragment;
        });
        // @ts-ignore
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders all elements with correct IDs and texts", () => {
        act(() => {
            render(
                <CredentialShareSuccessModal
                    isOpen={true}
                    verifierName={verifierName}
                    credentials={credentials}
                    returnUrl="/"
                />
            );
        });

        const modal = document.getElementById("card-share-success");
        expect(modal).toBeInTheDocument();

        const icon = document.getElementById("icon-success");
        expect(icon).toBeInTheDocument();

        const title = document.getElementById("title-shared-with");
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent(`Shared with ${verifierName}`);

        const description = document.getElementById("text-credentials-presented");
        expect(description).toBeInTheDocument();
        expect(description).toHaveTextContent(
            `Your credentials were successfully presented to ${verifierName}`
        );

        credentials.forEach((cred, idx) => {
            const item = document.getElementById(`item-${cred.credentialTypeDisplayName}-${idx}`);
            expect(item).toBeInTheDocument();

            const img = item?.querySelector("img");
            expect(img).toHaveAttribute("src", cred.credentialTypeLogo);
            expect(img).toHaveAttribute("alt", cred.credentialTypeDisplayName);

            const span = item?.querySelector("span");
            expect(span).toHaveTextContent(cred.credentialTypeDisplayName);
        });

        const button = document.getElementById("btn-return-to-verifier");
        expect(button).toBeInTheDocument();

        const countdown = document.getElementById("text-return-timer");
        expect(countdown).toBeInTheDocument();
        expect(countdown).toHaveTextContent("Redirecting to verifier in 5 seconds...");
    });

    it("counts down correctly and redirects when timer reaches 0", () => {
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = { href: "" };

        act(() => {
            render(
                <CredentialShareSuccessModal
                    isOpen={true}
                    verifierName={verifierName}
                    credentials={credentials}
                    returnUrl="/redirected"
                />
            );
        });

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        let countdown = document.getElementById("text-return-timer");
        expect(countdown).toHaveTextContent("Redirecting to verifier in 4 seconds...");

        act(() => {
            jest.advanceTimersByTime(4000);
        });
        countdown = document.getElementById("text-return-timer");
        expect(countdown).toHaveTextContent("Redirecting to verifier in 0 seconds...");
        expect(window.location.href).toBe("/redirected");
    });

    it("redirects immediately when button is clicked", () => {
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = { href: "" };

        act(() => {
            render(
                <CredentialShareSuccessModal
                    isOpen={true}
                    verifierName={verifierName}
                    credentials={credentials}
                    returnUrl="/clicked"
                />
            );
        });

        const button = document.getElementById("btn-return-to-verifier") as HTMLElement;
        act(() => {
            fireEvent.click(button);
        });

        expect(window.location.href).toBe("/clicked");
    });

    it("does not render when isOpen is false", () => {
        act(() => {
            render(
                <CredentialShareSuccessModal
                    isOpen={false}
                    verifierName={verifierName}
                    credentials={credentials}
                    returnUrl="/"
                />
            );
        });

        expect(document.getElementById("card-share-success")).toBeNull();
    });
});