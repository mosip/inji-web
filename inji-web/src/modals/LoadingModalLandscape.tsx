import React from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper } from "./ModalWrapper";
import { ModalStyles } from "./ModalStyles";
import { SpinningLoader } from "../components/Common/SpinningLoader";

type LoadingModalLandscapeProps = {
    isOpen: boolean;
};

export const LoadingModalLandscape: React.FC<LoadingModalLandscapeProps> = ({ isOpen }) => {
    const { t } = useTranslation("LoadingModalLandscape");

    if (!isOpen) return null;

    return (
        <ModalWrapper
            header={null}
            footer={null}
            size="3xl"
            zIndex={50}
            content={
                <div
                    id="card-loading-container"
                    className={`${ModalStyles.loadingModalLandscape.container} flex items-center justify-center`}
                >
                    <div className={ModalStyles.loadingModalLandscape.contentWrapper}>
                        <div
                            id="spinner-loading"
                            className={ModalStyles.loadingModalLandscape.spinnerWrapper}
                        >
                            <SpinningLoader />
                        </div>
                        <div
                            id="text-loading-message"
                            className={ModalStyles.loadingModalLandscape.message}
                        >
                            {t("message")}
                        </div>
                    </div>
                </div>
            }
        />
    );
};