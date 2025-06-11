import React from "react";
import {RequestStatus} from "../../hooks/useFetch";
import {SpinningLoader} from "../Common/SpinningLoader";
import {ErrorSheildIcon} from "../Common/ErrorSheildIcon";
import {SuccessSheildIcon} from "../Common/SuccessSheildIcon";
import {LandingPageWrapper} from "../Common/LandingPageWrapper";
import {useUser} from "../../hooks/useUser";
import {DownloadResultStyles} from "./DownloadResultStyles";

interface StateConfig {
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

    const stateConfig: Record<RequestStatus, StateConfig> = {
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

    const currentConfig = stateConfig[state];

    const baseWrapperProps = {
        icon: currentConfig.icon,
        title: title,
        subTitle: subTitle,
        gotoHome: currentConfig.gotoHome,
    };


    return (
        isUserLoggedIn ? (
            <div
                className={DownloadResultStyles.container}>
                <LandingPageWrapper{...baseWrapperProps}/>
            </div>
        ) : (
            <LandingPageWrapper{...baseWrapperProps}/>
        )
    );
};