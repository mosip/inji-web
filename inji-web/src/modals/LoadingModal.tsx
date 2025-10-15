import React from "react";
import { ColorRing } from "react-loader-spinner";
import { ModalWrapper } from "./ModalWrapper";

export const LoaderModalStyles = {
    loaderModal: {
        wrapper: "flex flex-col items-center justify-center py-[6rem] px-[3rem] md:py-[18rem] md:px-[6rem] text-center",
        spinnerContainer: "mb-6",
        title: "text-lg font-semibold text-gray-900",
        subtitle: "text-gray-600 text-sm mt-2"
    }
};


interface LoaderModalProps {
    isOpen: boolean;
    title: string;
    subtitle: string;
}

export const LoaderModal: React.FC<LoaderModalProps> = ({
    isOpen,
    title,
    subtitle,
}) => {
    if (!isOpen) return null;
    // const staticRed = 'var(--iw-color-red)'
    const staticRed = '#D64246';


    const styles = LoaderModalStyles.loaderModal;

    return (
        <ModalWrapper
            zIndex={50}
            size="xl"
            header={<></>}
            footer={<></>}
            content={

                <div className={styles.wrapper}>

                    <div className={styles.spinnerContainer}>
                        <ColorRing
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="loading-indicator"
                            colors={[staticRed, staticRed, staticRed, staticRed, staticRed]}
                            data-testid="loader-color-ring"
                        />
                    </div>

                    <h2 data-testid="title-loader-modal" className={styles.title}>
                        {title}
                    </h2>

                    <p data-testid="text-loader-modal-subtitle" className={styles.subtitle}>
                        {subtitle}
                    </p>
                </div>
            }
        />
    );
};
