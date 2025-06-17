import React, {Fragment} from 'react';
import {SolidButton} from '../../../components/Common/Buttons/SolidButton';
import {Trans, useTranslation} from 'react-i18next';
import {useUser} from '../../../hooks/User/useUser';
import {api} from '../../../utils/api';
import {useCookies} from 'react-cookie';
import {useLocation, useNavigate} from 'react-router-dom';
import {ResetPasscodePageStyles} from './ResetPasscodePageStyles';
import {BackArrowButton} from '../../../components/Common/Buttons/BackArrowButton';
import {InfoIcon} from '../../../components/Common/Icons/InfoIcon';
import {ROUTES} from "../../../utils/constants";
import {PasscodePageTemplate} from "../../../components/PageTemplate/PasscodePage/PasscodePageTemplate";

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
    const [error, setError] = React.useState<string | null>(null);

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
            setError(t('resetFailure'));
        }
    };

    function getInstruction(id: number) {
        return {
            id: `text-reset-info${id}`,
            className: ResetPasscodePageStyles.instructionText,
            content: (
                <Trans
                    i18nKey={t(`resetInstruction.info${id}.message`)}
                    ns="ResetPasscodePage"
                    values={{
                        highlighter: t(`resetInstruction.info${id}.highlighter`, {ns: 'ResetPasscodePage'}),
                    }}
                    components={{
                        strong: <strong className={ResetPasscodePageStyles.instructionTextStrong}/>
                    }}
                />
            )
        };
    }

    const instructionItems: InstructionItem[] = [
        {
            id: "text-reset-question",
            className: ResetPasscodePageStyles.instructionQuestion,
            content: t('resetInstruction.question')
        },
        getInstruction(1),
        getInstruction(2),
        getInstruction(3),
        getInstruction(4),
        getInstruction(5)
    ];

    function subTitle() {
        return <div className={ResetPasscodePageStyles.subHeader}>
            <BackArrowButton
                onClick={handleBackNavigation}
                btnClassName={ResetPasscodePageStyles.backArrowButton}
            />
            <p
                className={ResetPasscodePageStyles.subtitle}
                data-testid="subtitle-reset-passcode"
            >
                {t('subTitle')}
            </p>
        </div>;
    }

    const renderContent = () => (
        <Fragment>
            <div className={ResetPasscodePageStyles.instructionBox}>
                <InfoIcon
                    testId="icon-reset-instruction"
                    className="mt-[0.1rem]"
                />
                <InstructionContent
                    testId="text-reset-instruction"
                    className={ResetPasscodePageStyles.instructionContent}
                    instructionItems={instructionItems}
                />
            </div>

            {/*TODO: change it to setNewPasscode*/}
            <SolidButton
                fullWidth={true}
                testId="btn-forget-passcode"
                onClick={handleForgotPasscode}
                title={t('forgetPasscode')}
                className={ResetPasscodePageStyles.resetPasscodeAction}
            />
        </Fragment>
    );

    return (
        <PasscodePageTemplate
            title={t('title')}
            subtitle={t('subTitle')}
            content={renderContent()}
            testId="reset-passcode-page"
            error={error}
            onErrorClose={() => setError(null)}
            onBack={handleBackNavigation}
        />
    );
};
