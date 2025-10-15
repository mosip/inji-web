import React from "react";
import { ModalWrapper } from "./ModalWrapper";
import { LoaderModalStyles } from "./LoaderModalStyles";
import { SpinningLoader } from "../components/Common/SpinningLoader";



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
                        <SpinningLoader></SpinningLoader>
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
