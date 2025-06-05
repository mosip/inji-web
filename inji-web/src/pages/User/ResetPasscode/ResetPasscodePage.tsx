import React from 'react';
import {SolidButton} from '../../../components/Common/Buttons/SolidButton';
import {Trans, useTranslation} from 'react-i18next';
import {useUser} from '../../../hooks/useUser';
import {api} from '../../../utils/api';
import {useCookies} from 'react-cookie';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ResetPasscodePageStyles} from './ResetPasscodePageStyles';
import {BackgroundDecorator} from '../../../components/Common/BackgroundDecorator';
import {BackArrowButton} from '../../../components/Common/Buttons/BackArrowButton';
import {InfoIcon} from '../../../components/Common/Icons/InfoIcon';
import {ROUTES} from "../../../constants/Routes";

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

export const ResetPasscodePage: React.FC = () => {
    const {removeWallet, walletId} = useUser();
    const {t} = useTranslation('ResetPasscodePage');
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
            className: ResetPasscodePageStyles.instructionQuestion,
            content: t('resetInstruction.question')
        },
        {
            id: "text-reset-info1",
            className: ResetPasscodePageStyles.instructionText,
            content: t('resetInstruction.info1')
        },
        {
            id: "text-reset-info2",
            className: ResetPasscodePageStyles.instructionText,
            content: (
                <Trans
                    i18nKey={t('resetInstruction.info2.message')}
                    ns="ResetPasscodePage"
                    values={{
                        highlighter1: t('resetInstruction.info2.highlighter1', { ns: 'ResetPasscodePage' }),
                        highlighter2: t('resetInstruction.info2.highlighter2', { ns: 'ResetPasscodePage' })
                    }}
                    components={{
                        strong: <strong className={ResetPasscodePageStyles.instructionTextStrong} />
                    }}
                />
            )
        },
        {
            id: "text-reset-info3",
            className: ResetPasscodePageStyles.instructionText,
            content: (
                <Trans
                    i18nKey={t('resetInstruction.info3.message')}
                    ns="ResetPasscodePage"
                    values={{
                        highlighter: t('resetInstruction.info3.highlighter', { ns: 'ResetPasscodePage' })
                    }}
                    components={{
                        strong: <strong className={ResetPasscodePageStyles.instructionTextStrong} />
                    }}
                />
            )
        }
    ];

    return (
        <div
            className={ResetPasscodePageStyles.backdrop}
            data-testid="backdrop-reset-passcode"
        >
            <div className={ResetPasscodePageStyles.container}>
                <BackgroundDecorator
                    logoSrc={require('../../../assets/Logomark.png')}
                    logoAlt="Inji Web Logo"
                    logoTestId="logo-inji-web"
                />
                <div className={ResetPasscodePageStyles.contentWrapper}>
                    <div className={ResetPasscodePageStyles.header}>
                        <h1
                            className={ResetPasscodePageStyles.title}
                            data-testid="title-reset-passcode"
                        >
                            {t('title')}
                        </h1>
                        <div className={ResetPasscodePageStyles.subHeader}>
                            <BackArrowButton
                                onClick={handleBackNavigation}
                                btnClassName={
                                    ResetPasscodePageStyles.backArrowButton
                                }
                            />
                            <p
                                className={ResetPasscodePageStyles.subtitle}
                                data-testid="subtitle-reset-passcode"
                            >
                                {t('subTitle')}
                            </p>
                        </div>
                    </div>

                    <div className={ResetPasscodePageStyles.mainContent}>
                        <div className={ResetPasscodePageStyles.instructionBox}>
                            <InfoIcon
                                testId="icon-reset-instruction"
                                className="mt-[0.1rem]"
                            />
                            <InstructionContent
                                testId="text-reset-instruction"
                                className={
                                    ResetPasscodePageStyles.instructionContent
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
                                ResetPasscodePageStyles.forgetPasscodeButton
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
