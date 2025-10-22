import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalWrapper } from "./ModalWrapper";
import { ModalStyles } from "./ModalStyles";
import { CredentialShareSuccessModalProps } from "../types/components";
import { RedirectionButton } from "../components/Common/Buttons/RedirectionButton";
import { SharedCredentialListWrapper } from "../components/Credentials/SharedCredentialListWrapper";
import { useTranslation } from "react-i18next";
import {SuccessIcon} from "../components/Common/Icons/SuccessIcon";

export const CredentialShareSuccessModal: React.FC<CredentialShareSuccessModalProps> = (props) => {
    const { t } = useTranslation("CredentialShareSuccessModal");
    const navigate = useNavigate();
    const [count, setCount] = useState(props.countdownStart ?? 5);

    // Countdown timer
    useEffect(() => {
        if (!props.isOpen) return;

        setCount(props.countdownStart ?? 5);
        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev > 1) {
                    return prev - 1;
                }
                return 0;
            });
        }, 1000);

        // Handle navigation when countdown reaches 0
        const navigationTimer = setTimeout(() => {
            if (props.returnUrl) {
                navigate(props.returnUrl);
            }
        }, (props.countdownStart ?? 5) * 1000);

        return () => {
            clearInterval(timer);
            clearTimeout(navigationTimer);
        };
    }, [props.isOpen, props.countdownStart, navigate]);

    if (!props.isOpen) return null;

    return (
        <ModalWrapper
            zIndex={50}
            size="sm"
            header={<></>}
            footer={<></>}
            content={
                <div
                    id="card-share-success"
                    className={`${ModalStyles.credentialShareSuccessModal.container} overflow-y-auto max-h-[90vh]`}
                >
                    <div
                        id="icon-success"
                        className={`${ModalStyles.credentialShareSuccessModal.iconWrapper} flex flex-col items-center gap-4 mt-6`}
                    >
                        <SuccessIcon />

                        <h2 className={ModalStyles.credentialShareSuccessModal.title}>
                            {t("sharedWith", { verifierName: props.verifierName })}
                        </h2>

                        <p className={ModalStyles.credentialShareSuccessModal.message}>
                            {t("credentialsPresented", { verifierName: props.verifierName })}
                        </p>
                    </div>

                    <div className="flex justify-center w-full">
                        <SharedCredentialListWrapper credentials={props.credentials} />
                    </div>

                    <div className="flex flex-col items-center gap-2 mt-4 sm:mt-6 w-full">
                        <RedirectionButton
                            testId="btn-return-to-verifier"
                            onClick={() => {
                                if (props.returnUrl) navigate(props.returnUrl);
                            }}
                        >
                            <span id="text-return-timer">{t("redirectMessage", { count })}</span>
                        </RedirectionButton>
                    </div>
                </div>
            }
        />
    );
};