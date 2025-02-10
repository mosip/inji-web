import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RequestStatus, useFetch} from "../hooks/useFetch";
import {NavBar} from "../components/Common/NavBar";
import {CredentialList} from "../components/Credentials/CredentialList";
import {useDispatch, useSelector} from "react-redux";
import {storeSelectedIssuer} from "../redux/reducers/issuersReducer";
import {
    storeCredentials,
    storeFilteredCredentials
} from "../redux/reducers/credentialsReducer";
import {api} from "../utils/api";
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
    let displayObject = {} as DisplayArrayObject;
    const selectedIssuer: IssuerObject | undefined = useSelector(
        (state: RootState) => state.issuers.selected_issuer
    );
    if (!isObjectEmpty(selectedIssuer)) {
        displayObject = getObjectForCurrentLanguage(
            selectedIssuer?.display,
            language
        );
    }

    useEffect(() => {
        const fetchCall = async () => {
            dispatch(storeSelectedIssuer(params.issuerId ?? ""));
            let apiRequest = api.fetchIssuersWellknown;
            let response = await fetchRequest(
                apiRequest.url(params.issuerId ?? ""),
                apiRequest.methodType,
                apiRequest.headers()
            );

            dispatch(storeFilteredCredentials(response?.response));
            dispatch(storeCredentials(response?.response));
        };
        fetchCall();
    }, []);

    if (state === RequestStatus.ERROR) {
        toast.error(t("errorContent"));
    }


    return <React.Fragment>
        <div className="bg-iw-background min-h-screen"
             data-testid="Credentials-Page-Container">
            <NavBar title={displayObject?.name} search={true} fetchRequest={fetchRequest} link={"/issuers"}/>
            <div data-testid="Credential-List-Container" className="container mx-auto mt-8 px-10 sm:px-0">
                <CredentialList state={state}/>
            </div>
        </div>
    </React.Fragment>
}

