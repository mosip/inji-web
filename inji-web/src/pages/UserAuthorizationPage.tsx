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
    const userRejectVerifierApi = useApi();
    const navigate = useNavigate();


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
        setShowTrustVerifier(false);
        if (!presentationIdData) return;

        try {
            const response = await userRejectVerifierApi.fetchData({
                apiConfig: api.userRejectVerifier,
                url: api.userRejectVerifier.url(presentationIdData), 
                body: rejectionBody,
            });

            if (!response.ok()) {
                console.error("Failed to notify server of rejection:", response.error);
            }
            
            console.log("User rejection notified to server.");

        } catch (err) {
            console.error("Failed to notify server of rejection:", err);
        } finally {
            navigate(ROUTES.ROOT);
        }
    };


    useEffect(() => {
        void validateVerifierRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <LoaderModal isOpen={isLoading} />

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
            />

            {error && (
                <ErrorCard
                    isOpen={!!error}
                    title={t("errorTitle") || "Error"}
                    description={error}
                    onClose={() => setError(null)}
                />
            )}

            <CancelConfirmationModal
                isOpen={isCancelConfirmation}
                onConfirm={() => {setIsCancelConfirmation(false);
                    navigate(ROUTES.ROOT);   
                }}
                onClose={() => {
                    setIsCancelConfirmation(false);
                    setShowTrustVerifier(true);
                }}
            />
        </div>
    );
};
