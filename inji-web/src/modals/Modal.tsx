import React from 'react';
import ReactDOM from 'react-dom';
import {BackArrowButton} from "../components/Common/Buttons/BackArrowButton.tsx";
import {PageTitle} from "../components/Common/PageTitle/PageTitle.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({isOpen, onClose, children, action, title}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (event : React.MouseEvent) => {
        event.stopPropagation()
        onClose()
    };

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <div
                className="
          bg-white rounded-lg shadow-lg
          w-[55vw] h-[70vh]
          flex flex-col
          p-6 relative
        "
                role="dialog"
                aria-modal="true"
                style={{
                    backgroundColor: "#F9FAFB"
                }}
                onClick={(e) => e.stopPropagation()} // prevent modal box clicks from closing
            >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <BackArrowButton onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onClose();
                    }}/>
                    {title && <PageTitle value={title} testId={"title-modal"}/>}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto mb-4">
                    {children}
                </div>

                {/* Action bar */}
                {action && (
                    <div className="bg-white border-t pt-4 pb-4 flex justify-center space-x-2 flex-shrink-0">
                        {action}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
