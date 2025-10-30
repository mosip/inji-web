import React, { useCallback, useState } from "react";
import { ModalWrapper } from "./ModalWrapper";
import ErrorMessageIcon from "../assets/error_message.svg";
import { useTranslation } from "react-i18next";
import { SolidButton } from "../components/Common/Buttons/SolidButton";
import { ErrorCardStyles } from "./ErrorCardStyles";
import { useApi } from "../hooks/useApi";
import { api } from "../utils/api";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { ErrorCard } from "./ErrorCard";

interface NoMatchingCredentialsModalProps {
    isVisible: boolean;
    missingClaims?: string[];
    onGoToHome?: () => void;
    redirectUri?: string | null;
    presentationId?: string;
}

export const NoMatchingCredentialsModal: React.FC<NoMatchingCredentialsModalProps> = ({
    isVisible,
    missingClaims = [],
    onGoToHome,
    redirectUri,
    presentationId,
}) => {
    const { t } = useTranslation("NoMatchingCredentialsModal");
    const { fetchData: rejectVerifier } = useApi<{ success: boolean }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        showError,
        errorDescription,
        errorTitle,
        isRetrying,
        handleApiError,
        onClose: handleModalClose,
        onRetry
    } = useApiErrorHandler({ onClose: onGoToHome });

    const handleExit = useCallback(() => {
        if (redirectUri) {
            window.location.href = redirectUri;
        } else if (onGoToHome) {
            onGoToHome();
        }
    }, [redirectUri, onGoToHome]);

    const rejectVerifierCore = useCallback(async () => {
        const rejectPayload = {
            errorCode: "access_denied",
            errorMessage: "User denied authorization to share credentials"
        };

        const response = await rejectVerifier({
            url: api.userRejectVerifier.url(presentationId!),
            apiConfig: api.userRejectVerifier,
            body: rejectPayload
        });

        if (!response.ok()) {
            throw response.error || new Error("Failed to reject verifier");
        }
    }, [rejectVerifier, presentationId]);

    const handleGoToHome = useCallback(async () => {
        if (isSubmitting || isRetrying) {
            return;
        }
        setIsSubmitting(true);

        if (!presentationId) {
            handleExit();
            if (!redirectUri) setIsSubmitting(false);
            return;
        }

        try {
            await rejectVerifierCore();
            handleExit();
            if (!redirectUri) setIsSubmitting(false);
        } catch (err) {
            handleApiError( err, "rejectVerifier", rejectVerifierCore, handleExit );
            setIsSubmitting(false);
        }
    }, [isSubmitting, isRetrying, presentationId, rejectVerifierCore, handleExit, handleApiError, redirectUri]);

    if (!isVisible) return null;

    const title = t("title");
    const description = t("description");
    const goToHomeButtonText = t("goToHomeButton");
    const styles = ErrorCardStyles.errorCard;

    if (showError) {
        return (
            <ErrorCard
                isOpen={true}
                title={errorTitle}
                description={errorDescription}
                onClose={handleModalClose}
                onRetry={onRetry}
                isRetrying={isRetrying}
                testId="modal-error-handler-no-matching"
            />
        );
    }

    return (
        <div data-testid="card-no-matching-credentials-modal" className="w-full max-w-[400px] min-h-[350px] transition-all duration-300 ease-in-out max-[533px]:w-screen max-[533px]:fixed max-[533px]:inset-x-0 max-[533px]:z-[60]">
            <ModalWrapper
                zIndex={50}
                size="md"
                header={<></>}
                footer={<></>}
                content={
                    <div className={styles.wrapper}>
                        <div className={styles.iconContainer}>
                            <img
                                src={ErrorMessageIcon}
                                alt="Error Icon"
                                className={styles.iconImage}
                                data-testid="img-no-matching-credentials-icon"
                            />
                        </div>

                        <h2 id="title-no-matching-credentials" className={styles.title}>
                            {title}
                        </h2>
                        <p data-testid="text-no-matching-credentials-description" className={styles.description}>
                            {description}
                            {missingClaims.length > 0 && (
                                <span className="block mt-2 text-sm text-gray-600">
                                    Missing: {missingClaims.join(", ")}
                                </span>
                            )}
                        </p>
                        <div className={styles.buttonContainer}>
                            <SolidButton
                                testId="btn-go-to-home"
                                onClick={handleGoToHome}
                                title={goToHomeButtonText}
                                fullWidth
                                disabled={isSubmitting || isRetrying}
                                className={styles.closeButton}
                            />
                        </div>
                    </div>
                }
            />
        </div>
    );
};