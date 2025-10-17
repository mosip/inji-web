import React from 'react';
import { useTranslation } from 'react-i18next';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';

interface CredentialRequestModalHeaderProps {
    verifierName: string;
}

export const CredentialRequestModalHeader: React.FC<CredentialRequestModalHeaderProps> = ({
    verifierName
}) => {
    const { t } = useTranslation(['CredentialRequestModal']);

    return (
        <div className={CredentialRequestModalStyles.header.container}>
            <h2 
                data-testid="title-verifier-request"
                className={CredentialRequestModalStyles.header.title}
            >
                {t('header.title', { verifierName })}
            </h2>
            <p 
                data-testid="text-select-credentials"
                className={CredentialRequestModalStyles.header.description}
            >
                {t('header.description')}
            </p>
        </div>
    );
};
