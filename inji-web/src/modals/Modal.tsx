import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {BackArrowButton} from "../components/Common/Buttons/BackArrowButton";
import {PageTitle} from "../components/Common/PageTitle/PageTitle";
import {Clickable} from "../components/Common/Clickable";
import {Separator} from "../components/Common/Separator";
import {CloseIconButton} from "../components/Common/Buttons/CloseIconButton";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

/**
 * Modal component that renders a dialog box with a backdrop.
 * Features:
 * 1. Renders provided title with back arrow and on close as header
 *    Renders the provided children
 *    If action is provided
 *      - action is sticky floatable for large screens
 *      - container block for smaller screens
 * 2. Serves a responsive modal which can be used to wrap any content as per need
 */
export const Modal: React.FC<ModalProps> = ({isOpen, onClose, children, action, title, size}) => {
    if (!isOpen) return null;

    const modalSize = size ? `min-h-${size}` : "h-[83vh] w-[90vw] sm:w-[70vw] sm:h-[80vh]"

    return ReactDOM.createPortal(
        <Clickable
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
            testId={"modal-overlay"}
        >
            <dialog
                className={`bg-white rounded-lg shadow-lg mx-4 my-2  mt-10 flex flex-col relative pt-6 border-4 border-white ${modalSize}`}
                aria-modal="true"
                open
                onClose={onClose}
                onCancel={onClose}
            >
                {
                    title && (
                        <Fragment>
                            <div className="mb-4 flex items-center justify-between px-6 flex-shrink-0 gap-4">
                                <BackArrowButton onClick={onClose}/>
                                <PageTitle value={title} testId={"title-modal"}/>
                                <CloseIconButton
                                    onClick={onClose}
                                    btnClassName="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                />
                            </div>
                            <Separator className="flex-shrink-0"/>
                        </Fragment>
                    )
                }


                <div className="flex flex-col flex-1 relative sm:bg-transparent bg-white sm:mb-4 pb-0 min-h-0">
                    <div
                        className="overflow-y-auto flex-1 min-h-0 sm:mx-5 sm:m-0 m-2 sm:bg-transparent bg-white sm:rounded-none rounded-xl">
                        {children}
                    </div>

                    {action && (
                        <div
                            className="
          sm:absolute sm:right-6 sm:bottom-0 sm:mr-10 sm:pb-8 sm:bg-transparent sm:w-auto
          static bg-white flex px-2 w-full py-2 sm:rounded-b-lg
        "
                        >
                            {action}
                        </div>
                    )}
                </div>
            </dialog>

        </Clickable>,
        document.body
    );
};
