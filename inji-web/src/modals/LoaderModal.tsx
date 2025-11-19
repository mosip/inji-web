import React from "react";
import { ModalWrapper } from "./ModalWrapper";
import { LoaderModalStyles } from "./LoaderModalStyles";
import { SpinningLoader } from "../components/Common/SpinningLoader";

interface LoaderModalProps {
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    message?: string;
    size?: "sm" | "md" | "lg" | "xl" | "xl-loading" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
    testId: string;
}

export const LoaderModal: React.FC<LoaderModalProps> = ({
    isOpen,
    title,
    subtitle,
    message,
    size = "4xl",
    testId,
}) => {
    if (!isOpen) return null;


    const styles = LoaderModalStyles.loaderModal;
    
    // Choose wrapper style based on size
    const wrapperClass = size === "xl" ? styles.wrapperXl : 
                        size === "xl-loading" ? styles.wrapperXl :
                        size === "4xl" ? styles.wrapper4xl : 
                        size === "6xl" ? styles.wrapper6xl : 
                        styles.wrapper4xl;

    return (
        <div className="transition-all duration-300 ease-in-out max-[533px]:w-screen max-[533px]:left-0 max-[533px]:right-0 max-[533px]:z-[60]">
            <ModalWrapper
                zIndex={50}
                size={size}
                header={<></>}
                footer={<></>}
                content={
                    <div data-testid={testId} className={wrapperClass}>
                        <div className={styles.spinnerContainer}>
                            <SpinningLoader></SpinningLoader>
                        </div>

                        <h2 data-testid="title-loader-modal" className={styles.title}>
                            {title}
                        </h2>

                        <p data-testid="text-loader-modal-subtitle" className={styles.subtitle}>
                            {subtitle}
                        </p>

                        <p data-testid="text-loader-modal-message" className={styles.message}>
                            {message}
                        </p>
                    </div>
                }
            />
        </div>
    );
};

