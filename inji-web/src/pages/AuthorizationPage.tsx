import React, {useEffect, useState} from "react";
import {SpinningLoader} from "../components/Common/SpinningLoader";
import {ApiRequest} from "../types/data";
import {api} from "../utils/api";
import {RequestStatus, useFetch} from "../hooks/useFetch";
import {ErrorSheildIcon} from "../components/Common/ErrorSheildIcon";
import {LandingPageWrapper} from "../components/Common/LandingPageWrapper";
import {useTranslation} from "react-i18next";

export const AuthorizationPage: React.FC = () => {

    const {fetchRequest, state} = useFetch();
    const [response, setResponse] = useState<any>();
    const {t} = useTranslation("RedirectionPage");

    async function authorizePresentation() {
        try {
            const queryParams = new URLSearchParams(window.location.search)
            const responseType = queryParams.get("response_type") + "";
            const resource = queryParams.get("resource") + "";
            const clientId = queryParams.get("client_id") + "";
            const redirectUri = queryParams.get("redirect_uri") + "";
            const presentationDefinition = encodeURI(queryParams.get("presentation_definition") + "");

            const apiRequest: ApiRequest = api.presentationAuthorization;
            const apiResponse = await fetchRequest(
                apiRequest.url(responseType, resource, clientId, redirectUri, presentationDefinition),
                apiRequest.methodType,
                apiRequest.headers()
            );
            setResponse(apiResponse);
            console.log("Presentation Authorized Successfully");
        } catch (e) {
            console.error("Exception occurred while invoking the authorization"+e);
        }
    }

    useEffect( () => {
        authorizePresentation();
    },[])

    return <React.Fragment>
        {state === RequestStatus.DONE && <LandingPageWrapper icon={<ErrorSheildIcon />} title={response.errors[0].error} subTitle={response.errors[0].error_description} gotoHome={false}/> }
        {state === RequestStatus.LOADING && <LandingPageWrapper icon={<SpinningLoader />} title={""} subTitle={""} gotoHome={false}/> }
        {state === RequestStatus.ERROR && <LandingPageWrapper icon={<ErrorSheildIcon />} title={t("error.generic.title")} subTitle={t("error.generic.subTitle")} gotoHome={false}/> }
    </React.Fragment>
}
