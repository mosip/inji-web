import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {BorderedButton} from "./Buttons/BorderedButton";
import {RouteValue} from "../../types/data";
import {ROUTES} from "../../utils/constants";
import {useUser} from "../../hooks/useUser";

interface LandingPageWrapperProps {
    icon: React.ReactNode;
    title: string;
    subTitle?: string;
    gotoHome: boolean;
    navUrl?: RouteValue;
};

export const LandingPageWrapper: React.FC<LandingPageWrapperProps> = (props) => {
    const navigate = useNavigate();
    const {t} = useTranslation("RedirectionPage");
    const {isUserLoggedIn} = useUser();
    const wrapperConfig = isUserLoggedIn
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
                titleContainer: "DownloadResult-Title-Container",
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

    const {navUrl = wrapperConfig.navUrl} = props;

    return (
        <div data-testid={wrapperConfig.testIds.outerContainer} className={wrapperConfig.classNames.outerContainer}>
            {props.icon}
            <div className={wrapperConfig.classNames.titleContainer} data-testid={wrapperConfig.testIds.titleContainer}>
                <p className={wrapperConfig.classNames.title} data-testid={wrapperConfig.testIds.title}>
                    {props.title}
                </p>
            </div>
            {props.subTitle &&
                <div className={wrapperConfig.classNames.subTitleContainer} data-testid={wrapperConfig.testIds.subTitleContainer}>
                    <p data-testid={wrapperConfig.testIds.subTitle}>{props.subTitle}</p>
                </div>
            }
            {props.gotoHome && (
                <BorderedButton
                    testId={wrapperConfig.testIds.homeButton}
                    onClick={() => navigate(navUrl)}
                    title={t("navigateButton")}
                />
            )}
        </div>
    );
};