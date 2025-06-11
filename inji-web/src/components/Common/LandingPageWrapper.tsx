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
            classNames: {
                outerContainer: "flex flex-col justify-center items-center",
                titleContainer: "mt-5",
                subTitleContainer: "my-3 px-8 text-center",
            },
        }
        : {
            navUrl: ROUTES.ROOT,
            classNames: {
                outerContainer: "flex flex-col justify-center items-center pt-32",
                titleContainer: "my-4",
                subTitleContainer: "mb-6 px-10 text-center",
            },
        };

    const {navUrl = wrapperConfig.navUrl} = props;

    return (
        <div data-testid="outer-container-download-result" className={wrapperConfig.classNames.outerContainer}>
            {props.icon}
            <div className={wrapperConfig.classNames.titleContainer} data-testid="title-container-download-result">
                <p className="font-bold" data-testid="title-download-result">
                    {props.title}
                </p>
            </div>
            {props.subTitle &&
                <div className={wrapperConfig.classNames.subTitleContainer}
                     data-testid="subtitle-container-download-result">
                    <p data-testid="subtitle-download-result">{props.subTitle}</p>
                </div>
            }
            {props.gotoHome && (
                <BorderedButton
                    testId="btn-home-download-result"
                    onClick={() => navigate(navUrl)}
                    title={t("navigateButton")}
                />
            )}
        </div>
    );
};