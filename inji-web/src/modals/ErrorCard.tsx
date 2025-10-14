import React from "react";
import { ModalWrapper } from "../modals/ModalWrapper";
import ErrorMessageIcon from "../assets/error_message.svg";
import { useTranslation } from "react-i18next";
import { SolidButton } from "../components/Common/Buttons/SolidButton";

interface ErrorCardProps {
    title?: string;
    description?: string;
    onClose: () => void; 
    isOpen: boolean;
}

export const ErrorCardStyles = {
    errorCard: {
        wrapper: "flex flex-col items-center justify-center py-8 px-6 text-center",
        iconContainer: "w-108 h-108 flex items-center justify-center mb-2",
        iconImage: "w-[108px] h-[108px]",
    
        title: "text-xl font-semibold text-gray-800 mb-4",
        description: "text-gray-500 mb-8",
        
        buttonContainer: "w-full flex justify-center",
        closeButton: `
            max-w-md !bg-gradient-to-r from-red-500 to-purple-600 
            !py-3 !rounded-md !font-medium !text-white hover:opacity-90 focus:outline-none
        `
    }
};

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
                        />
                    </div>

                    <h2 className={styles.title}>
                        {finalTitle}
                    </h2>
                    <p className={styles.description}>{finalDescription}</p>
                    <div className={styles.buttonContainer}>
                        <SolidButton
                            testId="close-btn"
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
