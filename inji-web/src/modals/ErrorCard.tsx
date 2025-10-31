import React from "react";
import { ModalWrapper } from "./ModalWrapper";
import ErrorMessageIcon from "../assets/error_message.svg";
import { useTranslation } from "react-i18next";
import { SolidButton } from "../components/Common/Buttons/SolidButton";
import { ErrorCardStyles } from "./ErrorCardStyles";


interface ErrorCardProps {
    title?: string;
    description?: string;
    isOpen: boolean;
    testId: string;

    onClose?: () => void;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
    title,
    description,
    onClose,
    isOpen,
    testId,
    onRetry,
    isRetrying = false
}) => {
    const { t } = useTranslation("VerifierTrustPage");
    if (!isOpen) return null;

    const isRetryable = !!onRetry;

    const ERROR_KEY_PREFIX = "ErrorCard";
    const RETRY_KEY_PREFIX = "RetryCard";

    const finalTitle = title || t(`${ERROR_KEY_PREFIX}.defaultTitle`);
    const retryDescriptionText = description || t(`${RETRY_KEY_PREFIX}.defaultDescription`);
    const errorDescriptionText = description || t(`${ERROR_KEY_PREFIX}.defaultDescription`);

    const finalDescription = isRetryable ? retryDescriptionText : errorDescriptionText;

    const buttonText = isRetryable ? t(`${RETRY_KEY_PREFIX}.retryButton`) : t(`${ERROR_KEY_PREFIX}.closeButton`);
    const buttonAction = isRetryable ? onRetry : onClose;

    const styles = ErrorCardStyles.errorCard;

    return (
        <div>
            <ModalWrapper
                zIndex={50}
                size="xl"
                header={<></>}
                footer={<></>}
                content={
                    <div data-testid={testId} className={styles.wrapper}>
                        <div className={styles.iconContainer}>
                            <img
                                src={ErrorMessageIcon}
                                alt="Error Icon"
                                className={styles.iconImage}
                                data-testid="img-error-card-icon"
                            />
                        </div>

                        <h2 id="title-error-card" className={styles.title}>
                            {finalTitle}
                        </h2>
                        <p data-testid="text-error-card-description" className={styles.description}>{finalDescription}</p>
                        <div className={styles.buttonContainer}>
                            {buttonAction && (
                                <SolidButton
                                    testId={isRetryable ? "btn-retry-card-retry" : "btn-error-card-close"}
                                    onClick={buttonAction}
                                    title={buttonText}
                                    fullWidth
                                    className={styles.closeButton}
                                    disabled={isRetryable ? isRetrying : false}
                                />
                            )}
                        </div>
                    </div>
                }
            />
        </div>
    );
};