import React from "react";
import {ToastContainer} from "react-toastify";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/redux";
import {isRTL} from "../../../utils/i18n";
import WarningIcon from '../../../assets/warning-icon.svg';
import ErrorIcon from '../../../assets/error-icon.svg';
import InfoIcon from '../../../assets/info-icon.svg';
import SuccessIcon from '../../../assets/success-icon.svg';

const TOAST_ICONS = {
  warning: { src: WarningIcon, alt: 'Warning' },
  success: { src: SuccessIcon, alt: 'Success' },
  error: { src: ErrorIcon, alt: 'Error' },
  info: { src: InfoIcon, alt: 'Info' },
} as const;

const APP_TOASTER_STYLES = 'w-[30px] h-[30px]';

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
                    const icon = type && TOAST_ICONS[type as keyof typeof TOAST_ICONS];
                    return icon ? (
                        <img src={icon.src} alt={icon.alt} className={APP_TOASTER_STYLES} />
                    ) : null;
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
