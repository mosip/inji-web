import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PresentationCredential } from '../../types/components';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';
import { CredentialItem } from './CredentialItem';
import { RequestStatus } from '../../utils/constants';
import { EmptyListContainer } from '../Common/EmptyListContainer';
import { SpinningLoader } from '../Common/SpinningLoader';
import { RootState } from '../../types/redux';

interface CredentialListProps {
    credentials?: PresentationCredential[];
    selectedCredentials?: string[];
    onCredentialToggle?: (credentialId: string) => void;
    state?: RequestStatus;
}

export const CredentialList: React.FC<CredentialListProps> = ({
    credentials,
    selectedCredentials = [],
    onCredentialToggle = () => {},
    state
}) => {
    const { t } = useTranslation(['CredentialRequestModal', 'CredentialTypesPage']);
    
    // Only fetch from Redux if credentials are not passed as props
    const reduxCredentials = useSelector((state: RootState) => 
        credentials ? null : state.credentials.credentials
    );
    
    // Transform Redux data to match PresentationCredential structure (only when needed)
    const transformedReduxCredentials = useMemo(() => {
        if (credentials || !reduxCredentials?.credentials_supported) {
            return [];
        }
        
        return reduxCredentials.credentials_supported.map((cred: { name?: string; display?: Array<{ name?: string; logo?: string }> }, index: number) => ({
            credentialId: cred.name || `unknown-${Date.now()}-${index}`,
            credentialTypeDisplayName: cred.display?.[0]?.name || cred.name || 'Unknown Credential',
            credentialTypeLogo: cred.display?.[0]?.logo || '',
            format: 'ldp_vc'
        }));
    }, [credentials, reduxCredentials]);
    
    const actualCredentials = credentials ?? transformedReduxCredentials;

    // Handle state-based rendering (for CredentialTypesPage)
    if (state !== undefined) {
        if (state === RequestStatus.LOADING) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <SpinningLoader />
                        <p className="text-gray-500 mb-4 mt-4">{t('CredentialTypesPage:loading')}</p>
                    </div>
                </div>
            );
        }

        if (state === RequestStatus.ERROR) {
            return <EmptyListContainer content={t('CredentialTypesPage:emptyContainerContent')} />;
        }

        if (state === RequestStatus.DONE && (!actualCredentials || actualCredentials.length === 0)) {
            return <EmptyListContainer content={t('CredentialTypesPage:emptyContainerContent')} />;
        }
    }

    // Handle credentials-based rendering (for CredentialRequestModal)
    if (!actualCredentials || actualCredentials.length === 0) {
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
            {actualCredentials.map((credential: any, index: number) => (
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