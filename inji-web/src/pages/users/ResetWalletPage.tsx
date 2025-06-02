import React from 'react';
import {SolidButton} from '../../components/Common/Buttons/SolidButton';
import {Trans, useTranslation} from 'react-i18next';
import InfoIcon from '../../assets/InfoIcon.svg';
import BackArrowIcon from '../../assets/BackArrowIcon.svg';
import {useUser} from '../../hooks/useUser';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ResetWalletPageStyles} from '../../styles/pages/ResetWalletPageStyles';

export const ResetWalletPage: React.FC = () => {
    const {removeWallet, walletId} = useUser();
    const {t, i18n} = useTranslation('ResetWalletPage');
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackNavigation = () => {
        navigate('/pin');
    };

    const handleForgotPasscode = async () => {
        try {
            const response = await fetch(
                api.deleteWallet.url(location.state?.walletId ?? walletId),
                {
                    method: 'DELETE',
                    headers: {
                        ...api.deleteWallet.headers(),
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                    },
                    credentials: 'include'
                }
            );
            if (!response.ok) {
                const responseData = await response.json();
                throw responseData;
            }
            removeWallet();
            navigate('/pin');
        } catch (error) {
            console.error('Error occurred while deleting Wallet:', error);
            toast.error(t('resetFailure'));
        }
    };

    return (
        <div
            className={ResetWalletPageStyles.backdrop}
            data-testid="backdrop-reset-wallet"
        >
            <div className={ResetWalletPageStyles.container}>
                <div className={ResetWalletPageStyles.circleContainer}>
                    <div className={ResetWalletPageStyles.circleWrapper}>
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
                <div className={ResetWalletPageStyles.contentWrapper}>
                    <div className={ResetWalletPageStyles.header}>
                        <div className={ResetWalletPageStyles.logoContainer}>
                            <img
                                data-testid="logo-inji-web"
                                src={require('../../assets/Logomark.png')}
                                alt="Inji Web Logo"
                            />
                        </div>
                        <h1
                            className={ResetWalletPageStyles.title}
                            data-testid="title-reset-wallet"
                        >
                            {t('title')}
                        </h1>
                        <div className={ResetWalletPageStyles.subHeader}>
                            <img
                                data-testid="btn-back-reset"
                                src={BackArrowIcon}
                                alt="Back Arrow"
                                className={
                                    ResetWalletPageStyles.backArrowButton
                                }
                                onClick={handleBackNavigation}
                            />
                            <p
                                className={ResetWalletPageStyles.subtitle}
                                data-testid="subtitle-reset-wallet"
                            >
                                {t('subTitle')}
                            </p>
                        </div>
                    </div>

                    <div className={ResetWalletPageStyles.mainContent}>
                        <div className={ResetWalletPageStyles.instructionBox}>
                            <img
                                data-testid="icon-reset-instruction"
                                src={InfoIcon}
                                alt="Info"
                            />
                            <div
                                data-testid="text-reset-instruction"
                                className={
                                    ResetWalletPageStyles.instructionContent
                                }
                            >
                                <p
                                    data-testid="text-reset-question"
                                    className={
                                        ResetWalletPageStyles.instructionQuestion
                                    }
                                >
                                    {t('resetInstruction.question')}
                                </p>
                                <p
                                    data-testid="text-reset-info1"
                                    className={
                                        ResetWalletPageStyles.instructionText
                                    }
                                >
                                    {t('resetInstruction.info1')}
                                </p>
                                <p
                                    data-testid="text-reset-info2"
                                    className={
                                        ResetWalletPageStyles.instructionText
                                    }
                                >
                                    <Trans
                                        i18nKey={t(
                                            'resetInstruction.info2.message'
                                        )}
                                        ns="ResetWalletPage"
                                        values={{
                                            highlighter1: t(
                                                'resetInstruction.info2.highlighter1',
                                                {
                                                    ns: 'ResetWalletPage'
                                                }
                                            ),
                                            highlighter2: t(
                                                'resetInstruction.info2.highlighter2',
                                                {
                                                    ns: 'ResetWalletPage'
                                                }
                                            )
                                        }}
                                        components={{
                                            strong: (
                                                <strong
                                                    className={
                                                        ResetWalletPageStyles.instructionTextStrong
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                </p>
                                <p
                                    data-testid="text-reset-info3"
                                    className={
                                        ResetWalletPageStyles.instructionText
                                    }
                                >
                                    <Trans
                                        i18nKey={t(
                                            'resetInstruction.info3.message'
                                        )}
                                        ns="ResetWalletPage"
                                        values={{
                                            highlighter: t(
                                                'resetInstruction.info3.highlighter',
                                                {ns: 'ResetWalletPage'}
                                            )
                                        }}
                                        components={{
                                            strong: (
                                                <strong
                                                    className={
                                                        ResetWalletPageStyles.instructionTextStrong
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                </p>
                            </div>
                        </div>
                        <SolidButton
                            fullWidth={true}
                            testId="btn-forget-passcode"
                            onClick={handleForgotPasscode}
                            title={t('forgetPasscode')}
                            className={
                                ResetWalletPageStyles.forgetPasscodeButton
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
