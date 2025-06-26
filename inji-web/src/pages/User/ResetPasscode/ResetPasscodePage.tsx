import React, {Fragment} from 'react';
import {SolidButton} from '../../../components/Common/Buttons/SolidButton';
import {Trans, useTranslation} from 'react-i18next';
import {useUser} from '../../../hooks/User/useUser';
import {api} from '../../../utils/api';
import {useLocation, useNavigate} from 'react-router-dom';
import {ResetPasscodePageStyles} from './ResetPasscodePageStyles';
import {ROUTES} from "../../../utils/constants";
import {PasscodePageTemplate} from "../../../components/PageTemplate/PasscodePage/PasscodePageTemplate";
import {Instruction} from "../../../components/Common/Instruction/Instruction";
import {InstructionStyles} from "../../../components/Common/Instruction/InstructionStyles";
import {InstructionItem} from "../../../types/data";
import {useApi} from "../../../hooks/useApi";

export const ResetPasscodePage: React.FC = () => {
    const {removeWallet, walletId} = useUser();
    const {t} = useTranslation('ResetPasscodePage');
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = React.useState<string | null>(null);
    const resetPasscode = useApi()

    const handleBackNavigation = () => {
        navigate(ROUTES.PASSCODE);
    };

    const handleForgotPasscode = async () => {
        try {
            const  response = await resetPasscode.fetchData({
                url: api.deleteWallet.url(location.state?.walletId ?? walletId),
                apiRequest: api.deleteWallet,
            })

            if (!response.ok()) {
                console.error('Error occurred while deleting Wallet:', error);
                setError(t('resetFailure'));
            }
            removeWallet();
            navigate(ROUTES.PASSCODE);
        } catch (error) {
            console.error('Error occurred while deleting Wallet:', error);
            setError(t('resetFailure'));
        }
    };

    function getInstructionItem(id: number) {
        return {
            id: `text-reset-info${id}`,
            content: (
                <Trans
                    i18nKey={t(`resetInstruction.info${id}.message`)}
                    ns="ResetPasscodePage"
                    values={{
                        highlighter: t(`resetInstruction.info${id}.highlighter`, {ns: 'ResetPasscodePage'}),
                    }}
                    components={{
                        strong: <strong className={InstructionStyles.instructionTextStrong}/>
                    }}
                />
            )
        };
    }

    const instructionItems: InstructionItem[] = [
        getInstructionItem(1),
        getInstructionItem(2),
        getInstructionItem(3),
        getInstructionItem(4),
        getInstructionItem(5)
    ];

    const renderContent = () => (
        <Fragment>
            <Instruction instructionItems={instructionItems} question={t('resetInstruction.question')}
                         testId={"reset"}/>
            <SolidButton
                fullWidth={true}
                testId="btn-set-new-passcode"
                onClick={handleForgotPasscode}
                title={t('setNewPasscode')}
                className={ResetPasscodePageStyles.resetPasscodeAction}
            />
        </Fragment>
    );

    return (
        <PasscodePageTemplate
            title={t('title')}
            subtitle={t('subTitle')}
            content={renderContent()}
            contentTestId="reset-passcode-content"
            testId="reset-passcode"
            error={error}
            onErrorClose={() => setError(null)}
            onBack={handleBackNavigation}
        />
    );
};
