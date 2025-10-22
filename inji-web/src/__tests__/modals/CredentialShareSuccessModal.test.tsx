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

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
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
        mockNavigate.mockReset();
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
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders all elements correctly", () => {
        const { getByText, getByRole } = render(
            <CredentialShareSuccessModal
                isOpen={true}
                verifierName={verifierName}
                credentials={credentials}
                returnUrl="/"
            />
        );

        expect(getByText(`Shared with ${verifierName}`)).toBeInTheDocument();
        expect(getByText(`Your credentials were successfully presented to ${verifierName}`)).toBeInTheDocument();

        credentials.forEach((cred) => {
            expect(getByText(cred.credentialTypeDisplayName)).toBeInTheDocument();
            const img = document.querySelector(`img[alt='${cred.credentialTypeDisplayName}']`) as HTMLImageElement;
            expect(img).toHaveAttribute("src", cred.credentialTypeLogo);
        });

        const button = getByRole("button");
        expect(button).toBeInTheDocument();
        expect(getByText("Redirecting to verifier in 5 seconds...")).toBeInTheDocument();
    });

    it("counts down correctly and navigates when timer reaches 0", () => {
        render(
            <CredentialShareSuccessModal
                isOpen={true}
                verifierName={verifierName}
                credentials={credentials}
                returnUrl="/redirected"
            />
        );

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(document.body.textContent).toContain("Redirecting to verifier in 4 seconds...");

        act(() => {
            jest.advanceTimersByTime(4000);
        });
        expect(document.body.textContent).toContain("Redirecting to verifier in 0 seconds...");
        expect(mockNavigate).toHaveBeenCalledWith("/redirected");
    });

    it("navigates immediately when button is clicked", () => {
        const { getByRole } = render(
            <CredentialShareSuccessModal
                isOpen={true}
                verifierName={verifierName}
                credentials={credentials}
                returnUrl="/clicked"
            />
        );

        const button = getByRole("button");
        act(() => {
            fireEvent.click(button);
        });

        expect(mockNavigate).toHaveBeenCalledWith("/clicked");
    });

    it("does not render when isOpen is false", () => {
        render(
            <CredentialShareSuccessModal
                isOpen={false}
                verifierName={verifierName}
                credentials={credentials}
                returnUrl="/"
            />
        );

        expect(document.body.textContent).not.toContain("Shared with");
        expect(document.body.textContent).not.toContain("Your credentials were successfully presented");
    });
});