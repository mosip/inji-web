import React from "react";
import { ModalWrapper } from "../modals/ModalWrapper";
import ErrorMessageIcon from "../assets/error_message.svg";
import { useTranslation } from "react-i18next";
import { SolidButton } from "../components/Common/Buttons/SolidButton";
import { ErrorCardStyles } from "./ErrorCardStyles";


interface ErrorCardProps {
    title?: string;
    description?: string;
    onClose: () => void; 
    isOpen: boolean;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
    title,
    description = "Something went wrong. Please try again.",
    onClose,
    isOpen,
}) => {
    const { t } = useTranslation("VerifierTrustPage");
    if (!isOpen) return null;


    const ERROR_KEY_PREFIX = "ErrorCard";

    const finalTitle = t(`${ERROR_KEY_PREFIX}.defaultTitle`);
    const finalDescription = t(`${ERROR_KEY_PREFIX}.defaultDescription`);
    const closeButtonText = t(`${ERROR_KEY_PREFIX}.closeButton`);

    const styles = ErrorCardStyles.errorCard;

    return (
        <ModalWrapper
            zIndex={50}
            size="xl"
            header={<></>}
            footer={<></>}
            content={
                <div className={styles.wrapper}>
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
                        <SolidButton
                            testId="btn-error-card-close"
                            onClick={onClose}
                            title={closeButtonText}
                            fullWidth
                            className={styles.closeButton}
                        />
                    </div>
                </div>
            }
        />
    );
};
