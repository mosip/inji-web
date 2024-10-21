import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {BorderedButton} from "./BorderedButton";

export const LandingPageWrapper: React.FC<LandingPageWrapperProps> = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation("RedirectionPage");
    return (
        <div data-testid="DownloadResult-Outer-Container" className="flex flex-col justify-center items-center pt-32">
            {props.icon}
            <div className="my-4">
                <p className="font-bold" data-testid="DownloadResult-Title">{props.title}</p>
            </div>
            <div className="mb-6 px-10 text-center" data-testid="DownloadResult-SubTitle">
                <p>{props.subTitle}</p>
            </div>
            { props.gotoHome && <BorderedButton testId={"DownloadResult-Home-Button"} onClick={() => navigate("/")} title={t("navigateButton")} />}
        </div>
    );
};

export type LandingPageWrapperProps = {
    icon: React.ReactNode;
    title: string;
    subTitle: string;
    gotoHome: boolean;
};
