import React from 'react';
import { useTranslation } from 'react-i18next';
import { PresentationCredential } from '../../types/components';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';
import { CredentialItem } from './CredentialItem';

interface CredentialListProps {
    credentials: PresentationCredential[];
    selectedCredentials: string[];
    onCredentialToggle: (credentialId: string) => void;
}

export const CredentialList: React.FC<CredentialListProps> = ({
    credentials,
    selectedCredentials,
    onCredentialToggle
}) => {
    const { t } = useTranslation(['CredentialRequestModal']);

    if (credentials.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">{t('noCredentials.message')}</p>
                </div>
            </div>
        );
    }

    return (
        <ul className={CredentialRequestModalStyles.content.credentialsList}>
            {credentials.map((credential: PresentationCredential) => (
                <CredentialItem
                    key={credential.credentialId}
                    credential={credential}
                    isSelected={selectedCredentials.includes(credential.credentialId)}
                    onToggle={onCredentialToggle}
                />
            ))}
        </ul>
    );
};