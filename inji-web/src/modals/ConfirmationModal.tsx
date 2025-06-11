import React from "react";
import {Modal} from "./Modal";
import {SolidButton} from "../components/Common/Buttons/SolidButton";
import {BorderedButton} from "../components/Common/Buttons/BorderedButton";

export const ConfirmationModal = (props: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    testId: string;
}) => {

    return (
        <Modal
            isOpen={true}
            onClose={props.onCancel}
            size="md"
        >
            <div className={"flex flex-col items-center pt-4 pb-4 px-8 gap-3"}>
                <span data-testid={`title-${props.testId}`} className={"text-2xl justify-center font-medium text-center text-[--iw-color-textTertiary]"}>
                {props.title}
            </span>
                <div className="text-[--iw-color-textTertiary] font-base font-light text-sm">
                    <p>{props.message}</p>
                </div>
                <div className="flex items-center justify-around sm:flex-row flex-col gap-4 w-full pt-3">
                    <BorderedButton testId={"btn-cancel"} onClick={props.onCancel} title={"Cancel"} fullWidth className={"py-2"}/>
                    <SolidButton testId={"btn-confirm"} onClick={props.onConfirm} title={"Confirm"} fullWidth/>
                </div>
            </div>
        </Modal>
    );
}