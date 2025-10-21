import React, { useEffect, useRef, useState } from "react";
import { useApi } from "../hooks/useApi";
import { api } from "../utils/api";
import { LoadingModalLandscape } from "../modals/LoadingModalLandscape";
import { ErrorCard } from "../modals/ErrorCard";
import { CredentialShareSuccessModal } from "../modals/CredentialShareSuccessModal";
import { PresentationCredential, CredentialShareSuccessModalProps } from "../types/components";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";

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
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const hasSubmittedRef = useRef<boolean>(false);

    const {
        showErrorCard,
        errorCardMessage,
        handleApiError,
        handleCloseErrorCard
    } = useApiErrorHandler(onClose);

    useEffect(() => {
        if (hasSubmittedRef.current) return;
        if (!selectedCredentials || selectedCredentials.length === 0 || !presentationId) return;

        const submitPresentation = async () => {
            hasSubmittedRef.current = true;
            setIsLoading(true);

            try {
                const response = await fetchData({
                    apiConfig: api.submitPresentation,
                    url: api.submitPresentation.url(presentationId),
                    body: {
                        selectedCredentials: selectedCredentials.map(c => c.credentialId)
                    }
                });

                if (response.ok()) {
                    setIsSuccess(true);
                } else {
                    const errorMessage = response.error?.message || 'Failed to submit presentation';
                    const error = response.error || new Error(errorMessage);
                    handleApiError(error, 'submitPresentation');
                    setIsSuccess(false);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                const error = err instanceof Error ? err : new Error(errorMessage);
                handleApiError(error, 'submitPresentation');
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        };

        void submitPresentation();
    }, [fetchData, presentationId, selectedCredentials, handleApiError]);

    const handleSuccessClose = () => {
        if (onClose) onClose();
        if (returnUrl) window.location.href = returnUrl;
    };

    if (showErrorCard) {
        return (
            <ErrorCard
                isOpen={true}
                title="Error"
                description={errorCardMessage}
                onClose={handleCloseErrorCard}
            />
        );
    }

    if (isLoading) {
        return <LoadingModalLandscape isOpen={true} />;
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