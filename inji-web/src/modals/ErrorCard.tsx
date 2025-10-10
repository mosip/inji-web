import React from "react";
import { ModalWrapper } from "../modals/ModalWrapper";
import { Clickable } from "../components/Common/Clickable";
import ErrorMessageIcon from "../assets/error_message_icon.svg";

interface ErrorCardProps {
    title?: string;
    description?: string;
    onClose: () => void; // 🔁 Changed from onRetry → onClose
    isOpen: boolean;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
    title = "Error",
    description = "Something went wrong. Please try again.",
    onClose,
    isOpen,
}) => {
    if (!isOpen) return null;

    return (
        <ModalWrapper
            zIndex={50}
            size="sm"
            header={<></>}
            footer={<></>}
            content={
                <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100 mb-5">
                        <img
                            src={ErrorMessageIcon}
                            alt="Error Icon"
                            className="w-10 h-10"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-500 mb-6">{description}</p>
                    <Clickable
                        testId="close-btn"
                        onClick={onClose}
                        className="w-full max-w-xs py-3 rounded-md font-medium text-white bg-gradient-to-r from-red-500 to-purple-600 hover:opacity-90 focus:outline-none"
                    >
                        Close
                    </Clickable>
                </div>
            }
        />
    );
};
