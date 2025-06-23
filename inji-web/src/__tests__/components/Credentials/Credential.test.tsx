import { setMockUseSelectorState } from "../../../test-utils/mockReactRedux";
import React from "react";
import {screen} from "@testing-library/react";
import {Credential} from "../../../components/Credentials/Credential";
import {
    getCredentialTypeDisplayObjectForCurrentLanguage,
    getIssuerDisplayObjectForCurrentLanguage
} from "../../../utils/i18n";
import {
    mockCredentialTypeDisplayArrayObject,
    mockIssuerDisplayArrayObject
} from "../../../test-utils/mockObjects";
import {
    renderWithProvider,
} from "../../../test-utils/mockUtils";
import userEvent from "@testing-library/user-event";
import { CredentialConfigurationObject } from "../../../types/data";
import { buildAuthorizationUrl } from "../../../utils/misc";
import { mockusei18n } from "../../../test-utils/mockUtils";
import { useUser } from "../../../hooks/User/useUser";

jest.mock("../../../components/Common/ItemBox", () => ({
    ItemBox: ({ index, title, url, onClick }: any) => (
      <div data-testid={`ItemBox-Outer-Container-${index}`} onClick={onClick} className="mock-itembox">
        <img data-testid="ItemBox-Logo" src={url} alt="Mocked Logo" />
        <h3 data-testid="ItemBox-Text">{title}</h3>
      </div>
    ),
  }));

jest.mock("../../../modals/DataShareExpiryModal", () => ({
    DataShareExpiryModal: ({ onCancel, onSuccess, credentialName }: any) => (
        <div data-testid="DataShareExpiryModal">
        <div className="mock-modal-header">Header for {credentialName}</div>
        <div className="mock-modal-content">Some description</div>
        <div className="mock-modal-footer">
            <button data-testid="expiry-confirm" onClick={() => onSuccess(123)}>Confirm</button>
            <button data-testid="expiry-cancel" onClick={onCancel}>Cancel</button>
        </div>
        </div>
    ),
}));


jest.mock("../../../utils/i18n", () => ({
    getIssuerDisplayObjectForCurrentLanguage: jest.fn(),
    getCredentialTypeDisplayObjectForCurrentLanguage: jest.fn()
}));

jest.mock("../../../utils/misc", () => {
    const originalModule = jest.requireActual("../../../utils/misc");
    const mockFn = jest.fn().mockReturnValue("fixedState123");
    const mockChallenge = jest.fn().mockReturnValue({
        code_challenge: "fixedChallengeValue",
        code_challenge_method: "S256",
    });
    const buildAuthorizationUrlMock = jest.fn().mockReturnValue("https://redirect.mock/constructed");
    return {
        ...originalModule,
        generateRandomString: mockFn,
        generateCodeChallenge: mockChallenge,
        buildAuthorizationUrl:buildAuthorizationUrlMock,
    };
});

jest.mock("../../../hooks/User/useUser", () => {
    const useUserMock = jest.fn().mockReturnValue({ isUserLoggedIn: () => true});
    return {useUser: useUserMock};
});

mockusei18n();
const mockSetErrorObj = jest.fn();

const credential: CredentialConfigurationObject = {
    name: "InsuranceCredential",
    scope: "mosip_vc_ldp",
    display: [
        {
            name: "Health Insurance",
            locale: "en",
            logo: "https://url.com/logo.png",
        },
    ],
};
const mockIssuer = { issuer_id: "issuer1", qr_code_type: "OnlineSharing" } as any;
const mockState = {
    issuers: { selected_issuer: mockIssuer },
    common: { language: "en", vcStorageExpiryLimitInTimes: 5 },
    credentials: {
        credentials: {
            authorization_endpoint: "https://test-auth-server/authorize",
        grant_types_supported: ["authorization_code"],
        },
    },
};

describe("Testing the Functionality of Credentials", () => {
    let originalOpen: typeof window.open;

    beforeAll(() => {
        originalOpen = window.open;
        window.open = jest.fn();
    });
    beforeEach(() => {
        setMockUseSelectorState(mockState);

        (buildAuthorizationUrl as jest.Mock).mockReturnValue("https://redirect.example.com/?a=1");

        (useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => true });

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
        renderWithProvider(
            <Credential
                credentialId="InsuranceCredential"
                index={1}
                credentialWellknown={credential}
                setErrorObj={mockSetErrorObj}
            />
        );

        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toBeInTheDocument();
    });

    test("Check if content is rendered properly", () => {        
        renderWithProvider(
            <Credential
                credentialId="InsuranceCredential"
                index={1}
                credentialWellknown={credential}
                setErrorObj={mockSetErrorObj}
            />
        );
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("Name");
    });

    test("Clicking ItemBox in Credential triggers onSuccess flow (calling buildAuthorizationUrl)", async () => {

        // Act: render Credential
        renderWithProvider(
          <Credential
            credentialId="InsuranceCredential"
            credentialWellknown={credential}
            index={1}
            setErrorObj={mockSetErrorObj}
          />
        );
    
        // Find and click the ItemBox
        const container = screen.getByTestId("ItemBox-Outer-Container-1");
        console.log("Found ItemBox outer HTML:", container.outerHTML);
        await userEvent.click(container);
    
        // Assert: buildAuthorizationUrl called once
        expect(buildAuthorizationUrl).toHaveBeenCalledTimes(1);
        const callArgs = (buildAuthorizationUrl as jest.Mock).mock.calls[0];
        
        // Verify positions of args:
        expect(callArgs.length).toBeGreaterThanOrEqual(5);
        expect(callArgs[0]).toMatchObject({ issuer_id: "issuer1" });
        expect(callArgs[1]).toEqual(credential);
        expect(callArgs[4]).toBe("https://test-auth-server/authorize");
    
        // Assert window.open called with returned URL
        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith("https://redirect.example.com/?a=1", "_self", "noopener");
      });

    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        window.open = originalOpen;
    });
});
  
