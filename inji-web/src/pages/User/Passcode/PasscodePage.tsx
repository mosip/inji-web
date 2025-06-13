import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {api, MethodType} from '../../../utils/api';
import {useCookies} from 'react-cookie';
import {SolidButton} from '../../../components/Common/Buttons/SolidButton';
import {useTranslation} from 'react-i18next';
import {useUser} from '../../../hooks/useUser';
import {PasscodeInput} from '../../../components/Common/Input/PasscodeInput';
import {BackgroundDecorator} from '../../../components/Common/BackgroundDecorator';
import {CrossIconButton} from '../../../components/Common/Buttons/CrossIconButton';
import {navigateToUserHome} from "../../../utils/navigationUtils";
import { PasscodePageStyles } from './PasscodePageStyles';
import {ROUTES} from "../../../utils/constants";

export const PasscodePage: React.FC = () => {
    const {t} = useTranslation('PasscodePage');
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [wallets, setWallets] = useState<any[]>([]);
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [passcode, setPasscode] = useState<string[]>(Array(6).fill(''));
    const [confirmPasscode, setConfirmPasscode] = useState<string[]>(
        Array(6).fill('')
    );
    //TODO: isPasscodeCorrect state variable is not used anywhere in the code, consider removing it if not needed
    const [isPasscodeCorrect, setIsPasscodeCorrect] = useState<boolean | null>(null);

    const {fetchUserProfile} = useUser();

    const fetchWallets = async () => {
        try {
            const response = await fetch(api.fetchWallets.url(), {
                method: MethodType[api.fetchWallets.methodType],
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
            navigate(ROUTES.PASSCODE);
            throw new Error('Wallet not found');
        }

        try {
            const response = await fetch(api.fetchWalletDetails.url(walletId), {
                method: MethodType[api.fetchWalletDetails.methodType],
                headers: {
                    ...api.fetchWalletDetails.headers(),
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                },
                credentials: api.fetchWalletDetails.credentials,
                body: JSON.stringify({walletPin: pin})
            });

            const responseData = await response.json();
            if (!response.ok) {
                setError(t('error.incorrectPasscodeError'));
                throw responseData;
            }
            setIsPasscodeCorrect(true);
        } catch (error) {
            setIsPasscodeCorrect(false);
            throw error;
        }
    };

    const fetchUserProfileAndNavigate = async () => {
        try {
            await fetchUserProfile();
            navigateToUserHome(navigate);
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
                        errorData.errorMessage ?? t('unknown-error')
                    }`
                );
                setIsPasscodeCorrect(false);
                throw errorData;
            }

            const createdWallet = await response.json();
            await unlockWallet(createdWallet.walletId, pin);

            setWallets([{walletId: createdWallet.walletId}]);
            setIsPasscodeCorrect(true);
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async () => {
        setError('');
        setIsPasscodeCorrect(null);
        setLoading(true);

        try {
            if (wallets.length === 0) {
                await createWallet();
            } else {
                const walletId = wallets[0].walletId;
                const formattedPasscode = passcode.join('');

                if (formattedPasscode.length !== 6) {
                    setError(t('error.passcodeLengthError'));
                    setLoading(false);
                    return;
                }

                await unlockWallet(walletId, formattedPasscode);
            }
            await fetchUserProfileAndNavigate();
        } catch (error) {
            console.error(
                'Error occurred while setting up Wallet or loading user profile',
                error
            );
            setIsPasscodeCorrect(false);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled =
        passcode.includes('') ||
        (wallets.length === 0 && confirmPasscode.includes(''));

return (
        <div
            data-testid="passcode-page"
            className={PasscodePageStyles.pageOverlay}
        >
            <div className={PasscodePageStyles.container}>
                <BackgroundDecorator
                    logoSrc={require('../../../assets/Logomark.png')}
                    logoAlt="Inji Web Logo"
                    logoTestId="logo-inji-web"
                />

                <div className={PasscodePageStyles.contentWrapper}>
                    <div className={PasscodePageStyles.titleContainer}>
                        <h1
                            className={PasscodePageStyles.title}
                            data-testid="title-passcode"
                        >
                            {wallets.length === 0
                                ? t('setPasscode')
                                : t('enterPasscode')}
                        </h1>
                        <p
                            className={PasscodePageStyles.description}
                            data-testid="passcode-description"
                        >
                            {wallets.length === 0
                                ? t('setPasscodeDescription')
                                : t('enterPasscodeDescription')}
                        </p>
                    </div>

                    <div
                        className={PasscodePageStyles.passcodeContainer}
                        data-testid="passcode-inputs-container"
                    >
                        {wallets.length === 0 && (
                            <div className={PasscodePageStyles.warningTextBorder} />
                        )}

                        {wallets.length === 0 && (
                            <div className={PasscodePageStyles.warningTextContainer}>
                                <p
                                    className={PasscodePageStyles.warningText}
                                    data-testid="passcode-warning"
                                >
                                    {t('passcodeWarning')}
                                </p>
                            </div>
                        )}

                        {error ? (
                            <div
                                className={PasscodePageStyles.errorContainer}
                                data-testid="error-passcode"
                            >
                                <div className={PasscodePageStyles.errorContentWrapper}>
                                    <div className={PasscodePageStyles.errorTextContainer}>
                                        <span className={PasscodePageStyles.errorText}>
                                            {error}
                                        </span>
                                    </div>
                                    <div className={PasscodePageStyles.closeButtonContainer}>
                                        <CrossIconButton
                                            onClick={() => setError(null)}
                                            btnClassName={PasscodePageStyles.closeButton}
                                            iconClassName={PasscodePageStyles.closeIcon}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            wallets.length === 0 && (
                                <div className={PasscodePageStyles.bottomBorder} />
                            )
                        )}

                        <div className={PasscodePageStyles.inputContainer}>
                            <div className={PasscodePageStyles.inputWrapper}>
                                <div className={PasscodePageStyles.inputScrollContainer}>
                                    <div className={PasscodePageStyles.inputGroup}>
                                        <PasscodeInput
                                            label={t('enterPasscode')}
                                            value={passcode}
                                            onChange={setPasscode}
                                            testId="passcode"
                                        />
                                    </div>

                                    {wallets.length === 0 && (
                                        <div className={PasscodePageStyles.confirmInputGroup}>
                                            <PasscodeInput
                                                label={t('confirmPasscode')}
                                                value={confirmPasscode}
                                                onChange={setConfirmPasscode}
                                                testId="confirm-passcode"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {wallets.length !== 0 && (
                                <div className={PasscodePageStyles.forgotPasscodeContainer}>
                                    <button
                                        data-testid="btn-forgot-passcode"
                                        className={PasscodePageStyles.forgotPasscodeButton}
                                        onClick={() =>
                                            navigate(
                                                ROUTES.USER_RESET_PASSCODE,
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

                            <div className={PasscodePageStyles.buttonContainer}>
                                <SolidButton
                                    fullWidth={true}
                                    testId="btn-submit-passcode"
                                    onClick={handleSubmit}
                                    title={
                                        loading ? t('submitting') : t('submit')
                                    }
                                    disabled={isButtonDisabled}
                                    className={isButtonDisabled ? PasscodePageStyles.disabledButton : ''}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
