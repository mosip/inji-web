import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { LoaderModal } from "../modals/LoadingModal";
import { useTranslation } from "react-i18next";
import { TrustVerifierModal } from "../components/Issuers/TrustVerifierModal";
import { ErrorCard } from "../modals/ErrorCard";
import { CancelConfirmationModal } from "../modals/CancelConfirmationModal";
import { useApi } from "../hooks/useApi";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../utils/constants";
import { ApiRequest, ApiResult } from "../types/data";
import { useSelector } from "react-redux";
import { RootState } from "../types/redux";

export const UserAuthorizationPage: React.FC = () => {
    const { t } = useTranslation("VerifierTrustPage");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCancelConfirmation, setIsCancelConfirmation] = useState<boolean>(false);
    const [showTrustVerifier, setShowTrustVerifier] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [verifierData, setVerifierData] = useState<any>(null);
    const [presentationIdData, setPresentationIdData] = useState<string | null>(null);

    const validateApi = useApi();
    const addTrustedVerifierApi = useApi();
    const navigate = useNavigate();
    const useApiInstance = useApi;
    const userRejectVerifierApi = useApi();
    const language = useSelector((state: RootState) => state.common.language);


    const handleError = (message: string, err?: any) => {
        console.error("❌", message, err);
        setError(message);
        setIsLoading(false);
        setShowTrustVerifier(false);
    };

    const rejectionBody = {
        errorCode: "access_denied",
        errorMessage: "User denied authorization to share credentials"
    };

    const executeApiRequest = async (
        apiConfig: ApiRequest,
        id: string | null,
        body: any,
        onSuccess: (response: ApiResult<any>) => Promise<void>,
        apiInstance: ReturnType<typeof useApiInstance>,
        errorType: string = "apiError"
    ) => {
        if (!id) {
            throw new Error("Missing ID for API request.");
        }

        try {
            const response = await apiInstance.fetchData({
                url: apiConfig.url(id),
                headers: apiConfig.headers(language),
                apiConfig: apiConfig,
                body: body,
            });

            if (!response.ok()) {
                console.error(`Failed to fetch request, got ${errorType} with response - `, response);
                throw new Error(errorType);
            }

            await onSuccess(response);
        } catch (error) {
            console.error("API request failed:", error);
            throw new Error(errorType);
        }
    };

    const validateVerifierRequest = async () => {
        try {
            setIsLoading(true);
            const authorizationRequestUrl =
                window.location.search;

            const response = await validateApi.fetchData({
                apiConfig: api.validateVerifierRequest,
                body: { authorizationRequestUrl },
            });

            if (!response.ok()) {
                return handleError("Failed to validate verifier request. Please try again.", response.error);
            }
            const presentationId = response?.data?.presentationId;
            const verifier = response?.data?.verifier;
            if (!verifier) {
                return handleError("Invalid verifier response received.");
            }

            setPresentationIdData(presentationId)
            setVerifierData(verifier);
            if (!verifier.trusted) {
                setShowTrustVerifier(true);
            } else {
                console.log("Verifier already trusted:", verifier.name);
                setShowTrustVerifier(false);
            }
        } catch (err) {
            handleError("Failed to validate verifier request.", err);
        } finally {
            setIsLoading(false);
        }
    };

    const addTrustedVerifier = async () => {
        if (!verifierData?.id) return;

        try {
            const response = await addTrustedVerifierApi.fetchData({
                apiConfig: api.addTrustedVerifier,
                body: { verifierId: verifierData.id },
            });

            if (!response.ok()) {
                return handleError("Failed to add verifier to trusted list.", response.error);
            }

            console.log("Verifier added to trusted list:", response);
            setShowTrustVerifier(false);
        } catch (err) {
            handleError("Failed to add verifier to trusted list.", err);
        }
    };

    const rejectVerifierRequest = async () => {
        try {
            await executeApiRequest(
                api.userRejectVerifier,
                presentationIdData,
                rejectionBody,
                async () => {
                    navigate(ROUTES.ROOT);
                },
                userRejectVerifierApi,
                "rejectError"
            );
        } catch (error) {
            console.error("Failed to reject verifier:", error);
            setError("rejectError");
        } finally {
            setShowTrustVerifier(false);
        }
    };


    useEffect(() => {
        void validateVerifierRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <LoaderModal 
                isOpen={isLoading} 
                title={t("loadingCard.title")} 
                subtitle={t("loadingCard.subtitle")} 
                data-testid="loader-modal"
            />

            <TrustVerifierModal
                isOpen={showTrustVerifier}
                logo={verifierData?.logo}
                verifierName={verifierData?.name}
                verifierDomain={verifierData?.id}
                onTrust={addTrustedVerifier}
                onNotTrust={rejectVerifierRequest}
                onCancel={() => {
                    setShowTrustVerifier(false);
                    setIsCancelConfirmation(true);
                }}
                data-testid="modal-trust-verifier"
            />

            {error && (
                <ErrorCard
                    isOpen={!!error}
                    title={t("errorTitle") || "Error"}
                    description={error}
                    onClose={() => { setError(null); navigate(ROUTES.ROOT); }}
                    data-testid="error-card"
                />
            )}

            <CancelConfirmationModal
                isOpen={isCancelConfirmation}
                onConfirm={() => {
                    setIsCancelConfirmation(false);
                    navigate(ROUTES.ROOT);
                }}
                onClose={() => {
                    setIsCancelConfirmation(false);
                    setShowTrustVerifier(true);
                }}
                data-testid="modal-cancel-confirmation"
            />
        </div>
    );
};
