import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const LandingPageWrapper: React.FC<LandingPageWrapperProps> = (props) => {
    const navigate = useNavigate();
    const {t} = useTranslation("RedirectionPage")
    return <div data-testid="DownloadResult-Outer-Container" className="flex flex-col justify-center items-center pt-32">
            {props.icon}
            <div className="my-4 ">
                <p className="font-bold" data-testid="DownloadResult-Title">{props.title}</p>
            </div>
            <div className="mb-6 px-10 text-center" data-testid="DownloadResult-SubTitle">
                <p>{props.subTitle}</p>
            </div>
            { props.gotoHome &&
                <div>
                    <button
                        data-testid="DownloadResult-Home-Button"
                        onClick={() => navigate("/")}
                        className="text-iw-primary font-bold py-2 px-4 rounded-lg border-2 border-iw-primary">
                        {t("navigateButton")}
                    </button>
                </div>
            }
        </div>
}

export type LandingPageWrapperProps = {
    icon: React.ReactNode;
    title: string;
    subTitle: string;
    gotoHome: boolean;
}
