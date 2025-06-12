import React from "react";
import {Modal} from "./Modal";
import {SolidButton} from "../components/Common/Buttons/SolidButton";
import {BorderedButton} from "../components/Common/Buttons/BorderedButton";
import {ModalStyles} from "./ModalStyles";
import {useTranslation} from "react-i18next";

export const ConfirmationModal = (props: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    testId: string;
}) => {
    const {t} = useTranslation('Common')

    return (
        <Modal
            isOpen={true}
            onClose={props.onCancel}
            size="md"
            testId={`${props.testId}-confirmation`}
        >
            <div className={ModalStyles.confirmation.container}>
                            <span data-testid={`title-${props.testId}`} className={ModalStyles.confirmation.title}>
                                {props.title}
                            </span>
                <div className={ModalStyles.confirmation.message}>
                    <p>{props.message}</p>
                </div>
                <div className={ModalStyles.confirmation.buttonsContainer}>
                    <BorderedButton
                        testId={"btn-cancel"}
                        onClick={props.onCancel}
                        title={t('cancel')}
                        fullWidth
                        className={ModalStyles.confirmation.cancelButton}
                    />
                    <SolidButton
                        testId={"btn-confirm"}
                        onClick={props.onConfirm}
                        title={t('confirm')}
                        fullWidth
                    />
                </div>
            </div>
        </Modal>
    );
}