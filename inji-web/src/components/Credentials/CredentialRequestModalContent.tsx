import React from 'react';
import { PresentationCredential } from '../../types/components';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';
import { CredentialList } from './CredentialList';

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
            <CredentialList
                credentials={credentials}
                selectedCredentials={selectedCredentials}
                onCredentialToggle={onCredentialToggle}
            />
        </div>
    );
};