describe("Credential Component Expiry-Modal Behavior", () => {
    let originalOpen: typeof window.open;

    beforeAll(() => {
      originalOpen = window.open;
      window.open = jest.fn();
    });
    afterAll(() => {
      window.open = originalOpen;
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      (useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => true });
        
      (buildAuthorizationUrl as jest.Mock).mockReturnValue("https://redirect.mock/constructed");

      setMockUseSelectorState(mockState);
  
      // i18n mocks
      (getIssuerDisplayObjectForCurrentLanguage as jest.Mock).mockReturnValue(
        mockIssuerDisplayArrayObject
      );
      (getCredentialTypeDisplayObjectForCurrentLanguage as jest.Mock).mockReturnValue(
        mockCredentialTypeDisplayArrayObject
      );
    });

  
    test("When user is logged in: clicking does NOT show expiry modal, and calls redirect", async () => {
  
      renderWithProvider(
        <Credential
          credentialId="InsuranceCredential"
          index={1}
          credentialWellknown={credential}
          setErrorObj={mockSetErrorObj}
        />
      );
  
      const itemBox = screen.getByTestId("ItemBox-Outer-Container-1");
      await userEvent.click(itemBox);
   
      // No expiry modal
      expect(screen.queryByTestId("DataShareExpiryModal")).toBeNull();
  
      // Redirect via buildAuthorizationUrl
      expect(buildAuthorizationUrl).toHaveBeenCalledTimes(1);
      const args = (buildAuthorizationUrl as jest.Mock).mock.calls[0];
      expect(args[0]).toMatchObject({ issuer_id: "issuer1" });
      expect(args[1]).toEqual(credential);
      expect(args[4]).toBe("https://test-auth-server/authorize");
      expect(window.open).toHaveBeenCalledWith("https://redirect.mock/constructed", "_self", "noopener");
    });
  
    test("Guest user + qr_code_type === 'OnlineSharing': clicking Shows expiry modal", async () => {

      // Arrange: mock useUser to return isUserLoggedIn: false
      (useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => false });
  
      (buildAuthorizationUrl as jest.Mock).mockReturnValue("https://redirect.mock/constructed");
  
      // Ensure selected_issuer.qr_code_type is "OnlineSharing"
      const guestIssuer = { issuer_id: "issuer1", qr_code_type: "OnlineSharing" };
      setMockUseSelectorState({
        issuers: { selected_issuer: guestIssuer },
        common: { language: "en", vcStorageExpiryLimitInTimes: 5 },
        credentials: {
          credentials: {
            authorization_endpoint: "https://test-auth-server/authorize",
            grant_types_supported: ["authorization_code"],
          },
        },
      });
  
      renderWithProvider(
        <Credential
          credentialId="InsuranceCredential"
          index={1}
          credentialWellknown={credential}
          setErrorObj={mockSetErrorObj}
        />
      );
  
      const itemBox = screen.getByTestId("ItemBox-Outer-Container-1");
      await userEvent.click(itemBox);
  
      // Expiry modal should appear
      const modal = screen.getByTestId("DataShareExpiryModal");
      expect(modal).toBeInTheDocument();
  
      // No redirect yet
      expect(buildAuthorizationUrl).not.toHaveBeenCalled();
      expect(window.open).not.toHaveBeenCalled();
  
      // Simulate confirm in modal
      const confirmBtn = screen.getByTestId("expiry-confirm");
      await userEvent.click(confirmBtn);
  
      // Now redirect
      expect(buildAuthorizationUrl).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith("https://redirect.mock/constructed", "_self", "noopener");
    });
  
    test("Guest user + qr_code_type !== 'OnlineSharing': clicking does NOT show expiry modal, and calls redirect", async () => {
      // // Arrange: mock useUser to return isUserLoggedIn: false
      (useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => false });
  
      (buildAuthorizationUrl as jest.Mock).mockReturnValue("https://redirect.mock/constructed");
  
      // selected_issuer.qr_code_type is something else
      const guestIssuerOffline = { issuer_id: "issuer1", qr_code_type: "OfflineSharing" };
      setMockUseSelectorState({
        issuers: { selected_issuer: guestIssuerOffline }, 
        common: { language: "en", vcStorageExpiryLimitInTimes: 5 },
        credentials: {
          credentials: {
            authorization_endpoint: "https://test-auth-server/authorize",
            grant_types_supported: ["authorization_code"],
          },
        },
      });
  
      renderWithProvider(
        <Credential
          credentialId="InsuranceCredential"
          index={1}
          credentialWellknown={credential}
          setErrorObj={mockSetErrorObj}
        />
      );
  
      const itemBox = screen.getByTestId("ItemBox-Outer-Container-1");
      await userEvent.click(itemBox);
  
      // No expiry modal
      expect(screen.queryByTestId("DataShareExpiryModal")).toBeNull();
  
      // Redirect directly
      expect(buildAuthorizationUrl).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith("https://redirect.mock/constructed", "_self", "noopener");
      
    });
  });