import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {SolidButton} from '../../components/Common/Buttons/SolidButton';
import {useTranslation} from 'react-i18next';
import {navigateToDashboardHome} from '../Dashboard/utils';
import {useUser} from '../../hooks/useUser';
import {PasscodeInput} from '../../components/Users/PasscodeInput';
import {BackgroundDecorator} from '../../components/Common/BackgroundDecorator';
import {CrossIconButton} from '../../components/Common/Buttons/CrossIconButton';

export const PinPage: React.FC = () => {
    const {t} = useTranslation('PinPage');
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [wallets, setWallets] = useState<any[]>([]);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [passcode, setPasscode] = useState<string[]>(Array(6).fill(''));
    const [confirmPasscode, setConfirmPasscode] = useState<string[]>(
        Array(6).fill('')
    );
    const [isPinCorrect, setIsPinCorrect] = useState<boolean | null>(null);

    const passcodeRefs = useRef<(HTMLInputElement | null)[]>([]);
    const confirmPasscodeRefs = useRef<(HTMLInputElement | null)[]>([]);
    const {fetchUserProfile, walletId: hookWalletId, user} = useUser();

    const fetchWallets = async () => {
        try {
            const response = await fetch(api.fetchWallets.url(), {
                method: api.fetchWallets.methodType === 0 ? 'GET' : 'POST',
                headers: {
                    ...api.fetchWallets.headers(),
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                },
                credentials: 'include'
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw responseData;
            }

            setWallets(responseData);
        } catch (error) {
            console.error('Error occurred while fetching Wallets:', error);
            setError(t('error.fetchWalletsError'));
        }
    };

    useEffect(() => {
        const fetchWalletsAndUserDetails = async () => {
            await fetchWallets();
            try {
                await fetchUserProfile();
            } catch (error) {
                console.error(
                    'Error occurred while fetching User profile:',
                    error
                );
            }
        };
        fetchWalletsAndUserDetails();
    }, []);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'walletId') {
                fetchWallets();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const unlockWallet = async (walletId: string, pin: string) => {
        if (!walletId) {
            setError(t('error.walletNotFoundError'));
            navigate('/Pin');
            throw new Error('Wallet not found');
        }

        try {
            const response = await fetch(api.fetchWalletDetails.url(walletId), {
                method:
                    api.fetchWalletDetails.methodType === 0 ? 'GET' : 'POST',
                headers: {
                    ...api.fetchWalletDetails.headers(),
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                },
                credentials: api.fetchWalletDetails.credentials,
                body: JSON.stringify({walletPin: pin})
            });

            const responseData = await response.json();
            if (!response.ok) {
                setError(t('error.incorrectPinError'));
                throw responseData;
            }
            setIsPinCorrect(true);
        } catch (error) {
            setIsPinCorrect(false);
            throw error;
        }
    };

    const fetchUserProfileAndNavigate = async () => {
        try {
            await fetchUserProfile();
            navigateToDashboardHome(navigate);
        } catch (error) {
            setError('Failed to fetch user profile');
            throw error;
        }
    };

    const createWallet = async () => {
        try {
            const pin = passcode.join('');
            const confirmPin = confirmPasscode.join('');

            if (wallets.length === 0 && pin !== confirmPin) {
                setError(t('error.passcodeMismatchError'));
                throw new Error('Pin and Confirm Pin mismatch');
            }

            const response = await fetch(api.createWalletWithPin.url(), {
                method: 'POST',
                headers: {
                    ...api.createWalletWithPin.headers(),
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                },
                credentials: 'include',
                body: JSON.stringify({
                    walletPin: pin,
                    confirmWalletPin: confirmPasscode.join(''),
                    walletName: displayName
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(
                    `${t('error.createWalletError')}: ${
                        errorData.errorMessage || t('unknown-error')
                    }`
                );
                setIsPinCorrect(false);
                throw errorData;
            }

            const createdWallet = await response.json();
            await unlockWallet(createdWallet.walletId, pin);

            setWalletId(createdWallet.walletId);
            setWallets([{walletId: createdWallet.walletId}]);
            setIsPinCorrect(true);
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async () => {
        setError('');
        setIsPinCorrect(null);
        setLoading(true);

        try {
            if (wallets.length === 0) {
                await createWallet();
            } else {
                const walletId = wallets[0].walletId;
                const pin = passcode.join('');

                if (pin.length !== 6) {
                    setError(t('error.pinLengthError'));
                    setLoading(false);
                    return;
                }

                await unlockWallet(walletId, pin);
            }
            await fetchUserProfileAndNavigate();
        } catch (error) {
            console.error(
                'Error occurred while setting up Wallet or loading user profile',
                error
            );
            setIsPinCorrect(false);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled =
        passcode.includes('') ||
        (wallets.length === 0 && confirmPasscode.includes(''));

    return (
        <div
            data-testid="pin-page"
            className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-40 flex flex-col items-center justify-center z-50 h-screen"
        >
            <div
                className="rounded-2xl bg-white flex flex-col items-center justify-start relative
               w-[90%] sm:w-[85%] md:w-[90%]
               h-[80%] sm:h-[76%] md:h-[80%]
               overflow-y-auto
               shadow-iw-pinPageContainer"
            >
                <BackgroundDecorator
                    logoSrc={require('../../assets/Logomark.png')}
                    logoAlt="Inji Web Logo"
                    logoTestId="logo-inji-web"
                />

                <div className="flex flex-col items-center justify-start w-full top-[240px] relative z-10 pb-8">
                    <div className="text-center space-y-5 relative w-full max-w-[500px] px-4 sm:px-0">
                        <h1
                            className="text-xl sm:text-2xl md:text-3xl font-semibold text-iw-darkGreen"
                            data-testid="pin-title"
                        >
                            {wallets.length === 0
                                ? t('setPasscode')
                                : t('enterPasscode')}
                        </h1>
                        <p
                            className="text-iw-textTertiary text-sm sm:text-lg md:text-xl font-medium"
                            data-testid="pin-description"
                        >
                            {wallets.length === 0
                                ? t('setPasscodeDescription')
                                : t('enterPasscodeDescription')}
                        </p>
                    </div>

                    <div
                        className="flex flex-col bg-white sm:rounded-lg sm:shadow-iw-pinPageContainer items-center z-20 w-full max-w-[500px] mt-8 mb-4 mx-auto"
                        data-testid="pin-container"
                    >
                        {wallets.length === 0 && (
                            <div className="relative sm:hidden pin-page-warning-text-border min-w-full items-center justify-center mt-1 sm:mt-3 md:mt-5" />
                        )}

                        {wallets.length === 0 && (
                            <div className="w-full items-center justify-center flex">
                                <p
                                    className="text-iw-textTertiary text-center text-sm sm:text-base px-4 sm:px-8 pt-4 sm:pt-6 max-w-[560px]"
                                    data-testid="pin-warning"
                                >
                                    {t('passcodeWarning')}
                                </p>
                            </div>
                        )}

                        {error ? (
                            <div
                                className="bg-iw-pink50 w-full px-3 sm:px-5 py-3 mt-3 sm:mt-4 md:mt-5"
                                data-testid="pin-error"
                            >
                                <div className="flex items-start justify-between gap-2 max-w-[560px] mx-auto">
                                    <div className="flex-1 pr-2">
                                        <span className="text-sm text-iw-darkRed break-words whitespace-normal">
                                            {error}
                                        </span>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <CrossIconButton
                                            onClick={() => setError(null)}
                                            btnTestId="btn-close-icon"
                                            iconTestId="icon-close"
                                            btnClassName="cursor-pointer"
                                            iconClassName="min-w-[14px] min-h-[14px] mt-1.5 sm:mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            wallets.length === 0 && (
                                <div className="pin-page-warning-text-border w-full mt-2 sm:mt-3 md:mt-5" />
                            )
                        )}

                        <div className="w-full px-4 sm:px-8 py-3 sm:py-5 md:py-7 space-y-4 flex flex-col items-center">
                            <div className="w-full max-w-[410px] mx-auto">
                                <div className="overflow-x-auto">
                                    <div className="flex justify-center gap-x-2 min-w-fit">
                                        <PasscodeInput
                                            label={t('enterPasscode')}
                                            value={passcode}
                                            onChange={setPasscode}
                                            testId="pin-passcode-input"
                                        />
                                    </div>

                                    {wallets.length === 0 && (
                                        <div className="flex justify-center gap-x-2 mt-4 min-w-fit">
                                            <PasscodeInput
                                                label={t('confirmPasscode')}
                                                value={confirmPasscode}
                                                onChange={setConfirmPasscode}
                                                testId="pin-confirm-passcode-input"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {wallets.length !== 0 && (
                                <div className="w-full max-w-[410px] mx-auto flex justify-start">
                                    <button
                                        data-testid="btn-forgot-passcode"
                                        className="text-sm md:text-md font-semibold text-iw-deepVioletIndigo my-0 cursor-pointer"
                                        onClick={() =>
                                            navigate(
                                                '/dashboard/reset-wallet',
                                                {
                                                    state: {
                                                        walletId:
                                                            wallets[0].walletId
                                                    }
                                                }
                                            )
                                        }
                                    >
                                        {t('forgotPasscode') + ' ?'}
                                    </button>
                                </div>
                            )}

                            <div className="w-full max-w-[410px] mx-auto">
                                <SolidButton
                                    fullWidth={true}
                                    testId="pin-submit-button"
                                    onClick={handleSubmit}
                                    title={
                                        loading ? t('submitting') : t('submit')
                                    }
                                    disabled={isButtonDisabled}
                                    className={`${
                                        isButtonDisabled ? 'grayscale' : ''
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PinPage;
