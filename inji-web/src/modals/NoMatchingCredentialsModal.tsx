import React from "react";
import { ModalWrapper } from "./ModalWrapper";
import ErrorMessageIcon from "../assets/error_message.svg";
import { useTranslation } from "react-i18next";
import { SolidButton } from "../components/Common/Buttons/SolidButton";
import { ErrorCardStyles } from "./ErrorCardStyles";
import { useApi } from "../hooks/useApi";
import { api } from "../utils/api";
import { withErrorHandling } from "../utils/errorHandling";

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
    
    if (!isVisible) return null;

    const title = t("title");
    const description = t("description");
    const goToHomeButtonText = t("goToHomeButton");

    const handleGoToHome = async () => {
        if (presentationId) {
            const { error } = await withErrorHandling(
                async () => {
                    const rejectPayload = {
                        errorCode: "access_denied",
                        errorMessage: "User denied authorization to share credentials"
                    };
                    
                    await rejectVerifier({
                        url: api.userRejectVerifier.url(presentationId),
                        apiConfig: api.userRejectVerifier,
                        body: rejectPayload
                    });
                },
                { 
                    context: 'handleGoToHome',
                    logError: true,
                    showToUser: false
                }
            );
            
            // If rejection failed, don't redirect - stay on error screen
            if (error) {
                console.error('Failed to reject verifier:', error);
                return;
            }
        }
        
        // Redirect to verifier's redirectUri if available, otherwise call onGoToHome
        if (redirectUri) {
            window.location.href = redirectUri;
        } else if (onGoToHome) {
            onGoToHome();
        }
    };

    const styles = ErrorCardStyles.errorCard;

    return (
        <div data-testid="card-no-matching-credentials-modal" className="w-full max-w-[400px] min-h-[350px] transition-all duration-300 ease-in-out max-[533px]:w-screen max-[533px]:left-0 max-[533px]:right-0 max-[533px]:z-[60] !max-w-[400px]">
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
                                className={styles.closeButton}
                            />
                        </div>
                    </div>
                }
            />
        </div>
    );
};
