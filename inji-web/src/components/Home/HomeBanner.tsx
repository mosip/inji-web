import React from "react";
import {PlainButton} from "../Common/Buttons/PlainButton";
import { useTranslation } from "react-i18next";

export const HomeBanner:React.FC<HomeBannerProps> = (props) => {
    const {t} = useTranslation("HomePage");
    return <div className={"py-2 pb-10"}>

        <div className={"mt-8 container mx-auto rounded-xl py-20 flex flex-col justify-center items-center bg-gradient-to-r from-iw-primary to-iw-secondary h-1/6"}>
            <span className={"text-5xl text-iw-text font-semibold text-wrap w-8/12 text-center pb-10"}>{t("Banner.heading")}</span>
            <span className={"text-iw-text font-extralight text-wrap w-1/3 text-center pb-16"}>{t("Banner.description")}</span>
            <PlainButton testId={"HomeBanner-Get-Started"} onClick={props.onClick} title={t("Banner.buttontext")} />
        </div>
    </div>
}

export type HomeBannerProps = {
    onClick: () => void
}
