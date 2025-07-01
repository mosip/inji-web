import React from "react";
import {SpinningLoader} from "../Common/SpinningLoader";
import {ErrorSheildIcon} from "../Common/ErrorSheildIcon";
import {SuccessSheildIcon} from "../Common/SuccessSheildIcon";
import {LandingPageWrapper} from "../Common/LandingPageWrapper";
import {useUser} from "../../hooks/User/useUser";
import {DownloadResultStyles} from "./DownloadResultStyles";
import {RequestStatus} from "../../utils/constants";

interface DisplayConfig {
    icon: JSX.Element;
    gotoHome: boolean;
}

interface DownloadResultProps {
    state: RequestStatus;
    title: string;
    subTitle?: string;
}

export const DownloadResult: React.FC<DownloadResultProps> = ({title, subTitle, state}) => {
    const {isUserLoggedIn} = useUser();

    const displayConfig: Record<RequestStatus, DisplayConfig> = {
        [RequestStatus.DONE]: {
            icon: <SuccessSheildIcon/>,
            gotoHome: true,
        },
        [RequestStatus.ERROR]: {
            icon: <ErrorSheildIcon/>,
            gotoHome: true,
        },
        [RequestStatus.LOADING]: {
            icon: <SpinningLoader/>,
            gotoHome: false,
        },
    };

    const currentConfig = displayConfig[state];

    const baseWrapperProps = {
        icon: currentConfig.icon,
        title: title,
        subTitle: subTitle,
        gotoHome: currentConfig.gotoHome,
    };

    return (
        isUserLoggedIn() ? (
            <div
                data-testid="download-result-container"
                className={DownloadResultStyles.container}>
                <LandingPageWrapper{...baseWrapperProps}/>
            </div>
        ) : (
            <LandingPageWrapper{...baseWrapperProps}/>
        )
    );
};