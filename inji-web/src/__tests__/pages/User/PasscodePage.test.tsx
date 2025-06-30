import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import {PasscodePage} from '../../../pages/User/Passcode/PasscodePage';
import {UserProvider} from "../../../context/User/UserContext";
import {DownloadSessionProvider} from "../../../context/User/DownloadSessionContext";
import {mockApiResponse, mockApiResponseSequence, mockUseApi} from "../../../test-utils/setupUseApiMock";
import {setMockUseSelectorState} from "../../../test-utils/mockReactRedux";
import {Storage} from "../../../utils/Storage";
import userEvent from "@testing-library/user-event";
import {useUser} from "../../../hooks/User/useUser";

// Mocking the useTranslation hook from react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                "setPasscode": "Set Passcode",
                "enterPasscode": "Enter Passcode",
                "enterPasscodeLabel": "Enter Passcode",
                "confirmPasscodeLabel": "Confirm Passcode",
                "resetasscode": "Reset Passcode",
                "setPasscodeDescription": "Set your passcode to get started",
                "enterPasscodeDescription": "Enter your 6 digit passcode",
                "passcodeWarning": "Make sure you remember the password for future login",
            };
            return translations[key] || key;
        }
    })
}));

jest.mock("../../../hooks/useApi.ts", () => {
    return {
        useApi: () => mockUseApi
    };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn()
}));

jest.mock("../../../utils/Storage.ts", () => ({
    Storage: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
        setItem: jest.fn(),
    },
}))

jest.mock("../../../hooks/User/useUser.tsx", () => ({
    useUser: jest.fn(),
}))

describe('Passcode', () => {
    const mockNavigate = jest.fn();

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <CookiesProvider>
                <UserProvider>
                    <DownloadSessionProvider>
                        <MemoryRouter>{ui}</MemoryRouter>
                    </DownloadSessionProvider>
                </UserProvider>
            </CookiesProvider>
        );
    };

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        setMockUseSelectorState({
            common: {
                language: 'en',
            },
        });

        (useUser as jest.Mock).mockReturnValue({
            removeWallet: jest.fn(),
            walletId: null,
            saveWalletId: jest.fn(),
            fetchUserProfile: jest.fn()
        });
    })

    test('renders passcode page', () => {
        renderWithProviders(<PasscodePage/>);
        const page = screen.getByTestId('passcode-page');
        expect(page).toBeInTheDocument();
    });

    test('renders passcode logo', () => {
        renderWithProviders(<PasscodePage/>);
        const logo = screen.getByTestId('logo-inji-web-container');
        expect(logo).toBeInTheDocument();
    });

    test('renders passcode title', () => {
        renderWithProviders(<PasscodePage/>);
        const title = screen.getByTestId('title-passcode');
        expect(title).toHaveTextContent(/Set Passcode|Enter Passcode/);
    });

    test("renders passcode input field", async () => {
        mockApiResponse({response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]})
        renderWithProviders(<PasscodePage/>);

        const passcodeInput = await screen.findByTestId("passcode-container");
        expect(passcodeInput).toBeInTheDocument();
        expect(within(passcodeInput).getByTestId("label-passcode")).toHaveTextContent("Enter Passcode");
    });

    test("renders confirm passcode input field when wallet does not exist", async () => {
        mockApiResponse({response: []})
        renderWithProviders(<PasscodePage/>);

        await screen.findByTestId("confirm-passcode-container");
        const confirmPasscodeInput = screen.getByTestId("confirm-passcode-container");
        expect(confirmPasscodeInput).toBeInTheDocument();
        expect(confirmPasscodeInput).toHaveTextContent("Confirm Passcode");
    });


    test("renders submit button", async () => {
        mockApiResponse({response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]})
        renderWithProviders(<PasscodePage/>);

        await screen.findByTestId("btn-submit-passcode")
    });

    test("should redirect to forgot passcode page when forgot passcode button is clicked", async () => {
        mockApiResponse({response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]})
        renderWithProviders(<PasscodePage/>);

        const forgotPasscodeButton = await screen.findByTestId("btn-forgot-passcode");
        expect(forgotPasscodeButton).toBeInTheDocument();
        forgotPasscodeButton.click();

        expect(mockNavigate).toBeCalledWith("/user/reset-passcode", {"state": {"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413"}}
        );
    })

    test("should redirect to home when successfully unlocked wallet", async () => {
        mockApiResponseSequence([
            {response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]},
            {response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]},
        ])
        renderWithProviders(<PasscodePage/>);

        await enterPasscode()
        userEvent.click(screen.getByTestId("btn-submit-passcode"));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1))
        expect(mockNavigate).toHaveBeenCalledWith("/user/home");
    })

// Testing for re-login scenario in case of session expiry
    test("should redirect to previous url post unlock if available", async () => {
        (Storage.getItem as jest.Mock).mockReturnValue("/previous-url");
        mockApiResponseSequence([
            {response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]},
            {response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]},
        ])
        renderWithProviders(<PasscodePage/>);

        await enterPasscode();
        userEvent.click(screen.getByTestId("btn-submit-passcode"));

        await waitFor(() =>
            expect(Storage.removeItem).toHaveBeenCalledWith("redirectTo", true)
        )
        expect(mockNavigate).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith("/previous-url");
    })

    async function enterPasscode() {
        await screen.findByTestId("passcode-container");
        const inputs = screen.getAllByTestId('input-passcode');
        inputs.map((input) => userEvent.type(input, '1'));
    }
});