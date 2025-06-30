import React, {Fragment, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {api} from '../../../utils/api';
import {SolidButton} from '../../../components/Common/Buttons/SolidButton';
import {useTranslation} from 'react-i18next';
import {useUser} from '../../../hooks/User/useUser';
import {PasscodeInput} from '../../../components/Common/Input/PasscodeInput';
import {PasscodePageStyles} from './PasscodePageStyles';
import {KEYS, ROUTES} from "../../../utils/constants";
import {PasscodePageTemplate} from "../../../components/PageTemplate/PasscodePage/PasscodePageTemplate";
import {TertiaryButton} from "../../../components/Common/Buttons/TertiaryButton";
import {useApi} from "../../../hooks/useApi";
import {ApiError, ErrorType, Wallet} from "../../../types/data";
import {AppStorage} from "../../../utils/AppStorage";

export const PasscodePage: React.FC = () => {
    const {t} = useTranslation('PasscodePage');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [wallets, setWallets] = useState<any[] | null>(null);
    const [passcode, setPasscode] = useState<string[]>(Array(6).fill(''));
    const [confirmPasscode, setConfirmPasscode] = useState<string[]>(
        Array(6).fill('')
    );
    const {saveWalletId} = useUser();
    const createWalletApi = useApi<Wallet>();
    const walletsApi = useApi<Wallet[]>();
    const unlockWalletApi = useApi<Wallet>();

    const fetchWallets = async () => {
        try {
            const response = await walletsApi.fetchData({
                apiConfig: api.fetchWallets,
            })


            if (!response.ok()) {
                console.error('Error occurred while fetching Wallets:', response.error);
                setError(t('error.fetchWalletsError'));
            }

            setWallets(response.data);
        } catch (error) {
            console.error('Error occurred while fetching Wallets:', error);
            setError(t('error.fetchWalletsError'));
        }
    };

    useEffect(() => {
        const fetchWalletDetails = async () => {
            await fetchWallets();
        };
        void fetchWalletDetails();
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
            const response = await unlockWalletApi.fetchData({
                apiConfig: api.unlockWallet,
                body: {walletPin: pin},
                url: api.unlockWallet.url(walletId),
            })

            if (!response.ok()) {
                console.error("Error occurred while unlocking Wallet:", response.error);
                setError(t('error.incorrectPasscodeError'));
                throw response.error;
            }
            saveWalletId(walletId)
        } catch (error) {
            throw error;
        }
    };

    const createWallet = async () => {
        try {
            const pin = passcode.join('');
            const confirmPin = confirmPasscode.join('');

            if (pin !== confirmPin) {
                setError(t('error.passcodeMismatchError'));
                throw new Error('Pin and Confirm Pin mismatch');
            }

            const response = await createWalletApi.fetchData({
                apiConfig: api.createWalletWithPin,
                body: {
                    walletPin: pin,
                    confirmWalletPin: confirmPasscode.join(''),
                    walletName: null
                },
            })

            if (!response.ok()) {
                const errorMessage = ((response.error as ApiError)?.response?.data as ErrorType).errorMessage ?? t('unknown-error');
                setError(
                    `${t('error.createWalletError')}: ${errorMessage}`
                );
                throw response.error;
            }

            const createdWallet = response.data!;
            await unlockWallet(createdWallet.walletId, pin);

            setWallets([{walletId: createdWallet.walletId}]);
        } catch (error) {
            throw error;
        }
    };

    const handleUnlockSuccess = () => {
        // If the user was asked to re-login due to an expired session, redirect them to the page they were trying to access
        let redirectPath: string = ROUTES.USER_HOME
        const storedRedirectPath = AppStorage.getItem(KEYS.REDIRECT_TO, true);
        if (storedRedirectPath) {
            redirectPath = storedRedirectPath!;
            AppStorage.removeItem(KEYS.REDIRECT_TO, true);
        }
        navigate(redirectPath);
    }

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            if (isUserCreatingWallet()) {
                await createWallet();
            } else {
                const walletId = wallets ? wallets[0].walletId : undefined
                const formattedPasscode = passcode.join('');

                if (formattedPasscode.length !== 6) {
                    setError(t('error.passcodeLengthError'));
                    setLoading(false);
                    return;
                }

                await unlockWallet(walletId, formattedPasscode);
            }
            handleUnlockSuccess()
        } catch (error) {
            console.error(
                'Error occurred while setting up Wallet or loading user profile',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled =
        passcode.includes('') ||
        (isUserCreatingWallet() && confirmPasscode.includes(''));

    function isUserCreatingWallet() {
        return wallets?.length === 0;
    }

    const pageTitle = isUserCreatingWallet() ? t('setPasscode') : t('enterPasscode');
    const pageSubtitle = isUserCreatingWallet() ? t('setPasscodeDescription') : t('enterPasscodeDescription');

    function renderForgotPasscodeButton() {
        const handleForgotPasscode = () =>
            navigate(
                ROUTES.USER_RESET_PASSCODE,
                {
                    state: {
                        walletId: wallets ? wallets[0].walletId : undefined
                    }
                }
            );

        return <div className={PasscodePageStyles.forgotPasscodeContainer}>
            <TertiaryButton onClick={handleForgotPasscode} title={t('forgotPasscode') + "?"}
                            testId={"forgot-passcode"} className={PasscodePageStyles.forgotPasscodeButton}/>
        </div>;
    }

    function renderPasscodeInput(label: string, value: string[], onChange: (values: string[]) => void, testId: string) {
        return <PasscodeInput label={label} value={value} onChange={onChange} testId={testId}/>;
    }

    const renderContent = () => {
        return (
            <div className={PasscodePageStyles.contentContainer}>
                {wallets &&
                    <Fragment>
                        {<div className={PasscodePageStyles.inputWrapper}>
                            {renderPasscodeInput(t('enterPasscodeLabel'), passcode, setPasscode, "passcode")}

                            {isUserCreatingWallet() &&
                                renderPasscodeInput(t('confirmPasscodeLabel'), confirmPasscode, setConfirmPasscode, "confirm-passcode")
                            }
                        </div>
                        }
                        {
                            !isUserCreatingWallet() && renderForgotPasscodeButton()
                        }
                        <div className={PasscodePageStyles.buttonContainer}>
                            <SolidButton
                                fullWidth={true}
                                testId="btn-submit-passcode"
                                onClick={handleSubmit}
                                title={loading ? t('submitting') : t('submit')}
                                disabled={isButtonDisabled}
                                className={isButtonDisabled ? PasscodePageStyles.disabledButton : ''}
                            />
                        </div>
                    </Fragment>
                }

            </div>
        );
    };

    return (
        <PasscodePageTemplate
            title={pageTitle}
            subtitle={pageSubtitle}
            error={error}
            onErrorClose={() => setError(null)}
            content={renderContent()}
            contentTestId={"passcode-inputs-container"}
            testId="passcode"
        />
    );
};
