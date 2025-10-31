import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {NoMatchingCredentialsModal} from './NoMatchingCredentialsModal';
import { LoaderModal } from './LoadingModal';
import {ErrorCard} from './ErrorCard';
import {useApi} from '../hooks/useApi';
import {useApiErrorHandler} from '../hooks/useApiErrorHandler';
import {api} from '../utils/api';
import {PresentationCredential, CredentialsResponse} from '../types/components';
import {CredentialRequestModalHeader} from '../components/Credentials/CredentialRequestModalHeader';
import {CredentialRequestModalContent} from '../components/Credentials/CredentialRequestModalContent';
import {CredentialRequestModalFooter} from '../components/Credentials/CredentialRequestModalFooter';
import {withErrorHandling} from '../utils/errorHandling';
import { CredentialRequestModalStyles } from './CredentialRequestModalStyles';


interface CredentialRequestModalProps {
    isVisible: boolean;
    verifierName: string;
    presentationId: string;
    verifier: {
        redirectUri: string | null;
    };
    onCancel: () => void;
    onConsentAndShare: (selectedCredentials: PresentationCredential[]) => void;
}

export const CredentialRequestModal: React.FC<CredentialRequestModalProps> = ({
                                                                                  isVisible,
                                                                                  verifierName,
                                                                                  presentationId,
                                                                                  verifier,
                                                                                  onCancel,
                                                                                  onConsentAndShare
                                                                              }) => {
    const {t} = useTranslation(['CredentialRequestModal']);
    const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
    const [credentials, setCredentials] = useState<PresentationCredential[]>([]);
    const [missingClaims, setMissingClaims] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fetchingRef = useRef<boolean>(false);
    const {fetchData} = useApi<CredentialsResponse>();

    const {
        showError,
        errorDescription,
        errorTitle,
        isRetrying,
        handleApiError,
        onClose: handleModalClose,
        onRetry
    } = useApiErrorHandler({ onClose: onCancel });

    const handleCancel = useCallback(async () => {
        await withErrorHandling(async () => {
            const cancelPayload = {
                errorCode: "access_denied",
                errorMessage: "User denied authorization to share credentials"
            };

            await fetchData({
                url: api.userRejectVerifier.url(presentationId),
                apiConfig: api.userRejectVerifier,
                body: cancelPayload
            });
        });

        if (verifier?.redirectUri) {
            window.location.href = verifier.redirectUri;
        } else {
            onCancel();
        }
    }, [presentationId, fetchData, onCancel, verifier?.redirectUri]);

    const handleCredentialToggle = useCallback((credentialId: string) => {
        setSelectedCredentials(prev =>
            prev.includes(credentialId)
                ? prev.filter(id => id !== credentialId)
                : [...prev, credentialId]
        );
    }, []);

    const handleConsentAndShare = useCallback(() => {
        const selectedFullCredentials = credentials.filter(cred =>
            selectedCredentials.includes(cred.credentialId)
        );
        onConsentAndShare(selectedFullCredentials);
    }, [selectedCredentials, credentials, onConsentAndShare]);

    // Memoize computed values and JSX elements at the top level
    const isConsentButtonEnabled = useMemo(() =>
            selectedCredentials.length > 0,
        [selectedCredentials.length]
    );

    const header = <CredentialRequestModalHeader verifierName={verifierName}/>;

    const content = (
        <CredentialRequestModalContent
            credentials={credentials}
            selectedCredentials={selectedCredentials}
            onCredentialToggle={handleCredentialToggle}
        />
    );

    const footer = (
        <CredentialRequestModalFooter
            isConsentButtonEnabled={isConsentButtonEnabled}
            onCancel={handleCancel}
            onConsentAndShare={handleConsentAndShare}
        />
    );

    const handleFetchSuccess = useCallback((response: any) => {
        const data = response.data;
        setCredentials(data?.availableCredentials || []);
        setMissingClaims(data?.missingClaims || []);
    }, []);

    const fetchCredentialsCore = useCallback(async () => {
        const response = await fetchData({
            url: api.fetchPresentationCredentials.url(presentationId),
            apiConfig: api.fetchPresentationCredentials
        });

        return response;
    }, [presentationId, fetchData]);

    const loadCredentials = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetchCredentialsCore();

            if (response.ok()) {
                handleFetchSuccess(response);
            } else {
                throw response.error || new Error("Failed to fetch presentation credentials");
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            handleApiError(err, "fetchPresentationCredentials", fetchCredentialsCore, handleFetchSuccess);
        }
    }, [fetchCredentialsCore, handleApiError, handleFetchSuccess]);

    useEffect(() => {
        if (!isVisible || !presentationId) return;
        if (fetchingRef.current) return;

        fetchingRef.current = true;
        void loadCredentials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, presentationId]);

    // Reset fetching ref when modal becomes invisible
    useEffect(() => {
        if (!isVisible) {
            fetchingRef.current = false;
        }
    }, [isVisible]);

    if (!isVisible) return null;


    // Show ErrorCard when there are API errors
    if (showError) {
        return (
            <ErrorCard
                isOpen={true}
                title={errorTitle}
                description={errorDescription}
                onClose={handleModalClose}
                onRetry={onRetry}
                isRetrying={isRetrying}
                testId="modal-error-card"
            />
        );
    }

    // Show loading modal when loading or retrying
    if (isLoading || isRetrying) {
        return (
            <LoaderModal
                isOpen={true}
                message={t('loading.message')}
                size="xl-loading"
                testId="modal-loader-card"
            />
        );
    }

    // Show NoMatchingCredentialsModal when no available credentials
    // This includes both cases: missing claims or empty wallet
    if (credentials.length === 0) {
        return (
            <NoMatchingCredentialsModal
                isVisible={true}
                missingClaims={missingClaims}
                onGoToHome={handleCancel}
                redirectUri={verifier.redirectUri}
                presentationId={presentationId}
            />
        );
    }

    return (
        <>
            <div data-testid="ModalWrapper-BackDrop" className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"></div>
            
            <div data-testid="ModalWrapper-Outer-Container" className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden">
                <div className="min-h-full p-4 flex items-center justify-center">
                    <div className={`${CredentialRequestModalStyles.container} flex flex-col bg-white rounded-xl border border-gray-200 shadow-lg`}>
                        <div data-testid="card-credential-request-modal">
                            {header}
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {content}
                        </div>
                        {footer}
                    </div>
                </div>
            </div>
        </>
    );
};
