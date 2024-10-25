import React from "react";
import {PlainButton} from "../Common/Buttons/PlainButton";
import { useTranslation } from "react-i18next";

export const HomeQuickTip:React.FC<HomeQuickTipProps> = (props) => {
    const {t}=useTranslation("HomePage");

    return <div className={"py-5"}>
        <div className={"mt-20 container mx-auto rounded-xl p-24 py-16 flex justify-between items-center bg-gradient-to-r from-iw-primary to-iw-secondary h-1/6"}>
            <span className={"text-3xl text-iw-text font-semibold text-wrap w-5/12 text-start pb-10 flex items-center"}>{t("QuickTip.heading")}</span>
            <div className={"items-center flex"}>
                <PlainButton testId={"HomeBanner-Get-Started"} onClick={props.onClick} title={t("QuickTip.buttontext")} />
            </div>
        </div>
    </div>
}

export type HomeQuickTipProps = {
    onClick: () => void
}

