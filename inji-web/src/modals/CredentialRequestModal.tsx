import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ModalWrapper} from './ModalWrapper';
import {NoMatchingCredentialsModal} from './NoMatchingCredentialsModal';
import { LoadingModalLandscape } from './LoadingModalLandscape';
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


    // Use the API error handler hook
    const {showErrorCard, errorCardMessage, handleApiError, handleCloseErrorCard} = useApiErrorHandler(onCancel);

    // Memoize callback functions at the top level (before any conditional returns)
    const handleCancel = useCallback(async () => {
        await withErrorHandling(
            async () => {
                // Call userRejectVerifier API with access_denied payload
                const cancelPayload = {
                    errorCode: "access_denied",
                    errorMessage: "User denied authorization to share credentials"
                };

                await fetchData({
                    url: api.userRejectVerifier.url(presentationId),
                    apiConfig: api.userRejectVerifier,
                    body: cancelPayload
                });
            },
            {
                context: 'handleCancel',
                logError: true,
                showToUser: false // Don't show error to user for cancel action
            }
        );

        // Redirect to verifier's redirectUri if available, otherwise call onCancel
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

    useEffect(() => {
        if (!isVisible || !presentationId) {
            return;
        }

        // Prevent double API calls
        if (fetchingRef.current) {
            return;
        }

        const fetchCredentials = async () => {
            fetchingRef.current = true;
            setIsLoading(true);

            try {
                const response = await fetchData({
                    url: api.fetchPresentationCredentials.url(presentationId),
                    apiConfig: api.fetchPresentationCredentials
                });

                if (response.ok()) {
                    const responseData = response.data;

                    if (responseData && responseData.availableCredentials) {
                        setCredentials(responseData.availableCredentials);

                        // Handle missing claims
                        if (responseData.missingClaims) {
                            setMissingClaims(responseData.missingClaims);
                        } else {
                            setMissingClaims([]);
                        }
                    } else {
                        setCredentials([]);

                        // Handle missing claims even when no available credentials
                        if (responseData && responseData.missingClaims) {
                            setMissingClaims(responseData.missingClaims);
                        } else {
                            setMissingClaims([]);
                        }
                    }
                } else {
                    const errorMessage = response.error?.message || 'Failed to fetch presentation credentials';
                    const error = response.error || new Error(errorMessage);
                    handleApiError(error, 'fetchPresentationCredentials');
                    setCredentials([]);
                    setMissingClaims([]);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                const error = err instanceof Error ? err : new Error(errorMessage);
                handleApiError(error, 'fetchPresentationCredentials');
                setCredentials([]);
                setMissingClaims([]);
            } finally {
                fetchingRef.current = false;
                setIsLoading(false);
            }
        };

        void fetchCredentials();

        // Cleanup function
        return () => {
            fetchingRef.current = false;
        };
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
    if (showErrorCard) {
        return (
            <ErrorCard
                isOpen={true}
                onClose={handleCloseErrorCard}
            />
        );
    }

    // Show loading modal when loading
    if (isLoading) {
        return (
            <LoadingModalLandscape
                isOpen={true}
                message={t('loading.message')}
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
