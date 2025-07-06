import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import {PasscodePage} from '../../../pages/User/Passcode/PasscodePage';
import {UserProvider} from "../../../context/User/UserContext";
import {DownloadSessionProvider} from "../../../context/User/DownloadSessionContext";
import {mockApiResponse, mockApiResponseSequence, mockUseApi} from "../../../test-utils/setupUseApiMock";
import {setMockUseSelectorState} from "../../../test-utils/mockReactRedux";
import {AppStorage} from "../../../utils/AppStorage";
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
                "forgotPasscode": "Forgot Passcode",
                "setPasscodeDescription": "Set your passcode to get started",
                "enterPasscodeDescription": "Enter your 6 digit passcode",
                "passcodeWarning": "Make sure you remember the password for future login",
                "error.walletStatus.temporarily_locked": "You’ve reached the maximum number of attempts. Your wallet is now temporarily locked for sometime",
                "error.walletStatus.permanently_locked": "Your wallet has been permanently locked due to multiple failed attempts. Please click on forgot password to reset your wallet to continue",
                "error.walletStatus.last_attempt_before_lockout": "Incorrect passcode. Last attempt remaining before your wallet is permanently locked",
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

jest.mock("../../../utils/AppStorage.ts", () => ({
    AppStorage: {
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

    test("should render enter passcode container along with forgot passcode and submit buttons when a Wallet exists", async () => {
        mockApiResponse({
            response: [{
                "walletId": "2c2e1810-19c8-4c85-910d-aa1622412413",
                "walletName": null,
                "walletStatus": null
            }]
        });
        renderWithProviders(<PasscodePage/>);

        const passcodeInput = await screen.findByTestId("passcode-container");
        expect(passcodeInput).toBeInTheDocument();
        expect(within(passcodeInput).getByTestId("label-passcode")).toHaveTextContent("Enter Passcode");

        const forgotPasscodeButton = await screen.findByTestId("btn-forgot-passcode");
        expect(forgotPasscodeButton).toBeInTheDocument();
        expect(forgotPasscodeButton).toHaveTextContent("Forgot Passcode?");

        const submitButton = await screen.findByTestId("btn-submit-passcode");
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    test("should render enter passcode and confirm passcode containers along with submit button when Wallet doesn't exist", async () => {
        mockApiResponse({response: []});
        renderWithProviders(<PasscodePage/>);

        const passcodeInput = await screen.findByTestId("passcode-container");
        expect(passcodeInput).toBeInTheDocument();
        expect(within(passcodeInput).getByTestId("label-passcode")).toHaveTextContent("Enter Passcode");

        const confirmPasscodeInput = await screen.findByTestId("confirm-passcode-container");
        expect(confirmPasscodeInput).toBeInTheDocument();
        expect(within(confirmPasscodeInput).getByTestId("label-confirm-passcode")).toHaveTextContent("Confirm Passcode");

        const submitButton = await screen.findByTestId("btn-submit-passcode");
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });


    test("should redirect to forgot passcode page when forgot passcode button is clicked", async () => {
        mockApiResponse({
            response: [{
                "walletId": "2c2e1810-19c8-4c85-910d-aa1622412413",
                "walletName": null,
                "walletStatus": null
            }]
        })
        renderWithProviders(<PasscodePage/>);

        const forgotPasscodeButton = await screen.findByTestId("btn-forgot-passcode");
        expect(forgotPasscodeButton).toBeInTheDocument();
        forgotPasscodeButton.click();

        expect(mockNavigate).toBeCalledWith("/user/reset-passcode", {"state": {"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413"}}
        );
    })

    test("should redirect to home when successfully unlocked wallet", async () => {
        mockApiResponseSequence([
            {
                response: [{
                    "walletId": "2c2e1810-19c8-4c85-910d-aa1622412413",
                    "walletName": null,
                    "walletStatus": null
                }]
            },
            {
                response: [{
                    "walletId": "2c2e1810-19c8-4c85-910d-aa1622412413",
                    "walletName": null,
                    "walletStatus": null
                }]
            },
        ])
        renderWithProviders(<PasscodePage/>);

        await enterPasscode()
        userEvent.click(screen.getByTestId("btn-submit-passcode"));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1))
        expect(mockNavigate).toHaveBeenCalledWith("/user/home");
    })

    test.each([
        {
            name: "should display temporarily locked error and disable input boxes and submit button when landing on the passcode page for a temporarily locked wallet",
            walletStatus: "temporarily_locked",
            expectedError: "You’ve reached the maximum number of attempts. Your wallet is now temporarily locked for sometime",
            inputsDisabled: true,
        },
        {
            name: "should display permanently locked error and disable input boxes and submit button when landing on the passcode page for a permanently locked wallet",
            walletStatus: "permanently_locked",
            expectedError: "Your wallet has been permanently locked due to multiple failed attempts. Please click on forgot password to reset your wallet to continue",
            inputsDisabled: true,
        },
        {
            name: "should display one attempt left before lockout error and enable input boxes when landing on the passcode page for a wallet with one attempt left before permanent lockout",
            walletStatus: "last_attempt_before_lockout",
            expectedError: "Incorrect passcode. Last attempt remaining before your wallet is permanently locked",
            inputsDisabled: false,
        },
    ])(
        "$name",
        async ({walletStatus, expectedError, inputsDisabled}) => {
            mockApiResponse({
                response: [
                    {walletId: "2c2e1810-19c8-4c85-910d-aa1622412413", walletName: null, walletStatus},
                ],
            });

            renderWithProviders(<PasscodePage/>);

            verifyPasscodeInputsAndSubmitButtonState(expectedError, inputsDisabled);
        }
    );

    // TODO: Fix these test cases
    // test.each([
    //     {
    //         name: "should display temporarily locked error and disable input boxes and submit button when unlock wallet endpoint returns temporarily_locked error code",
    //         walletStatus: "temporarily_locked",
    //         expectedError: "You’ve reached the maximum number of attempts. Your wallet is now temporarily locked for sometime",
    //         inputsDisabled: true,
    //     },
    //     {
    //         name: "should display permanently locked error and disable input boxes and submit button when unlock wallet endpoint returns permanently_locked error code",
    //         walletStatus: "permanently_locked",
    //         expectedError: "Your wallet has been permanently locked due to multiple failed attempts. Please click on forgot password to reset your wallet to continue",
    //         inputsDisabled: true,
    //     },
    //     {
    //         name: "should display one attempt left before lockout error and enable input boxes when unlock wallet endpoint returns last_attempt_before_lockout error code",
    //         walletStatus: "last_attempt_before_lockout",
    //         expectedError: "Incorrect passcode. Last attempt remaining before your wallet is permanently locked",
    //         inputsDisabled: false,
    //     },
    // ])(
    //     "$name",
    //     async ({walletStatus, expectedError, inputsDisabled}) => {
    //         mockApiResponseSequence([
    //             {
    //                 response: [
    //                     {walletId: "2c2e1810-19c8-4c85-910d-aa1622412413", walletName: null, walletStatus: null},
    //                 ],
    //             },
    //             {
    //                 response: {
    //                     error: {
    //                         response: {
    //                             data: {errorCode: walletStatus},
    //                         },
    //                     },
    //                 },
    //             },
    //         ]);
    //
    //         renderWithProviders(<PasscodePage/>);
    //
    //         await enterPasscode();
    //         userEvent.click(screen.getByTestId("btn-submit-passcode"));
    //         screen.debug();
    //
    //         verifyPasscodeInputsAndSubmitButtonState(expectedError, inputsDisabled);
    //     }
    // );

    test("should enable submit button after passcode is entered for a wallet with one attempt left before permanent lockout", async () => {
        mockApiResponse({
            response: [{
                "walletId": "2c2e1810-19c8-4c85-910d-aa1622412413",
                "walletName": null,
                "walletStatus": "last_attempt_before_lockout"
            }]
        })

        renderWithProviders(<PasscodePage/>);

        const errorSpan = await screen.findByTestId("error-msg-passcode");
        expect(errorSpan).toHaveTextContent("Incorrect passcode. Last attempt remaining before your wallet is permanently locked");

        const submitButton = screen.getByTestId("btn-submit-passcode");
        expect(submitButton).toBeDisabled();

        await enterPasscode();
        expect(submitButton).not.toBeDisabled();
    })

// Testing for re-login scenario in case of session expiry
    test("should redirect to previous url post unlock if available", async () => {
        (AppStorage.getItem as jest.Mock).mockReturnValue("/previous-url");
        mockApiResponseSequence([
            {response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]},
            {response: [{"walletId": "2c2e1810-19c8-4c85-910d-aa1622412413", "walletName": null}]},
        ])
        renderWithProviders(<PasscodePage/>);

        await enterPasscode();
        userEvent.click(screen.getByTestId("btn-submit-passcode"));

        await waitFor(() =>
            expect(AppStorage.removeItem).toHaveBeenCalledWith("redirectTo", true)
        )
        expect(mockNavigate).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith("/previous-url");
    })

    const enterPasscode = async () => {
        await screen.findByTestId("passcode-container");
        const inputs = screen.getAllByTestId('input-passcode');
        inputs.map((input) => userEvent.type(input, '1'));
    }

    const verifyPasscodeInputsAndSubmitButtonState = async (expectedError: string, inputsDisabled: boolean) => {
        await waitFor(()=>{
            const errorSpan = screen.getByTestId("error-msg-passcode");
            expect(errorSpan).toHaveTextContent(expectedError);
        })

        const inputs = screen.getAllByTestId("input-passcode");
        inputs.forEach((input) => {
            if (inputsDisabled) {
                expect(input).toBeDisabled();
            } else {
                expect(input).not.toBeDisabled();
            }
        });

        const submitButton = screen.getByTestId("btn-submit-passcode");
        expect(submitButton).toBeDisabled();
    }
});