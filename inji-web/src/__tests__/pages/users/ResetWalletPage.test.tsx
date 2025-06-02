import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {useUser} from '../../../hooks/useUser';
import {useCookies} from 'react-cookie';
import {useNavigate, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ResetWalletPage} from '../../../pages/users/ResetWalletPage';

jest.mock('react-i18next', () => {
    const translations: {[key: string]: string} = {
        'title': 'Reset Your Wallet',
        'subTitle': 'Reset wallet to regain access and re-download credentials',
        'resetInstruction.question': 'Forgot your passcode?',
        'resetInstruction.info1':
            "If you can't remember your passcode, you can reset it by clicking the button below.",
        'resetInstruction.info2.message':
            "<strong>Please note:</strong> This will remove all your saved cards from the account — such as your <strong>National ID card, Tax ID card, Insurance certificate</strong>, and any other documents you've added.",
        'resetInstruction.info2.highlighter1': 'Please note',
        'resetInstruction.info2.highlighter2':
            'National ID card, Tax ID card, Insurance certificate',
        'resetInstruction.info3.message':
            "After resetting, you'll need to set a new passcode and <strong>re-download your cards</strong> into your Wallet.",
        'resetInstruction.info3.highlighter': 're-download your cards',
        'forgetPasscode': 'Forget Passcode',
        'resetFailure':
            'Something went wrong while resetting your wallet. Please try again in a moment.'
    };

    return {
        useTranslation: () => ({
            t: (key: string, options?: any) => {
                let translatedText = translations[key] || key;

                if (typeof translatedText === 'string' && options) {
                    for (const optKey in options) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                options,
                                optKey
                            )
                        ) {
                            translatedText = translatedText.replace(
                                new RegExp(`{{${optKey}}}`, 'g'),
                                options[optKey]
                            );
                        }
                    }
                }
                return translatedText;
            },
            i18n: {
                language: 'en',
                changeLanguage: jest.fn()
            }
        }),
        Trans: ({
            children,
            i18nKey,
            values
        }: {
            children?: React.ReactNode;
            i18nKey?: string;
            values?: Record<string, string>;
        }) => {
            let content = translations[i18nKey as string] || i18nKey;

            if (typeof content === 'string' && values) {
                for (const valKey in values) {
                    if (Object.prototype.hasOwnProperty.call(values, valKey)) {
                        content = content.replace(
                            new RegExp(`{{${valKey}}}`, 'g'),
                            values[valKey]
                        );
                    }
                }
            }

            if (typeof content === 'string') {
                return <div dangerouslySetInnerHTML={{__html: content}} />;
            }
            return <>{children}</>;
        }
    };
});

jest.mock('../../../hooks/useUser', () => ({
    useUser: jest.fn()
}));

jest.mock('react-cookie', () => ({
    useCookies: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn()
    }
}));

global.fetch = jest.fn();

describe('ResetWalletPage Component', () => {
    const mockNavigate = jest.fn();
    const mockRemoveWallet = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        (useUser as jest.Mock).mockReturnValue({
            removeWallet: mockRemoveWallet,
            walletId: 'mock-wallet-id'
        });
        (useCookies as jest.Mock).mockReturnValue([
            {'XSRF-TOKEN': 'mock-xsrf-token'}
        ]);
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useLocation as jest.Mock).mockReturnValue({
            state: {walletId: 'location-wallet-id'}
        });
    });

    test('should match snapshot', () => {
        const {asFragment} = render(<ResetWalletPage />);

        expect(asFragment()).toMatchSnapshot();
    });

    test('should render all elements with correct test ids', () => {
        render(<ResetWalletPage />);

        expect(screen.getByTestId('backdrop-reset-wallet')).toBeInTheDocument();
        expect(screen.getByTestId('logo-inji-web')).toBeInTheDocument();
        expect(screen.getByTestId('title-reset-wallet')).toBeInTheDocument();
        expect(screen.getByTestId('btn-back-reset')).toBeInTheDocument();
        expect(
            screen.getByTestId('title-reset-wallet-description')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('icon-reset-instruction')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('text-reset-instruction')
        ).toBeInTheDocument();
        expect(screen.getByTestId('text-reset-question')).toBeInTheDocument();
        expect(screen.getByTestId('text-reset-info1')).toBeInTheDocument();
        expect(screen.getByTestId('text-reset-info2')).toBeInTheDocument();
        expect(screen.getByTestId('text-reset-info3')).toBeInTheDocument();
        expect(screen.getByTestId('btn-forget-passcode')).toBeInTheDocument();
    });

    test('should display translated text content correctly', () => {
        render(<ResetWalletPage />);

        expect(screen.getByTestId('title-reset-wallet')).toHaveTextContent(
            'Reset Your Wallet'
        );
        expect(
            screen.getByTestId('title-reset-wallet-description')
        ).toHaveTextContent(
            'Reset wallet to regain access and re-download credentials'
        );
        expect(screen.getByTestId('text-reset-question')).toHaveTextContent(
            'Forgot your passcode?'
        );
        expect(screen.getByTestId('btn-forget-passcode')).toHaveTextContent(
            'Forget Passcode'
        );
        expect(screen.getByTestId('text-reset-info2')).toHaveTextContent(
            "Please note: This will remove all your saved cards from the account — such as your National ID card, Tax ID card, Insurance certificate, and any other documents you've added."
        );
        expect(screen.getByTestId('text-reset-info3')).toHaveTextContent(
            "After resetting, you'll need to set a new passcode and re-download your cards into your Wallet."
        );
    });

    test('should navigate back to /pin when back arrow button is clicked', () => {
        render(<ResetWalletPage />);

        fireEvent.click(screen.getByTestId('btn-back-reset'));

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/pin');
    });

    test('should handle successful wallet reset: delete wallet and navigate to /pin', async () => {
        render(<ResetWalletPage />);

        fireEvent.click(screen.getByTestId('btn-forget-passcode'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('wallets/location-wallet-id'),
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        'X-XSRF-TOKEN': 'mock-xsrf-token'
                    }),
                    credentials: 'include'
                })
            );
            expect(mockRemoveWallet).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/pin');
            expect(toast.error).not.toHaveBeenCalled();
        });
    });

    test('should handle failed wallet reset: display error toast and not remove wallet or navigate', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({error: 'Wallet deletion failed'})
        });

        render(<ResetWalletPage />);

        fireEvent.click(screen.getByTestId('btn-forget-passcode'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(mockRemoveWallet).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith(
                'Something went wrong while resetting your wallet. Please try again in a moment.'
            );
        });
    });

    test('should use fallback walletId from useUser when location state is not available', async () => {
        (useLocation as jest.Mock).mockReturnValue({state: null});

        render(<ResetWalletPage />);

        fireEvent.click(screen.getByTestId('btn-forget-passcode'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('wallets/mock-wallet-id'),
                expect.any(Object)
            );
            expect(mockRemoveWallet).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/pin');
        });
    });

    test('should handle network error during wallet reset: display error toast and not remove wallet or navigate', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(
            new Error('Network error')
        );

        render(<ResetWalletPage />);

        fireEvent.click(screen.getByTestId('btn-forget-passcode'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(mockRemoveWallet).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith(
                'Something went wrong while resetting your wallet. Please try again in a moment.'
            );
        });
    });
});
