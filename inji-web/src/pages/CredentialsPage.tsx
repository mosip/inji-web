import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RequestStatus, useFetch} from "../hooks/useFetch";
import {NavBar} from "../components/Common/NavBar";
import {CredentialList} from "../components/Credentials/CredentialList";
import {useDispatch, useSelector} from "react-redux";
import {storeSelectedIssuer} from "../redux/reducers/issuersReducer";
import {storeCredentials} from "../redux/reducers/credentialsReducer";
import {api} from "../utils/api";
import {HeaderTile} from "../components/Common/HeaderTile";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

import {ApiRequest, DisplayArrayObject, IssuerObject} from "../types/data";
import {getObjectForCurrentLanguage} from "../utils/i18n";
import {RootState} from "../types/redux";
import {isObjectEmpty} from "../utils/misc";

export const CredentialsPage: React.FC = () => {

    const {state, fetchRequest} = useFetch();
    const params = useParams<CredentialParamProps>();
    const dispatch = useDispatch();
    const {t} = useTranslation("CredentialsPage");
    const language = useSelector((state: RootState) => state.common.language);
    let displayObject= {} as DisplayArrayObject;
    let [selectedIssuer, setSelectedIssuer] = useState({} as IssuerObject)
    if(!isObjectEmpty(selectedIssuer)){
        displayObject = getObjectForCurrentLanguage(selectedIssuer.display, language);
    }

    useEffect(() => {
        const fetchCall = async () => {
            let apiRequest: ApiRequest = api.fetchSpecificIssuer;
            let response = await fetchRequest(
                apiRequest.url(params.issuerId ?? ""),
                apiRequest.methodType,
                apiRequest.headers()
            );
            dispatch(storeSelectedIssuer(response?.response));
            setSelectedIssuer(response?.response);

            apiRequest = api.fetchCredentialTypes;
            response = await fetchRequest(
                apiRequest.url(params.issuerId ?? ""),
                apiRequest.methodType,
                apiRequest.headers()
            );
            dispatch(storeCredentials(response?.response?.supportedCredentials));
        }
        fetchCall();
    }, [])

    if (state === RequestStatus.ERROR) {
        toast.error(t("errorContent"));
    }


    return <React.Fragment>
        <div className="bg-iw-background min-h-screen"
             data-testid="Credentials-Page-Container">
            <NavBar title={displayObject?.name} search={true} fetchRequest={fetchRequest} link={"/"}/>
            <HeaderTile content={t("containerHeading")}/>
            <CredentialList state={state}/>
        </div>
    </React.Fragment>
}

