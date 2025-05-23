import {FaExclamationCircle, FaEye, FaEyeSlash} from 'react-icons/fa';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {SolidButton} from '../../components/Common/Buttons/SolidButton';
import {useTranslation} from 'react-i18next';
import {navigateToDashboardHome} from '../Dashboard/utils';
import {useUser} from '../../hooks/useUser';

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
            const response = await fetch(
                api.fetchWallets.url(), {
                method: api.fetchWallets.methodType === 0 ? 'GET' : 'POST',
                headers: {
                    ...api.fetchWallets.headers(),
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                },
                credentials: 'include'
            });

            const responseData = await response.json();

            if(!response.ok){
                throw responseData;
            }
            
            setWallets(responseData);
        } catch (error) {
            console.error('Error occurred while fetching wallets:', error);
            setError(t('error.fetchWalletsError'));
        }
    };

    useEffect(() => {
        fetchWallets();
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
            <div className="flex items-center gap-2">
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
                        onFocus={(e) => e.target.classList.add('border-black')}
                        onBlur={(e) => {
                            if (!digit) {
                                e.target.classList.remove('border-black');
                                e.target.classList.add('border-gray-300');
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && idx > 0 && !digit) {
                                refs.current[idx - 1]?.focus();
                            }
                        }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 text-center border mb-4  ${
                            digit ? 'border-black' : 'border-gray-300'
                        } rounded-lg text-lg sm:text-xl focus:outline-none`}
                    />
                ))}
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className=" px-3 pb-4 sm:px-5"
                >
                    {visible ? <FaEyeSlash /> : <FaEye />}
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
                credentials: 'include',
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

        const newWalletId = await response.text();
        await unlockWallet(newWalletId, pin);

        setWalletId(newWalletId);
        setWallets([{walletId: newWalletId}]);
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
            console.error('Error occurred while setting up Wallet or loading user profile', error);
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
            <div className="bg-white sm:mx=4 mx-2 rounded-2xl flex flex-col items-center justify-center py-[2%] px-0 sm:px-[18%] ">
                <div className="text-center mb-2">
                    <div className="ps-14 sm:ps-24" data-testid="pin-logo">
                        <img
                            src={require('../../assets/Logomark.png')}
                            alt="Inji Web Logo"
                        />
                    </div>
                    <h1
                        className="text-xl sm:text-3xl font-semibold text-gray-800 p-4 "
                        data-testid="pin-title"
                    >
                        {wallets.length === 0
                            ? t('setPasscode')
                            : t('enterPasscode')}
                    </h1>
                    <p
                        className="text-gray-600 text-sm sm:text-lg"
                        data-testid="pin-description"
                    >
                        {wallets.length === 0
                            ? t('setPasscodeDescription')
                            : t('enterPasscodeDescription')}
                    </p>
                </div>

                <div
                    className="bg-white rounded-lg shadow-2xl p-6 max-w-sm text-center"
                    data-testid="pin-container"
                >
                    {wallets.length === 0 && (
                        <p
                            className="text-center mx-5 my-4 w-[85%] text-gray-500 text-xs sm:text-sm"
                            data-testid="pin-warning"
                        >
                            {t('passcodeWarning')}
                        </p>
                    )}

                    {error && (
                        <div
                            className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4 flex items-center justify-between"
                            data-testid="pin-error"
                        >
                            <div className="flex items-center gap-2">
                                <FaExclamationCircle className="text-red-500 w-4 h-4" />
                                <span className="w-full text-xs">{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="mb-2" data-testid="pin-passcode-input">
                        <p className="text-xs sm:text-sm text-left font-medium text-gray-700 mb-2">
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
                            <p className="text-xs sm:text-sm text-left font-medium text-gray-700 mb-2">
                                {t('confirmPasscode')}
                            </p>
                            {renderInputs('confirm', showConfirm, () =>
                                setShowConfirm((prev) => !prev)
                            )}
                        </div>
                    )}

                    {wallets.length !== 0 && (
                        <p className="text-xs sm:text-sm text-left font-semibold text-purple-800 my-3">
                            {t('resetPasscode')}
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
    );
};

export default PinPage;
