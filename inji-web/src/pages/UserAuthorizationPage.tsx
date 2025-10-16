import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { LoaderModal } from "../modals/LoadingModal";
import { useTranslation } from "react-i18next";
import { TrustVerifierModal } from "../components/Issuers/TrustVerifierModal";
import { ErrorCard } from "../modals/ErrorCard";
import { TrustRejectionModal } from "../components/Issuers/TrustRejectionModal";
import { CredentialRequestModal } from "../modals/CredentialRequestModal";
import { useApi } from "../hooks/useApi";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../utils/constants";
import { Sidebar } from "../components/User/Sidebar";

export const UserAuthorizationPage: React.FC = () => {
    const { t } = useTranslation("VerifierTrustPage");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCancelConfirmation, setIsCancelConfirmation] = useState<boolean>(false);
    const [showTrustVerifier, setShowTrustVerifier] = useState<boolean>(false);
    const [showCredentialRequest, setShowCredentialRequest] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [verifierData, setVerifierData] = useState<any>(null);
    const [presentationIdData, setPresentationIdData] = useState<string | null>(null);

    const apiService = useApi();
    const navigate = useNavigate();


    const handleError = (message: string, source: string, err?: any) => {
        const detailedMessage = `API Error in [${source}]: ${message}`;
        console.error(detailedMessage, err);
        setError(message);
        setIsLoading(false);
        setShowTrustVerifier(false);
    };


    const validateVerifierRequest = async () => {
        try {
            setIsLoading(true);
            // Extract query parameters from URL and get parameters from within authorizationRequestUrl
            const fullUrl = window.location.search;
            const queryParams = fullUrl.substring(1); // Remove the ? prefix
            
            // Find the authorizationRequestUrl parameter and extract parameters from its value
            const authUrlIndex = queryParams.indexOf('authorizationRequestUrl=');
            let cleanParams = '';
            
            if (authUrlIndex !== -1) {
                // Get the value of authorizationRequestUrl parameter
                const startIndex = authUrlIndex + 'authorizationRequestUrl='.length;
                
                let authUrlValue = queryParams.substring(startIndex);
                
                // Find the parameters after the second ? (keep URL encoded)
                const secondQuestionMark = authUrlValue.indexOf('?');
                
                if (secondQuestionMark !== -1) {
                    // Extract parameters after the second ? (including the ?)
                    cleanParams = authUrlValue.substring(secondQuestionMark);
                }
            }

            const response = await apiService.fetchData({
                apiConfig: api.validateVerifierRequest,
                body: { authorizationRequestUrl: cleanParams },
            });

            if (!response.ok()) {
                return handleError("Failed to validate verifier request. Please try again.", "validateVerifierRequest", response.error);
            }
            const presentationId = response?.data?.presentationId;
            const verifier = response?.data?.verifier;
            if (!verifier) {
                return handleError("Invalid verifier response received.", "validateVerifierRequest");
            }

            setPresentationIdData(presentationId)
            setVerifierData(verifier);
            if (!verifier.trusted) {
                setShowTrustVerifier(true);
            } else {
                setShowTrustVerifier(false);
                setShowCredentialRequest(true);
            }
        } catch (err) {
            handleError("Failed to validate verifier request.", "validateVerifierRequest", err);
        } finally {
            setIsLoading(false);
        }
    };

    const addTrustedVerifier = async () => {
        if (!verifierData?.id) return;

        try {
            const response = await apiService.fetchData({
                apiConfig: api.addTrustedVerifier,
                body: { verifierId: verifierData.id },
            });

            if (!response.ok()) {
                return handleError("Failed to add verifier to trusted list.", "addTrustedVerifier", response.error);
            }

            setShowTrustVerifier(false);
            setShowCredentialRequest(true);
        } catch (err) {
            handleError("Failed to add verifier to trusted list.", "addTrustedVerifier", err);
        }
    };

    const handleTrustButton = async () => {
        await addTrustedVerifier();
    };

    const handleNoTrustButton = () => {
        setShowTrustVerifier(false);
        setShowCredentialRequest(true);
    };

    const handleCredentialRequestCancel = () => {
        setShowCredentialRequest(false);
        navigate(ROUTES.ROOT);
    };

    const handleCredentialRequestConsent = (selectedCredentials: string[]) => {
        // TODO: Implement consent button logic for next story
        // This should include:
        // 1. Handle the selected credentials from CredentialRequestModal
        // 2. Process the consent and share logic
        // 3. Handle success/error states
        // 4. Navigate appropriately after processing
        
        setShowCredentialRequest(false);
        navigate(ROUTES.ROOT);
    };



    useEffect(() => {
        void validateVerifierRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - positioned completely on the left */}
            <div className="flex-shrink-0">
                <Sidebar disabled={true} forceLeftPosition={true} />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <LoaderModal
                    isOpen={isLoading}
                    title={t("loadingCard.title")}
                    subtitle={t("loadingCard.subtitle")}
                    size="xl-loading"
                    data-testid="loader-modal"
                />

                <TrustVerifierModal
                    isOpen={showTrustVerifier}
                    logo={verifierData?.logo}
                    verifierName={verifierData?.name}
                    verifierDomain={verifierData?.id}
                    onTrust={handleTrustButton}
                    onNotTrust={handleNoTrustButton}
                    onCancel={() => {
                        setShowTrustVerifier(false);
                        setIsCancelConfirmation(true);
                    }}
                    data-testid="modal-trust-verifier"
                />

                {showCredentialRequest && presentationIdData && (
                    <CredentialRequestModal
                        isVisible={showCredentialRequest}
                        verifierName={verifierData?.name || 'Verifier'}
                        presentationId={presentationIdData}
                        verifier={{ redirectUri: verifierData?.redirectUri || null }}
                        onCancel={handleCredentialRequestCancel}
                        onConsentAndShare={handleCredentialRequestConsent}
                    />
                )}

                {error && (
                    <ErrorCard
                        isOpen={!!error}
                        title={t("errorTitle") || "Error"}
                        description={error}
                        onClose={() => { setError(null); navigate(ROUTES.ROOT); }}
                    />
                )}

                <TrustRejectionModal
                    isOpen={isCancelConfirmation}
                    onConfirm={() => {
                        setIsCancelConfirmation(false);
                        navigate(ROUTES.ROOT);
                    }}
                    onClose={() => {
                        setIsCancelConfirmation(false);
                        setShowTrustVerifier(true);
                    }}
                />
            </div>
        </div>
    );
};
