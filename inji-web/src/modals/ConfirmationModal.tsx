import React from "react";
import {Modal} from "./Modal";
import {SolidButton} from "../components/Common/Buttons/SolidButton";
import {BorderedButton} from "../components/Common/Buttons/BorderedButton";
import {ModalStyles} from "./ModalStyles";
import {useTranslation} from "react-i18next";

/**
 * Features
 * - Displays confirmation modal with cancel and confirm buttons
 * - consumers pass
 *         -> onCancel - method to close the modal and cancel the flow
 *         -> onConfirm - method to proceed the flow
 */
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
            testId={`modal-confirm-${props.testId}`}
        >
            <div className={ModalStyles.confirmation.container}>
                            <span data-testid={`title-${props.testId}`} className={ModalStyles.confirmation.title}>
                                {props.title}
                            </span>
                <div className={ModalStyles.confirmation.message} data-testid={`sub-title-${props.testId}`}>
                    <p>{props.message}</p>
                </div>
                <div className={ModalStyles.confirmation.buttonsContainer}>
                    <BorderedButton
                        testId={"btn-cancel"}
                        onClick={(event: React.MouseEvent) =>{
                            event.stopPropagation()
                            props.onCancel()
                        }}
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