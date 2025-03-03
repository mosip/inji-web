import React from "react";
import {screen} from "@testing-library/react";
import {Credential} from "../../../components/Credentials/Crendential";
import {IssuerConfigurationObject} from "../../../types/data";
import {
    getCredentialTypeDisplayObjectForCurrentLanguage,
    getIssuerDisplayObjectForCurrentLanguage
} from "../../../utils/i18n";
import {
    mockCredentials,
    mockCredentialTypeDisplayArrayObject,
    mockIssuerDisplayArrayObject
} from "../../../test-utils/mockObjects";
import {
    renderWithProvider,
    mockUseSelector
} from "../../../test-utils/mockUtils";

// todo : extract the local method to mockUtils, which is added to bypass the problems
// Mock the i18n configuration
jest.mock("../../../utils/i18n", () => ({
    getIssuerDisplayObjectForCurrentLanguage: jest.fn(),
    getCredentialTypeDisplayObjectForCurrentLanguage: jest.fn()
}));

const credential: IssuerConfigurationObject = {
    ...mockCredentials,
    credentials_supported: mockCredentials.credentials_supported.filter(
        (credential) => credential.name === "InsuranceCredential"
    )
};

describe("Testing the Layout of Credentials", () => {
    beforeEach(() => {
        mockUseSelector();
        const useSelectorMock = require("react-redux").useSelector;
        useSelectorMock.mockImplementation((selector: any) =>
            selector({
                issuers: {
                    selected_issuer: "issuer1"
                },
                common: {
                    language: "en"
                }
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Check if the layout is matching with the snapshots", () => {
        // @ts-ignore
        getIssuerDisplayObjectForCurrentLanguage.mockReturnValue(
            mockIssuerDisplayArrayObject
        );
        //@ts-ignore
        getCredentialTypeDisplayObjectForCurrentLanguage.mockReturnValue(
            mockCredentialTypeDisplayArrayObject
        );
        const {asFragment} = renderWithProvider(
            <Credential
                credentialId="InsuranceCredential"
                index={1}
                credentialWellknown={credential}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality of Credentials", () => {
    let originalOpen: typeof window.open;

    beforeAll(() => {
        originalOpen = window.open;
        window.open = jest.fn();
    });
    beforeEach(() => {
        const useSelectorMock = require("react-redux").useSelector;
        useSelectorMock.mockImplementation((selector: any) =>
            selector({
                issuers: {
                    selected_issuer: "issuer1"
                },
                common: {
                    language: "en"
                }
            })
        );
        // @ts-ignore
        getIssuerDisplayObjectForCurrentLanguage.mockReturnValue(
            mockIssuerDisplayArrayObject
        );

        // @ts-ignore
        getCredentialTypeDisplayObjectForCurrentLanguage.mockReturnValue(
            mockCredentialTypeDisplayArrayObject
        );
    });

    test("Check the presence of the container", () => {
        const credential: IssuerConfigurationObject = {
            ...mockCredentials,
            credentials_supported: mockCredentials.credentials_supported.filter(
                (credential) => credential.name === "InsuranceCredential"
            )
        };
       
        renderWithProvider(
            <Credential
                credentialId="InsuranceCredential"
                index={1}
                credentialWellknown={credential}
            />
        );

        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toBeInTheDocument();
    });

    test("Check if content is rendered properly", () => {
        const credential: IssuerConfigurationObject = {
            ...mockCredentials,
            credentials_supported: mockCredentials.credentials_supported.filter(
                (credential) => credential.name === "InsuranceCredential"
            )
        };
        
        renderWithProvider(
            <Credential
                credentialId="InsuranceCredential"
                index={1}
                credentialWellknown={credential}
            />
        );
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("Name");
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        window.open = originalOpen;
    });
});
