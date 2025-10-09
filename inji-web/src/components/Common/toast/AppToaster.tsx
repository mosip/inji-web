import React from "react";
import {ToastContainer} from "react-toastify";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/redux";
import {isRTL} from "../../../utils/i18n";
import WarningIcon from '../../../assets/warning-icon.svg';
import ErrorIcon from '../../../assets/error-icon.svg';
import InfoIcon from '../../../assets/info-icon.svg';
import SuccessIcon from '../../../assets/success-icon.svg';

export const AppToaster: React.FC = () => {
    const language = useSelector((state: RootState) => state.common.language);
    return (
        <div data-testid="Apptoaster-outer-container">
            <ToastContainer
                position={isRTL(language) ? "top-left" : "top-right"}
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={isRTL(language)}
                icon={({ type }) => {
                    switch (type) {
                        case "warning":
                            return (
                                <img
                                    src={WarningIcon}
                                    alt="Warning"
                                    className="w-[30px] h-[30px]"
                                />
                            );
                        case "success":
                            return (
                                <img
                                    src={SuccessIcon}
                                    alt="Success"
                                    className="w-[30px] h-[30px]"
                                />
                            );
                        case "error":
                            return (
                                <img
                                    src={ErrorIcon}
                                    alt="Error"
                                    className="w-[30px] h-[30px]"
                                />
                            );
                        case "info":
                            return (
                                <img
                                    src={InfoIcon}
                                    alt="Info"
                                    className="w-[30px] h-[30px]"
                                />
                            );
                        default:
                            return null;
                    }
                }}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                toastClassName={(context?: { type?: string }) =>
                    `inji-toast inji-toast--${context?.type ?? ""}`
                }
            />
        </div>
    );
};
