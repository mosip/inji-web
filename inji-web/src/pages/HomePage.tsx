import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {HomeBanner} from "../components/Home/HomeBanner";
import {HomeFeatures} from "../components/Home/HomeFeatures";
import {HomeQuickTip} from "../components/Home/HomeQuickTip";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

export const HomePage: React.FC = () => {
    const [displayName, setDisplayName] = useState<string | null>(null);

    useEffect(() => {
        const handleStorageChange = () => {
            console.log(
                "displayNameUpdated event triggered, updating Home...",
                localStorage.getItem("displayName")
            );
            setDisplayName(localStorage.getItem("displayName"));
        };

        window.addEventListener("displayNameUpdated", handleStorageChange);

        return () => {
            window.removeEventListener(
                "displayNameUpdated",
                handleStorageChange
            );
        };
    }, []);

    const navigate = useNavigate();
    const {t} = useTranslation("HomePage");

    return (
        <div className={"pb-20 flex flex-col gap-y-4 "}>
            {displayName && <div className="greeting">Hi {displayName}</div>}
            <HomeBanner onClick={() => navigate("/issuers")} />
            <HomeFeatures />
            <HomeQuickTip
                onClick={() => toast.warning(t("QuickTip.toastText"))}
            />
        </div>
    );
};
