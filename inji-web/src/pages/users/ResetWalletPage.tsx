import React from 'react';
import {SolidButton} from '../../components/Common/Buttons/SolidButton';
import {Trans, useTranslation} from 'react-i18next';
import {useUser} from '../../hooks/useUser';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ResetWalletPageStyles} from '../../styles/pages/ResetWalletPageStyles';
import {BackgroundDecorator} from '../../components/Common/BackgroundDecorator';
import {BackArrowButton} from '../../components/Common/Buttons/BackArrowButton';
import {InfoIcon} from '../../components/Common/Icons/InfoIcon';
import {ROUTES} from "../../constants/Routes";

interface InstructionItem {
    id: string;
    className: string;
    content: React.ReactNode;
}

interface InstructionContentProps {
    instructionItems: InstructionItem[];
    className: string;
    testId: string;
}

const InstructionContent: React.FC<InstructionContentProps> = ({ 
    instructionItems, 
    className, 
    testId 
}) => {
    return (
        <div data-testid={testId} className={className}>
            {instructionItems.map((item) => (
                <p
                    key={item.id}
                    data-testid={item.id}
                    className={item.className}
                >
                    {item.content}
                </p>
            ))}
        </div>
    );
};

export const ResetWalletPage: React.FC = () => {
    const {removeWallet, walletId} = useUser();
    const {t} = useTranslation('ResetWalletPage');
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackNavigation = () => {
        navigate(ROUTES.PASSCODE);
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
                throw await response.json();
            }
            removeWallet();
            navigate(ROUTES.PASSCODE);
        } catch (error) {
            console.error('Error occurred while deleting Wallet:', error);
            toast.error(t('resetFailure'));
        }
    };
    
    const instructionItems: InstructionItem[] = [
        {
            id: "text-reset-question",
            className: ResetWalletPageStyles.instructionQuestion,
            content: t('resetInstruction.question')
        },
        {
            id: "text-reset-info1",
            className: ResetWalletPageStyles.instructionText,
            content: t('resetInstruction.info1')
        },
        {
            id: "text-reset-info2",
            className: ResetWalletPageStyles.instructionText,
            content: (
                <Trans
                    i18nKey={t('resetInstruction.info2.message')}
                    ns="ResetWalletPage"
                    values={{
                        highlighter1: t('resetInstruction.info2.highlighter1', { ns: 'ResetWalletPage' }),
                        highlighter2: t('resetInstruction.info2.highlighter2', { ns: 'ResetWalletPage' })
                    }}
                    components={{
                        strong: <strong className={ResetWalletPageStyles.instructionTextStrong} />
                    }}
                />
            )
        },
        {
            id: "text-reset-info3",
            className: ResetWalletPageStyles.instructionText,
            content: (
                <Trans
                    i18nKey={t('resetInstruction.info3.message')}
                    ns="ResetWalletPage"
                    values={{
                        highlighter: t('resetInstruction.info3.highlighter', { ns: 'ResetWalletPage' })
                    }}
                    components={{
                        strong: <strong className={ResetWalletPageStyles.instructionTextStrong} />
                    }}
                />
            )
        }
    ];

    return (
        <div
            className={ResetWalletPageStyles.backdrop}
            data-testid="backdrop-reset-wallet"
        >
            <div className={ResetWalletPageStyles.container}>
                <BackgroundDecorator
                    logoSrc={require('../../assets/Logomark.png')}
                    logoAlt="Inji Web Logo"
                    logoTestId="logo-inji-web"
                />
                <div className={ResetWalletPageStyles.contentWrapper}>
                    <div className={ResetWalletPageStyles.header}>
                        <h1
                            className={ResetWalletPageStyles.title}
                            data-testid="title-reset-wallet"
                        >
                            {t('title')}
                        </h1>
                        <div className={ResetWalletPageStyles.subHeader}>
                            <BackArrowButton
                                onClick={handleBackNavigation}
                                btnClassName={
                                    ResetWalletPageStyles.backArrowButton
                                }
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
                            <InfoIcon
                                testId="icon-reset-instruction"
                                className="mt-[0.1rem]"
                            />
                            <InstructionContent
                                testId="text-reset-instruction"
                                className={
                                    ResetWalletPageStyles.instructionContent
                                }
                                instructionItems={instructionItems}
                            />
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
