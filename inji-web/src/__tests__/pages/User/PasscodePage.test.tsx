import React from 'react';
import {render, screen, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import {PasscodePage} from '../../../pages/User/Passcode/PasscodePage';
import {UserProvider} from "../../../context/User/UserContext";
import {DownloadSessionProvider} from "../../../context/User/DownloadSessionContext";
import {mockApiResponse, mockUseApi} from "../../../test-utils/setupUseApiMock";

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

describe('Passcode', () => {
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
});