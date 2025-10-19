import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { ModalStyles } from "./ModalStyles";
import { CredentialShareSuccessModalProps } from "../types/components";
import { RedirectionButton } from "../components/Common/Buttons/RedirectionButton";
import { SharedCredentialListWrapper } from "../components/Credentials/SharedCredentialListWrapper";
import { useTranslation } from "react-i18next";
import {SuccessIcon} from "../components/Common/Icons/SuccessIcon";

export const CredentialShareSuccessModal: React.FC<CredentialShareSuccessModalProps> = (props) => {
    const { t } = useTranslation("CredentialShareSuccessModal");
    const [count, setCount] = useState(props.countdownStart ?? 5);

    // Countdown timer
    useEffect(() => {
        if (!props.isOpen) return;

        setCount(props.countdownStart ?? 5);
        const timer = setInterval(() => {
            setCount(prev => {
                if (prev > 1) {
                    return prev - 1;
                }
                clearInterval(timer);
                if (props.returnUrl) {
                    window.location.href = props.returnUrl;
                }
                return 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [props.isOpen, props.countdownStart, props.returnUrl]);

    if (!props.isOpen) return null;

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose ?? (() => {})}
            size="sm"
            testId="card-share-success"
        >
            <div
                id="card-share-success"
                className={ModalStyles.credentialShareSuccessModal.container}
            >
                <div
                    id="icon-success"
                    className={`${ModalStyles.credentialShareSuccessModal.iconWrapper} flex flex-col items-center gap-4`}
                >
                    <SuccessIcon />

                    <h2
                        id="title-shared-with"
                        className={ModalStyles.credentialShareSuccessModal.title}
                    >
                        {t("sharedWith", { verifierName: props.verifierName })}
                    </h2>

                    <p
                        id="text-credentials-presented"
                        className={ModalStyles.credentialShareSuccessModal.message}
                    >
                        {t("credentialsPresented", { verifierName: props.verifierName })}
                    </p>
                </div>

                <SharedCredentialListWrapper credentials={props.credentials} />

                <div className="flex flex-col items-center gap-2 mt-4 sm:mt-6 w-full">
                    <RedirectionButton
                        testId="btn-return-to-verifier"
                        onClick={() => {
                            if (props.returnUrl) {
                                window.location.href = props.returnUrl;
                            }
                        }}
                    >
                        <span id="text-return-timer">
                            {t("redirectMessage", { count })}
                        </span>
                    </RedirectionButton>
                </div>
            </div>
        </Modal>
    );
};