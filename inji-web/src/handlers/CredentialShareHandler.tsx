import React, {useEffect, useRef, useState} from "react";
import { useApi } from "../hooks/useApi";
import { api } from "../utils/api";
import { LoadingModalLandscape } from "../modals/LoadingModalLandscape";
import { ErrorCard } from "../modals/ErrorCard";
import { CredentialShareSuccessModal } from "../modals/CredentialShareSuccessModal";
import { PresentationCredential, CredentialShareSuccessModalProps } from "../types/components";
import { withErrorHandling } from "../utils/errorHandling";

interface CredentialShareHandlerProps {
    verifierName: string;
    returnUrl: string;
    selectedCredentials: PresentationCredential[];
    presentationId: string;
    onClose?: () => void;
}

export const CredentialShareHandler: React.FC<CredentialShareHandlerProps> = ({
                                                                                  verifierName,
                                                                                  returnUrl,
                                                                                  selectedCredentials,
                                                                                  presentationId,
                                                                                  onClose
                                                                              }) => {
    const { fetchData } = useApi();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const hasSubmittedRef = useRef<boolean>(false);

    useEffect(() => {
        if (hasSubmittedRef.current) return;
        if (!selectedCredentials || selectedCredentials.length === 0 || !presentationId) return;

        const submitPresentation = async () => {
            hasSubmittedRef.current = true;
            setIsLoading(true);
            setError(null);

            try {
                await withErrorHandling(
                    async () => {
                        const response = await fetchData({
                            apiConfig: api.submitPresentation,
                            url: api.submitPresentation.url(presentationId),
                            body: {
                                selectedCredentials: selectedCredentials.map(c => c.credentialId)
                            }
                        });

                        if (!response.ok()) {
                            const msg = response.error?.message || "Failed to submit presentation";
                            throw new Error(msg);
                        }

                        setIsSuccess(true);
                    },
                    {
                        context: "submitPresentation",
                        logError: true,
                        showToUser: false
                    }
                );
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Unexpected error occurred";
                setError(msg);
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        };

        void submitPresentation();
    }, [fetchData, presentationId, selectedCredentials]);

    const handleSuccessClose = () => {
        if (onClose) onClose();
        if (returnUrl) window.location.href = returnUrl;
    };

    if (isLoading) {
        return <LoadingModalLandscape isOpen={true} />;
    }

    if (error) {
        return (
            <ErrorCard
                isOpen={true}
                title="Error"
                description={error}
                onClose={() => {
                    setError(null);
                    if (onClose) onClose();
                    if (returnUrl) window.location.href = returnUrl;
                }}
            />
        );
    }

    if (isSuccess) {
        const successModalProps: CredentialShareSuccessModalProps = {
            isOpen: true,
            verifierName,
            credentials: selectedCredentials,
            returnUrl,
            onClose: handleSuccessClose
        };

        return <CredentialShareSuccessModal {...successModalProps} />;
    }

    return null;
};