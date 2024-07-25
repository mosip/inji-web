import React, {useEffect, useState} from "react";
import {SpinningLoader} from "../components/Common/SpinningLoader";
import {api} from "../utils/api";
import {LandingPageWrapper} from "../components/Common/LandingPageWrapper";
import {ErrorSheildIcon} from "../components/Common/ErrorSheildIcon";

export const AuthorizationPage: React.FC = () => {
    const [error, setError] = useState<String>("");
    const [errorDesc, setErrorDesc] = useState<String>("");
    useEffect( () => {
        const currentQueryParams = new URLSearchParams(window.location.search);
        setError(currentQueryParams.get("error")+"");
        setErrorDesc(currentQueryParams.get("error_description")+"")
        if(error == "null"){
            window.location.href = api.mimotoHost + "/authorize" + window.location.search;
        }

    },[error])
    if(error == ""){
        return <div><LandingPageWrapper icon={<SpinningLoader/>} title={""} subTitle={""} gotoHome={false}/></div>
    }
    return <div><LandingPageWrapper icon={<ErrorSheildIcon />} title={error+""} subTitle={errorDesc+""} gotoHome={false}/></div>
}
