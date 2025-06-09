import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {BorderedButton} from "./Buttons/BorderedButton";
import {RouteValue} from "../../types/data";

type LandingPageWrapperProps = {
    icon: React.ReactNode;
    title: string;
    subTitle?: string;
    gotoHome: boolean;
    navUrl: RouteValue;
    testIds: {
        outerContainer: string;
        titleContainer?: string;
        title: string;
        subTitleContainer: string;
        subTitle?: string;
        homeButton: string;
    };
    classNames: {
        outerContainer: string;
        titleContainer: string;
        title: string;
        subTitleContainer: string;
        subTitle?: string;
    };
};

export const LandingPageWrapper: React.FC<LandingPageWrapperProps> = (props) => {
    const navigate = useNavigate();
    const {t} = useTranslation("RedirectionPage");
    const {testIds, classNames} = props;

    return (
        <div data-testid={testIds.outerContainer} className={classNames.outerContainer}>
            {props.icon}
            <div className={classNames.titleContainer} data-testid={testIds?.titleContainer}>
                <p className={classNames.title} data-testid={testIds.title}>
                    {props.title}
                </p>
            </div>
            {props.subTitle &&
                <div className={classNames.subTitleContainer} data-testid={testIds.subTitleContainer}>
                    <p className={classNames?.subTitle} data-testid={testIds?.subTitle}>{props.subTitle}</p>
                </div>
            }
            {props.gotoHome && (
                <BorderedButton
                    testId={testIds.homeButton}
                    onClick={() => navigate(props.navUrl)}
                    title={t("navigateButton")}
                />
            )}
        </div>
    );
};