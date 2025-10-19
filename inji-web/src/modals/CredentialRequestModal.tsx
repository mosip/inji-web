import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ModalWrapper} from './ModalWrapper';
import {NoMatchingCredentialsModal} from './NoMatchingCredentialsModal';
import {LoaderModal} from './LoadingModal';
import {ErrorCard} from './ErrorCard';
import {useApi} from '../hooks/useApi';
import {useApiErrorHandler} from '../hooks/useApiErrorHandler';
import {api} from '../utils/api';
import {PresentationCredential, CredentialsResponse} from '../types/components';
import {CredentialRequestModalHeader} from '../components/Credentials/CredentialRequestModalHeader';
import {CredentialRequestModalContent} from '../components/Credentials/CredentialRequestModalContent';
import {CredentialRequestModalFooter} from '../components/Credentials/CredentialRequestModalFooter';
import {withErrorHandling} from '../utils/errorHandling';


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
                title="API Error"
                description={errorCardMessage}
                isOpen={true}
                onClose={handleCloseErrorCard}
            />
        );
    }

    // Show loading modal when loading
    if (isLoading) {
        return (
            <LoaderModal
                isOpen={true}
                title={t('loading.title')}
                subtitle={t('loading.message')}
                size="6xl"
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
        <div
            className="w-full max-w-[677px] h-[430px] rounded-xl border border-gray-200 opacity-100 shadow-sm transition-all duration-300 ease-in-out max-[533px]:w-screen max-[533px]:left-0 max-[533px]:right-0 max-[533px]:z-[60]">
            <ModalWrapper
                header={
                    <div data-testid="card-credential-request-modal">
                        {header}
                    </div>
                }
                content={content}
                footer={footer}
                size="6xl"
                zIndex={50}
            />
        </div>
    );
};
