import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {HomeBanner} from "../components/Home/HomeBanner";
import {HomeFeatures} from "../components/Home/HomeFeatures";
import {HomeQuickTip} from "../components/Home/HomeQuickTip";
import {toast,ToastContainer} from "react-toastify";
import {useTranslation} from "react-i18next";

export const HomePage:React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation("HomePage");
    const [toastVisible, setToastVisible] = useState(false);

    const showToast = (message: string) => {
        if (toastVisible) return;
        setToastVisible(true);
        toast.warning(message, {
            onClose: () => setToastVisible(false),
            toastId: 'toast-warning'
        });
    };

    return <div className={"pb-20 flex flex-col gap-y-4 "}>
        <HomeBanner onClick={() => navigate("/issuers")} />
        <HomeFeatures/>
        <HomeQuickTip  onClick={() => showToast(t("QuickTip.toastText"))} />
        <ToastContainer/>
    </div>
}
