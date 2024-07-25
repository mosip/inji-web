import React, {useEffect} from "react";
import {SpinningLoader} from "../components/Common/SpinningLoader";
import {api} from "../utils/api";
import {LandingPageWrapper} from "../components/Common/LandingPageWrapper";

export const AuthorizationPage: React.FC = () => {
    useEffect( () => {
        window.location.href = api.mimotoHost + "/authorize" + window.location.search;
    },[])
    return <LandingPageWrapper icon={<SpinningLoader />} title={""} subTitle={""} gotoHome={false}/>
}
