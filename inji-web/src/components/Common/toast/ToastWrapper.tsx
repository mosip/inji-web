import React from "react";
import {toast, ToastContentProps, ToastOptions} from "react-toastify";
import {CloseButtonProps} from "react-toastify/dist/components";

type ToastType = "info" | "success" | "warning" | "error" | "default";

interface ToastWrapperProps {
    message: string;
    type?: ToastType;
    testId?: string;
    options?: ToastOptions;
}

const ToastContent: React.FC<{
    message: string;
    testId?: string,
    closeButton: boolean | ((props: CloseButtonProps) => React.ReactNode) | React.ReactElement<CloseButtonProps> | undefined,
    type: ToastType,
    dismissToast: () => void;
}> = ({message, testId, closeButton, type, dismissToast}) => {

    const renderCloseButton = () => {
        if (!closeButton) {
            return null;
        } else if (typeof closeButton === 'function') {
            return closeButton({
                closeToast: dismissToast,
                type: type,
                theme: ''
            });
        } else if (React.isValidElement(closeButton)) {
            return closeButton;
        }
        return null;
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }} data-testid={testId}>
            <span>{message}</span>
            {renderCloseButton()}
        </div>
    );
};

export const showToast = ({ message, type = "default", testId, options = {} }: ToastWrapperProps) => {
    let shouldShowDefaultCloseButton: ToastOptions["closeButton"] = true;
    let customCloseButton: ToastOptions["closeButton"] = true;

    // Determine if React-Toastify library default close button should be shown or not based on the presence of closeButton in options
    if (typeof options.closeButton === "function" || React.isValidElement(options.closeButton)) {
        shouldShowDefaultCloseButton = false;
        customCloseButton = options.closeButton;
    } else if (typeof options.closeButton === "boolean") {
        shouldShowDefaultCloseButton = options.closeButton;
        customCloseButton = false;
    }

    const content = ({ closeToast }: { closeToast: () => void }) => (
        <ToastContent
            message={message}
            testId={`toast-${type}-${testId}`}
            closeButton={customCloseButton}
            type={type}
            dismissToast={closeToast}
        />
    );

    const toastOptions: ToastOptions = {
        ...options,
        closeButton: shouldShowDefaultCloseButton,
    };

    const methodMap: Record<ToastType, (content: ((props: ToastContentProps<any>) => React.ReactNode), opts: ToastOptions) => void> = {
        success: toast.success,
        error: toast.error,
        warning: toast.warning,
        info: toast.info,
        default: toast,
    };

    methodMap[type](content, toastOptions);
};