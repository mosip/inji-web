import React from "react";
import {ModalWrapper} from "./ModalWrapper";
import {Modal} from "./Modal";
import {SolidButton} from "../components/Common/Buttons/SolidButton.tsx";
import {PlainButton} from "../components/Common/Buttons/PlainButton.tsx";
import {BorderedButton} from "../components/Common/Buttons/BorderedButton.tsx";

export const ConfirmationModal = (props: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        props.onCancel();
    }

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        props.onConfirm();
    }


    return (
        <Modal
            isOpen={true}
            onClose={props.onCancel}
            title={props.title}
            action={
                <div className="flex justify-end space-x-4">
                    <BorderedButton testId={"btn-cancel"} onClick={handleCancel} title={"Cancel"}/>
                    <SolidButton testId={"btn-confirm"} onClick={handleConfirm} title={"Confirm"}/>
                </div>
            }
        >
            <div className="p-2">
                <p>{props.message}</p>
            </div>
        </Modal>
    );
}