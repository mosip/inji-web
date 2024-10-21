import React from "react";
import { ToastContainer} from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";
import { isRTL } from "../../utils/i18n";

export const AppToaster: React.FC = () => {
    const language = useSelector((state: RootState) => state.common.language);
    return (
        <div data-testid="Apptoaster-outer-container">
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
