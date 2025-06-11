import React from 'react';
import ReactDOM from 'react-dom';
import {BackArrowButton} from "../components/Common/Buttons/BackArrowButton";
import {PageTitle} from "../components/Common/PageTitle/PageTitle";
import {Clickable} from "../components/Common/Clickable";
import {Separator} from "../components/Common/Separator";
import {CloseIconButton} from "../components/Common/Buttons/CloseIconButton.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

//TODO: Can we use modal wrapper here?
export const Modal: React.FC<ModalProps> = ({isOpen, onClose, children, action, title}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        onClose()
    };

    return ReactDOM.createPortal(
        <Clickable
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <div
                className="
          bg-white rounded-lg shadow-lg w-full mx-4 my-2 h-[83vh] mt-10
          sm:w-[70vw] sm:h-[80vh]
          flex flex-col
           relative
           pt-6
        "
                role="dialog"
                aria-modal="true"
                style={{
                    backgroundColor: "#F9FAFB"
                }}
                onClick={(e) => e.stopPropagation()} // prevent modal box clicks from closing
            >
                <div className="mb-4 flex items-center justify-between px-6">
                    <BackArrowButton onClick={onClose}/>
                    {title && <PageTitle value={title} testId={"title-modal"}/>}
                    <CloseIconButton onClick={onClose}
                                     btnClassName={"text-gray-500 hover:text-gray-700 text-2xl font-bold"}/>
                </div>
                <Separator className={"-p-6"}/>

                <div className={"flex-1 overflow-y-auto mb-4"}>
                    <div className={"overflow-y-auto flex-1"}>
                        {children}
                    </div>
                    {action && (
                        <div
                            className="absolute right-6 bottom-0 mr-10 pb-10"
                        >
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </Clickable>,
        document.body
    );
};
