import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";
import { isRTL } from "../../utils/i18n";

export const AppToaster: React.FC = () => {
    const language = useSelector((state: RootState) => state.common.language);
    const positionClass = isRTL(language) ? "top-left" : "top-right";

    React.useEffect(() => {
        toast("AppToaster test message");
    }, []);

    return (
        <div className={`text-center pt-20 pb-10 ${positionClass}`} data-testid="Apptoaster-outer-container">
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
