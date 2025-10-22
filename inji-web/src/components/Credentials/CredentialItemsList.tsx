import React from 'react';
import { useTranslation } from 'react-i18next';
import { PresentationCredential } from '../../types/components';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';
import { CredentialItem } from './CredentialItem';

interface CredentialItemsListProps {
    credentials: PresentationCredential[];
    selectedCredentials: string[];
    onCredentialToggle: (credentialId: string) => void;
}

export const CredentialItemsList: React.FC<CredentialItemsListProps> = ({
    credentials,
    selectedCredentials,
    onCredentialToggle
}) => {
    const { t } = useTranslation(['CredentialRequestModal']);

    // Handle empty credentials case
    if (!credentials || credentials.length === 0) {
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
            {credentials.map((credential: PresentationCredential, index: number) => (
                <CredentialItem
                    key={credential.credentialId || index}
                    credential={credential}
                    isSelected={selectedCredentials.includes(credential.credentialId)}
                    onToggle={onCredentialToggle}
                />
            ))}
        </ul>
    );
};
