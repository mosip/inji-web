import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";
import { isRTL } from "../../utils/i18n";

const CustomToast = ({ message }: { message: string }) => (
    <div data-testid="custom-toast">{message}</div>
);

export const AppToaster: React.FC = () => {
    const language = useSelector((state: RootState) => state.common.language);
    const positionClass = isRTL(language) ? "top-left" : "top-right";

    // Example of triggering a toast
    React.useEffect(() => {
        toast(<CustomToast message="Test message" />);
    }, []);

    return (
        <div className={`toast-container ${positionClass}`} data-testid="toast-container">
            <ToastContainer
                position={isRTL(language) ? "top-left" : "top-right"}
                autoClose={1000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={isRTL(language)}
                icon={<React.Fragment />}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ width: '400px' }}
                theme="colored"
            />
        </div>
    );
};
