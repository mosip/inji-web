import React, { useEffect, useRef, useState } from "react";
import {useTranslation} from 'react-i18next';
import { useApi } from "../hooks/useApi";
import { api } from "../utils/api";
import { LoaderModal } from "../modals/LoadingModal";
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
    const {t} = useTranslation("ShareHandlerLoadingModal");
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
        if (returnUrl) window.location.href = returnUrl;
        else if (onClose) onClose();
    };

    if (showErrorCard) {
        return (
            <ErrorCard
                isOpen={true}
                title="Error"
                description={errorCardMessage}
                onClose={handleCloseErrorCard}
                testId="modal-error-card"
            />
        );
    }

    if (isLoading) {
        return <LoaderModal
            isOpen={true}
            message={t("message")}
            size="xl-loading"
            testId="modal-loader-card"
        />;
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