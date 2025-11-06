import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { PresentationCredential } from "../types/components";
import { CredentialShareHandler } from "../handlers/CredentialShareHandler";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { useUser } from '../hooks/User/useUser';

export const UserAuthorizationPage: React.FC = () => {
    const { t } = useTranslation("VerifierTrustPage");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCancelConfirmation, setIsCancelConfirmation] = useState<boolean>(false);
    const [showTrustVerifier, setShowTrustVerifier] = useState<boolean>(false);
    const [showCredentialRequest, setShowCredentialRequest] = useState<boolean>(false);
    const [verifierData, setVerifierData] = useState<any>(null);
    const [presentationIdData, setPresentationIdData] = useState<string | null>(null);
    const [selectedCredentialsData, setSelectedCredentialsData] = useState<PresentationCredential[] | null>(null);
    const fetchingRef = useRef<boolean>(false);

    const apiService = useApi();
    const navigate = useNavigate();

    const { isUserLoggedIn } = useUser();
    const {
        showError,
        errorDescription,
        errorTitle,
        isRetrying,
        handleApiError,
        onClose,
        onRetry
    } = useApiErrorHandler({ onClose: () => navigate(ROUTES.ROOT) });

    const validateVerifierRequestCore = useCallback(async (cleanParams: string) => {
        const response = await apiService.fetchData({
            apiConfig: api.validateVerifierRequest,
            body: { authorizationRequestUrl: cleanParams },
        });
        return response;
    }, [apiService]);

    const handleValidationSuccess = useCallback((response: any) => {
        const data = response.data;
        const presentationId = data?.presentationId;
        const verifier = data?.verifier;
        if (!verifier) {
            throw new Error("Invalid verifier response received.");
        }
        setPresentationIdData(presentationId);
        setVerifierData(verifier);
        if (!verifier.trusted) {
            setShowTrustVerifier(true);
        } else {
            setShowTrustVerifier(false);
            setShowCredentialRequest(true);
        }
    }, [setPresentationIdData, setVerifierData, setShowTrustVerifier, setShowCredentialRequest]);

    const loadInitialData = useCallback(async () => {
        let cleanParams = window.location.search;

        try {
            if (!cleanParams) {
                throw new Error("No query parameters found in URL");
            }
        } catch (parseError) {
            setIsLoading(false);
            handleApiError(new Error("Invalid authorization request URL."), "validateVerifierRequest");
            return;
        }

        setIsLoading(true);
        try {
            const response = await validateVerifierRequestCore(cleanParams);

            if (response.ok()) {
                handleValidationSuccess(response);
            } else {
                throw response.error || new Error("Failed to validate verifier request. Please try again.");
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            handleApiError(err,
                "validateVerifierRequest",
                () => validateVerifierRequestCore(cleanParams),
                handleValidationSuccess
            );
        }
    }, [
        validateVerifierRequestCore,
        handleApiError,
        handleValidationSuccess
    ]);

    const addTrustedVerifierCore = useCallback(async () => {
        if (!verifierData?.id) return;
        const response = await apiService.fetchData({
            apiConfig: api.addTrustedVerifier,
            body: { verifierId: verifierData.id },
        });

        return response;
    }, [apiService, verifierData?.id]);

    const handleTrustSuccess = useCallback(() => {
        setShowTrustVerifier(false);
        setShowCredentialRequest(true);
    }, [setShowTrustVerifier, setShowCredentialRequest]);

    const handleTrustButton = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await addTrustedVerifierCore();

            if (response && response.ok()) {
                handleTrustSuccess();
            } else {
                throw response?.error || new Error("Failed to add verifier to trusted list.");
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            handleApiError(
                err,
                "addTrustedVerifier",
                addTrustedVerifierCore,
                handleTrustSuccess
            );
        }
    }, [addTrustedVerifierCore, handleApiError, handleTrustSuccess]);

    const handleNoTrustButton = () => {
        setShowTrustVerifier(false);
        setShowCredentialRequest(true);
    };

    const handleCredentialRequestCancel = () => {
        setShowCredentialRequest(false);
        navigate(ROUTES.ROOT);
    };

    const handleCredentialRequestConsent = (selectedCredentials: PresentationCredential[]) => {
        setSelectedCredentialsData(selectedCredentials);
        setShowCredentialRequest(false);
    };

    useEffect(() => {
        if (!isUserLoggedIn() || fetchingRef.current) {
            return;
        }

        fetchingRef.current = true;
        void loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserLoggedIn]);

    const isErrorActive = showError;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - positioned completely on the left */}
            <div className="flex-shrink-0">
                <Sidebar disabled={true} forceLeftPosition={true} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <LoaderModal
                    isOpen={isLoading || isRetrying}
                    title={t("loadingCard.title")}
                    subtitle={t("loadingCard.subtitle")}
                    size="xl-loading"
                    testId="modal-loader"
                />

                <TrustVerifierModal
                    isOpen={showTrustVerifier && !isErrorActive}
                    logo={verifierData?.logo}
                    verifierName={verifierData?.name}
                    onTrust={handleTrustButton}
                    onNotTrust={handleNoTrustButton}
                    onCancel={() => {
                        setShowTrustVerifier(false);
                        setIsCancelConfirmation(true);
                    }}
                    testId="modal-trust-verifier"
                />

                {showCredentialRequest && presentationIdData && (
                    <CredentialRequestModal
                        isVisible={showCredentialRequest && !isErrorActive}
                        verifierName={verifierData?.name || 'Verifier'}
                        presentationId={presentationIdData}
                        verifier={{ redirectUri: verifierData?.redirectUri || null }}
                        onCancel={handleCredentialRequestCancel}
                        onConsentAndShare={handleCredentialRequestConsent}
                    />
                )}

                {selectedCredentialsData && verifierData && presentationIdData && !isErrorActive && (
                    <CredentialShareHandler
                        verifierName={verifierData.name}
                        returnUrl={verifierData.redirectUri || ROUTES.ROOT}
                        selectedCredentials={selectedCredentialsData}
                        presentationId={presentationIdData}
                        onClose={() => { setSelectedCredentialsData(null); navigate(ROUTES.ROOT); }}
                    />
                )}

                <ErrorCard
                    isOpen={showError}
                    onClose={onClose}
                    onRetry={onRetry}
                    isRetrying={isRetrying}
                    title={errorTitle}
                    description={errorDescription}
                    testId="modal-error-card"
                />

                <TrustRejectionModal
                    isOpen={isCancelConfirmation && !isErrorActive}
                    onConfirm={() => {
                        setIsCancelConfirmation(false);
                        navigate(ROUTES.ROOT);
                    }}
                    onClose={() => {
                        setIsCancelConfirmation(false);
                        setShowTrustVerifier(true);
                    }}
                    testId="modal-trust-rejection-modal"
                />
            </div>
        </div>
    );
};