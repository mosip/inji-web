import React from "react";
import {useNavigate} from "react-router-dom";
import {HomeBanner} from "../components/Home/HomeBanner";
import {HomeFeatures} from "../components/Home/HomeFeatures";
import {HomeQuickTip} from "../components/Home/HomeQuickTip";

export const HomePage:React.FC = () => {
    const navigate = useNavigate();
    return <div className={"pb-20"}>

        <HomeBanner onClick={() => navigate("/issuers")} />
        <HomeFeatures />
        <HomeQuickTip  onClick={() => navigate("/issuers")} />
    </div>
}
