import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { LoaderModal } from "../modals/LoadingModal";
import { useTranslation } from "react-i18next";
import { TrustVerifierModal } from "../modals/TrustVerifierModal";
import { ErrorCard } from "../modals/ErrorCard";
import { CancelConfirmationModal } from "../modals/CancelConfirmationModal";
import { useApi } from "../hooks/useApi";

export const UserAuthorizationPage: React.FC = () => {
    const { t } = useTranslation("Common");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCancelConfirmation, setIsCancelConfirmation] = useState<boolean>(false);
    const [showTrustVerifier, setShowTrustVerifier] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [verifierData, setVerifierData] = useState<any>(null);

    const validateApi = useApi();
    const addTrustedVerifierApi = useApi();

    // 🔹 Common Error Handler
    const handleError = (message: string, err?: any) => {
        console.error("❌", message, err);
        setError(message);
        setIsLoading(false);
        setShowTrustVerifier(false);
    };

    // 🔹 Validate verifier request
    const validateVerifierRequest = async () => {
        try {
            setIsLoading(true);
            const authorizationRequestUrl =
                "openid4vp://authorize?" + window.location.search.substring(1);

            const response = await validateApi.fetchData({
                apiConfig: api.validateVerifierRequest,
                body: { authorizationRequestUrl },
            });

            if (!response.ok()) {
                return handleError("Failed to validate verifier request. Please try again.", response.error);
            }

            const verifier = response?.data?.verifier;
            if (!verifier) {
                return handleError("Invalid verifier response received.");
            }

            setVerifierData(verifier);
            if (!verifier.trusted) {
                setShowTrustVerifier(true);
            } else {
                console.log("✅ Verifier already trusted:", verifier.name);
                setShowTrustVerifier(false);
            }
        } catch (err) {
            handleError("Failed to validate verifier request.", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Add trusted verifier
    const addTrustedVerifier = async () => {
        if (!verifierData?.id) return;

        try {
            setIsLoading(true);
            const response = await addTrustedVerifierApi.fetchData({
                apiConfig: api.addTrustedVerifier,
                body: { verifierId: verifierData.id },
            });

            if (!response.ok()) {
                return handleError("Failed to add verifier to trusted list.", response.error);
            }

            console.log("✅ Verifier added to trusted list:", response);
            setShowTrustVerifier(false);
        } catch (err) {
            handleError("Failed to add verifier to trusted list.", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Initial API call
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
                onNotTrust={() => {
                    console.log("🚫 User did NOT trust verifier:", verifierData);
                    setShowTrustVerifier(false);
                    setIsCancelConfirmation(true);
                }}
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
                onConfirm={() => setIsCancelConfirmation(false)}
                onClose={() => {
                    setIsCancelConfirmation(false);
                    setShowTrustVerifier(true);
                }}
            />
        </div>
    );
};
