import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {HomeBanner} from "../components/Home/HomeBanner";
import {HomeFeatures} from "../components/Home/HomeFeatures";
import {HomeQuickTip} from "../components/Home/HomeQuickTip";
import {toast,ToastContainer} from "react-toastify";
import {useTranslation} from "react-i18next";
import {api} from "../utils/api";

export const HomePage: React.FC = () => {
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [sessionStatus, setSessionStatus] = useState<string>("invalid");
    useEffect(() => {
        fetchLoginStatus();
        console.log("session status::",sessionStatus)
        const name = localStorage.getItem("displayName");
        setDisplayName(name);
    }, []);
    const navigate = useNavigate();
    const {t} = useTranslation("HomePage");

    const fetchLoginStatus = async () => {
        try {
            const response = await fetch(api.fetchUserLoginStatus.url(), {
                method:
                    api.fetchUserLoginStatus.methodType === 0 ? "GET" : "POST",
                headers: {
                    ...api.fetchUserLoginStatus.headers()
                },
                credentials: "include"
            });
            const loginSessionStatus = (await response.json())?.response;
            console.log("loginSessionStatus::", loginSessionStatus);
            if (response.ok) {
                console.log("status:", loginSessionStatus);
                setSessionStatus(loginSessionStatus);
            } else {
                setSessionStatus("invalid");
                throw new Error("Failed to fetch user session");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            localStorage.removeItem("displayName");
            navigate("/");
        }
    };

    return (
        <div className={"pb-20 flex flex-col gap-y-4 "}>
            {sessionStatus.startsWith("Session is active") && <div className="greeting">Hi {displayName}</div>}
            <HomeBanner onClick={() => navigate("/issuers")} />
            <HomeFeatures />
            <HomeQuickTip
                onClick={() => toast.warning(t("QuickTip.toastText"))}
            />
        </div>
    );
};
