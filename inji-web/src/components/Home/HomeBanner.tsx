import React from "react";
import {PlainButton} from "../Common/Buttons/PlainButton";
import { useTranslation } from "react-i18next";

export const HomeBanner: React.FC<HomeBannerProps> = (props) => {
    const {t} = useTranslation("HomePage");
    return (
        <div data-testid="HomeBanner-Container" className="py-2 pb-10">
            <div 
                data-testid="HomeBanner-Content" 
                className="mt-8 sm:mx-[8%] sm:rounded-xl pt-14 pb-7 sm:py-20 flex flex-col justify-center items-center bg-home-banner h-1/6"
            >
                <span data-testid="HomeBanner-Heading" className="text-4xl sm:text-5xl text-iw-text font-semibold text-wrap w-[91%] sm:w-[66%] text-center pb-5">
                    {t("Banner.heading")}
                </span>
                <span data-testid="HomeBanner-Description" className="text-iw-text text-xl font-extralight w-[85%] sm:w-[60%] text-pretty text-center pb-10">
                    {t("Banner.description")}
                </span>
                <div data-testid="HomeBanner-ButtonContainer" className="w-[91%] sm:w-40">
                    <PlainButton testId="HomeBanner-Get-Started" onClick={props.onClick} title={t("Banner.buttontext")} />
                </div>
            </div>
        </div>
    );
}

export type HomeBannerProps = {
    onClick: () => void
}
