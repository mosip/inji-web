import React from "react";
import {DownloadResultProps} from "../../types/components";
import {RequestStatus} from "../../hooks/useFetch";
import {SpinningLoader} from "../Common/SpinningLoader";
import {ErrorSheildIcon} from "../Common/ErrorSheildIcon";
import {SuccessSheildIcon} from "../Common/SuccessSheildIcon";
import {LandingPageWrapper} from "../Common/LandingPageWrapper";
import {ROUTES} from "../../utils/constants";
import {useUser} from "../../hooks/useUser";
import {DownloadResultStyles} from "./DownloadResultStyles";

interface StateConfig {
    icon: JSX.Element;
    gotoHome: boolean;
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

    const wrapperProps = isUserLoggedIn
        ? {
            navUrl: ROUTES.USER_HOME,
            testIds: {
                outerContainer: "container-outer",
                titleContainer: "title-container-download-result",
                title: "title-download-result",
                subTitleContainer: "subtitle-container-download-result",
                subTitle: "subtitle-download-result",
                homeButton: "btn-download-result-home",
            },
            classNames: {
                outerContainer: "flex flex-col justify-center items-center",
                titleContainer: "my-2",
                title: "font-bold",
                subTitleContainer: "mb-6 px-8 text-center",
            },
        }
        : {
            navUrl: ROUTES.ROOT,
            testIds: {
                outerContainer: "DownloadResult-Outer-Container",
                title: "DownloadResult-Title",
                subTitleContainer: "DownloadResult-SubTitle-Container",
                subTitle: "DownloadResult-SubTitle",
                homeButton: "DownloadResult-Home-Button",
            },
            classNames: {
                outerContainer: "flex flex-col justify-center items-center pt-32",
                titleContainer: "my-4",
                title: "font-bold",
                subTitleContainer: "mb-6 px-10 text-center",
            },
        };


    const landingPageWrapper = (
        <LandingPageWrapper
            icon={currentConfig.icon}
            title={title}
            subTitle={subTitle}
            gotoHome={currentConfig.gotoHome}
            navUrl={wrapperProps.navUrl}
            testIds={wrapperProps.testIds}
            classNames={wrapperProps.classNames}
        />
    );

    return (
        isUserLoggedIn ? (
            <div
                className={DownloadResultStyles.container}>
                {landingPageWrapper}
            </div>
        ) : (
            landingPageWrapper
        )
    );
};