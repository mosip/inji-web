import React from "react";
import {toast, ToastOptions} from "react-toastify";

type ToastType = "info" | "success" | "warning" | "error" | "default";

interface ToastWrapperProps {
    message: string;
    type?: ToastType;
    testId?: string;
    options?: ToastOptions;
}

const ToastContent: React.FC<{ message: string; testId?: string }> = ({message, testId}) => (
    <div data-testid={testId}>{message}</div>
);

export const showToast = ({message, type = "default", testId, options}: ToastWrapperProps) => {
    const content = <ToastContent message={message} testId={`toast-${type}-${testId}`}/>;

    switch (type) {
        case "success":
            toast.success(content, options);
            break;
        case "error":
            toast.error(content, options);
            break;
        case "warning":
            toast.warning(content, options);
            break;
        case "info":
            toast.info(content, options);
            break;
        default:
            toast(content, options);
            break;
    }
};
