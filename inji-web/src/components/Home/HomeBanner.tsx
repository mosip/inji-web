import React from "react";
import {PlainButton} from "../Common/Buttons/PlainButton";
import { useTranslation } from "react-i18next";

export const HomeBanner: React.FC<HomeBannerProps> = (props) => {
    const {t} = useTranslation("HomePage");
    return (
        <div data-testid="HomeBanner-Container" className="py-2 pb-10">
            <div 
                data-testid="HomeBanner-Content" 
                className="mt-8 sm:mx-[4%] sm:rounded-xl pt-12 pb-6 sm:pt-16 sm:pb-8 px-[2%] sm:px-[5%] flex flex-col justify-center items-center bg-home-banner h-1/6"
            >
                <span data-testid="HomeBanner-Heading" className="text-4xl sm:text-5xl text-iw-text font-semibold text-wrap w-full sm:w-[80%] text-center pb-4">
                    {t("Banner.heading")}
                </span>
                <span data-testid="HomeBanner-Description" className="text-iw-text text-xl font-extralight w-[90%] sm:w-[75%] text-pretty text-center pb-8">
                    {t("Banner.description")}
                </span>
                <div data-testid="HomeBanner-ButtonContainer" className="w-[95%] sm:w-48">
                    <PlainButton testId="HomeBanner-Get-Started" onClick={props.onClick} title={t("Banner.buttontext")} />
                </div>
            </div>
        </div>
    );
}

export type HomeBannerProps = {
    onClick: () => void
}
