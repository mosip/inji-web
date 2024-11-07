import React from "react";
import {useNavigate} from "react-router-dom";
import {HomeBanner} from "../components/Home/HomeBanner";
import {HomeFeatures} from "../components/Home/HomeFeatures";
import {HomeQuickTip} from "../components/Home/HomeQuickTip";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

export const HomePage:React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation("HomePage");
    return <div className={"pb-20 flex flex-col gap-y-4 "}>
        <HomeBanner onClick={() => navigate("/issuers")} />
        <HomeFeatures/>
        <HomeQuickTip  onClick={() => toast.warning(t("QuickTip.toastText"))} />
    </div>
}
