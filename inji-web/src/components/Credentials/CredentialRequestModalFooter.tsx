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
                <button
                    type="button"
                    data-testid="btn-consent-share"
                    onClick={onConsentAndShare}
                    disabled={!isConsentButtonEnabled}
                    className={`${CredentialRequestModalStyles.footer.consentButton} ${
                        isConsentButtonEnabled
                            ? CredentialRequestModalStyles.footer.consentButtonEnabled
                            : CredentialRequestModalStyles.footer.consentButtonDisabled
                    }`}
                >
                    {t('buttons.consentShare')}
                </button>
                <div className={CredentialRequestModalStyles.footer.cancelButtonContainer}>
                    <button
                        type="button"
                        data-testid="btn-cancel"
                        onClick={onCancel}
                        className={`${CredentialRequestModalStyles.footer.cancelButton} bg-white rounded-md w-full h-full flex items-center justify-center border-none`}
                    >
                        <span className={CredentialRequestModalStyles.footer.cancelButtonText}>{t('buttons.cancel')}</span>
                    </button>
                </div>
            </div>

            {/* Desktop Layout - Buttons close together, aligned to right */}
            <div className={CredentialRequestModalStyles.footer.desktopLayout}>
                {/* Cancel button - positioned just left of consent button */}
                <div className={CredentialRequestModalStyles.footer.cancelButtonContainer}>
                    <button
                        type="button"
                        data-testid="btn-cancel"
                        onClick={onCancel}
                        className={`${CredentialRequestModalStyles.footer.cancelButton} bg-white rounded-md w-full h-full flex items-center justify-center border-none`}
                    >
                        <span className={CredentialRequestModalStyles.footer.cancelButtonText}>{t('buttons.cancel')}</span>
                    </button>
                </div>

                {/* Consent button - aligned with credentials */}
                <button
                    type="button"
                    data-testid="btn-consent-share"
                    onClick={onConsentAndShare}
                    disabled={!isConsentButtonEnabled}
                    className={`${CredentialRequestModalStyles.footer.consentButton} ${
                        isConsentButtonEnabled
                            ? CredentialRequestModalStyles.footer.consentButtonEnabled
                            : CredentialRequestModalStyles.footer.consentButtonDisabled
                    }`}
                >
                    {t('buttons.consentShare')}
                </button>
            </div>
        </div>
    );
};
