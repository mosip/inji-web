import React, {useState, useEffect, useRef} from 'react';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {SolidButton} from '../../components/Common/Buttons/SolidButton';
import {useTranslation} from 'react-i18next';
import {navigateToDashboardHome} from '../Dashboard/utils';
import {useUser} from '../../hooks/useUser';
import CrossIcon from '../../assets/CrossIcon.svg';

export const PinPage: React.FC = () => {
    const {t, i18n} = useTranslation('PinPage');
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [wallets, setWallets] = useState<any[]>([]);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [cookies] = useCookies(['XSRF-TOKEN']);

    const [passcode, setPasscode] = useState<string[]>(Array(6).fill(''));
    const [showPasscode, setShowPasscode] = useState(false);

    const [confirmPasscode, setConfirmPasscode] = useState<string[]>(
        Array(6).fill('')
    );
    const [showConfirm, setShowConfirm] = useState(false);

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
            console.error('Error occurred while fetching wallets:', error);
            setError(t('error.fetchWalletsError'));
        }
    };

    useEffect(() => {
        const fetchWalletsAndUserDetails = async () => {
            try {
                await fetchWallets();
                await fetchUserProfile();
            } catch (error) {
                console.error('Error fetching wallets or user profile:', error);
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

    const handleInputChange = (
        index: number,
        value: string,
        type: 'passcode' | 'confirm'
    ) => {
        if (!/\d/.test(value) && value !== '') return;

        const refs = type === 'passcode' ? passcodeRefs : confirmPasscodeRefs;
        const values =
            type === 'passcode' ? [...passcode] : [...confirmPasscode];
        values[index] = value;

        if (type === 'passcode') {
            setPasscode(values);
        } else {
            setConfirmPasscode(values);
        }

        if (value && index < 5) {
            refs.current[index + 1]?.focus();
        }
    };

    const renderInputs = (
        type: 'passcode' | 'confirm',
        visible: boolean,
        toggleVisibility: () => void
    ) => {
        const values = type === 'passcode' ? passcode : confirmPasscode;
        const refs = type === 'passcode' ? passcodeRefs : confirmPasscodeRefs;

        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 py-2 rounded-lg">
                    {values.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (refs.current[idx] = el)}
                            type={visible ? 'text' : 'password'}
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleInputChange(idx, e.target.value, type)
                            }
                            onFocus={(e) =>
                                e.target.classList.add('pin-input-focus-box')
                            }
                            onBlur={(e) => {
                                if (!digit) {
                                    e.target.classList.remove(
                                        'pin-input-focus-box'
                                    );
                                    e.target.classList.add('pin-input-box');
                                }
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === 'Backspace' &&
                                    idx > 0 &&
                                    !digit
                                ) {
                                    refs.current[idx - 1]?.focus();
                                }
                            }}
                            className={`pin-input-box-style ${
                                digit
                                    ? 'pin-input-focus-box-border'
                                    : 'pin-input-box-border'
                            } focus:outline-none`}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="pin-input-box-border pin-input-box-style flex items-center justify-center"
                >
                    {visible ? (
                        <FaEyeSlash className="text-iw-grayLight" />
                    ) : (
                        <FaEye className="text-iw-grayLight" />
                    )}
                </button>
            </div>
        );
    };

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
                throw responseData;
            }
            setIsPinCorrect(true);
        } catch (error) {
            setIsPinCorrect(false);
            setError(t('error.incorrectPinError'));
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
        const pin = passcode.join('');
        const confirmPin = confirmPasscode.join('');
        if (pin.length !== 6 || confirmPin.length !== 6) {
            setError(t('error.pinLengthError'));
            throw new Error('Invalid pin length');
        }
        if (wallets.length === 0 && pin !== confirmPin) {
            setError(t('error.passcodeMismatchError'));
            throw new Error('Pin and Confirm Pin mismatch');
        }

        const response = await fetch(api.createWalletWithPin.url(), {
            method: 'POST',
            headers: {
                ...api.createWalletWithPin.headers(),
                'Content-Type': 'application/json',
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
            setError(t('error.incorrectPinError'));
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled =
        passcode.includes('') ||
        (wallets.length === 0 && confirmPasscode.includes(''));

    return (
        <div
            className=" overflow-hidden fixed inset-0 backdrop-blur-sm bg-black bg-opacity-40 flex flex-col items-center justify-center z-50"
            data-testid="pin-page"
        >
            <div className="bg-white sm:mx=4 mx-2 rounded-2xl flex flex-col items-center justify-center py-[2%] px-0 sm:px-[18%] relative px-32 pt-32 pb-16">
                <div className="overflow-hidden absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute top-[155px] -translate-x-1/2">
                        {[...Array(6)].map((_, index) => {
                            const radius = 96 + index * 96;
                            const opacity = 0.8 - index * 0.1;
                            return (
                                <div
                                    key={index}
                                    className="absolute rounded-full border overflow-hidden"
                                    style={{
                                        width: `${radius}px`,
                                        height: `${radius}px`,
                                        borderWidth: '1px',
                                        borderColor: `rgba(228, 231, 236, ${opacity})`,
                                        top: `calc(50% - ${radius / 2}px)`,
                                        left: `calc(50% - ${radius / 2}px)`
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="text-center items-center items-start relative z-20 bg-transparent space-y-4">
                    <div
                        className="flex items-center justify-center"
                        data-testid="pin-logo"
                    >
                        <img
                            src={require('../../assets/Logomark.png')}
                            alt="Inji Web Logo"
                        />
                    </div>
                    <h1
                        className="text-xl sm:text-2xl font-semibold text-gray-800 p-4"
                        data-testid="pin-title"
                    >
                        {wallets.length === 0
                            ? t('setPasscode')
                            : t('enterPasscode')}
                    </h1>
                    <p
                        className="text-gray-600 text-sm sm:text-lg font-medium"
                        data-testid="pin-description"
                    >
                        {wallets.length === 0
                            ? t('setPasscodeDescription')
                            : t('enterPasscodeDescription')}
                    </p>
                </div>

                <div
                    className="flex flex-col bg-white rounded-lg shadow-iw-pinPageContainer mt-8 max-w-auto items-center relative z-20"
                    data-testid="pin-container"
                >
                    {wallets.length === 0 && (
                        <p
                            className="flex text-center mx-1 sm:mx-3 md:mx-5 mt-3 sm:mt-5 md:mt-7 w-[75%] text-iw-textTertiary text-sm sm:text-base"
                            data-testid="pin-warning"
                        >
                            {t('passcodeWarning')}
                        </p>
                    )}

                    {error ? (
                        <div
                            className="bg-iw-pink50 flex items-center justify-between w-full px-5 py-3 mt-3 sm:mt-5 md:mt-8"
                            data-testid="pin-error"
                        >
                            <div className="flex items-center">
                                <span className="w-full text-sm text-iw-darkRed">
                                    {error}
                                </span>
                            </div>
                            <img
                                src={CrossIcon}
                                alt="Close"
                                className="cursor-pointer"
                                onClick={() => setError(null)}
                            />
                        </div>
                    ) : (
                        wallets.length === 0 && (
                            <div className="pin-page-warning-text-border w-full mt-1 sm:mt-3 md:mt-5" />
                        )
                    )}
                    <div className="px-4 sm:px-6 md:px-10 py-3 sm:py-5 md:py-7 space-y-4">
                        <div className="mb-2" data-testid="pin-passcode-input">
                            <p className="text-sm text-left font-medium text-iw-textSecondary">
                                {t('enterPasscode')}
                            </p>
                            {renderInputs('passcode', showPasscode, () =>
                                setShowPasscode((prev) => !prev)
                            )}
                        </div>

                        {wallets.length === 0 && (
                            <div
                                className="mb-2"
                                data-testid="pin-confirm-passcode-input"
                            >
                                <p className="text-sm text-left font-medium text-iw-textSecondary">
                                    {t('confirmPasscode')}
                                </p>
                                {renderInputs('confirm', showConfirm, () =>
                                    setShowConfirm((prev) => !prev)
                                )}
                            </div>
                        )}

                        {wallets.length !== 0 && (
                            <p className="text-xs sm:text-sm text-left font-semibold text-iw-deepVioletIndigo my-0">
                                {t('forgotPasscode') + ' ?'}
                            </p>
                        )}

                        <SolidButton
                            fullWidth={true}
                            testId="pin-submit-button"
                            onClick={handleSubmit}
                            title={loading ? t('submitting') : t('submit')}
                            disabled={isButtonDisabled}
                            className={`${isButtonDisabled ? 'grayscale' : ''}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinPage;
