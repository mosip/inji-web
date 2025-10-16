import React from 'react';
import { useTranslation } from 'react-i18next';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';

interface CredentialRequestModalFooterProps {
    isConsentButtonEnabled: boolean;
    onCancel: () => void;
    onConsentAndShare: () => void;
}

export const CredentialRequestModalFooter: React.FC<CredentialRequestModalFooterProps> = ({
    isConsentButtonEnabled,
    onCancel,
    onConsentAndShare
}) => {
    const { t } = useTranslation(['CredentialRequestModal']);

    return (
        <div className={CredentialRequestModalStyles.footer.container}>
            {/* Mobile Layout - Stacked buttons */}
            <div className={CredentialRequestModalStyles.footer.mobileLayout}>
                <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-lg p-0.5">
                    <button
                        data-testid="btn-cancel"
                        onClick={onCancel}
                        className={`${CredentialRequestModalStyles.footer.cancelButton} bg-white rounded-md w-full h-full flex items-center justify-center border-none`}
                    >
                        <span className="font-montserrat font-bold text-base leading-4 text-center text-orange-500 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent inline-block whitespace-nowrap overflow-visible p-0.5 m-0 w-auto min-w-fit">{t('buttons.cancel')}</span>
                    </button>
                </div>
                <button
                    data-testid="btn-consent-share"
                    onClick={onConsentAndShare}
                    disabled={!isConsentButtonEnabled}
                    className={`${CredentialRequestModalStyles.footer.consentButton} ${
                        isConsentButtonEnabled
                            ? CredentialRequestModalStyles.footer.consentButtonEnabled
                            : `${CredentialRequestModalStyles.footer.consentButtonDisabled} bg-gray-400`
                    }`}
                >
                    {t('buttons.consentShare')}
                </button>
            </div>

            {/* Desktop Layout - Buttons close together, aligned to right */}
            <div className={CredentialRequestModalStyles.footer.desktopLayout}>
                {/* Cancel button - positioned just left of consent button */}
                <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-lg p-0.5">
                    <button
                        data-testid="btn-cancel"
                        onClick={onCancel}
                        className={`${CredentialRequestModalStyles.footer.cancelButton} bg-white rounded-md w-full h-full flex items-center justify-center border-none`}
                    >
                        <span className="font-montserrat font-bold text-base leading-4 text-center text-orange-500 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent inline-block whitespace-nowrap overflow-visible p-0.5 m-0 w-auto min-w-fit">{t('buttons.cancel')}</span>
                    </button>
                </div>

                {/* Consent button - aligned with credentials */}
                <button
                    data-testid="btn-consent-share"
                    onClick={onConsentAndShare}
                    disabled={!isConsentButtonEnabled}
                    className={`${CredentialRequestModalStyles.footer.consentButton} ${
                        isConsentButtonEnabled
                            ? CredentialRequestModalStyles.footer.consentButtonEnabled
                            : `${CredentialRequestModalStyles.footer.consentButtonDisabled} bg-gray-300`
                    }`}
                >
                    {t('buttons.consentShare')}
                </button>
            </div>
        </div>
    );
};
