import React from 'react';
import { PresentationCredential } from '../../types/components';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';
import { CredentialItemsList } from './CredentialItemsList';

interface CredentialRequestModalContentProps {
    credentials: PresentationCredential[];
    selectedCredentials: string[];
    onCredentialToggle: (credentialId: string) => void;
}

export const CredentialRequestModalContent: React.FC<CredentialRequestModalContentProps> = ({
    credentials,
    selectedCredentials,
    onCredentialToggle
}) => {
    return (
        <div className={CredentialRequestModalStyles.content.container}>
            <CredentialItemsList
                credentials={credentials}
                selectedCredentials={selectedCredentials}
                onCredentialToggle={onCredentialToggle}
            />
        </div>
    );
};
