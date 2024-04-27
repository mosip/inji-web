import React, {useEffect, useState} from 'react';
import {getActiveSession, removeActiveSession} from "../utils/sessions";
import {useLocation} from "react-router-dom";
import {NavBar} from "../components/Common/NavBar";
import {RequestStatus, useFetch} from "../hooks/useFetch";
import {DownloadResult} from "../components/Redirection/DownloadResult";
import {api} from "../utils/api";
import {ApiRequest, SessionObject} from "../types/data";
import {useTranslation} from "react-i18next";
import {downloadCredentialPDF} from "../utils/misc";

export const RedirectionPage: React.FC = () => {

    const {error, state, fetchRequest} = useFetch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectedSessionId = searchParams.get("state");
    const activeSessionInfo: SessionObject = getActiveSession(redirectedSessionId);
    const {t} = useTranslation("RedirectionPage");
    const [session, setSession] = useState<SessionObject>(activeSessionInfo);

    useEffect(() => {
        const fetchToken = async () => {
            if (Object.keys(activeSessionInfo).length > 0) {
                const code = searchParams.get("code") ?? "";
                const urlState = searchParams.get("state") ?? "";
                const clientId = activeSessionInfo?.clientId;
                const codeVerifier = activeSessionInfo?.codeVerifier;
                const issuerId = activeSessionInfo?.issuerId ?? "";
                const certificateId = activeSessionInfo?.certificateId;

                const bodyJson = {
                    'grant_type': 'authorization_code',
                    'code': code,
                    'client_id': clientId,
                    'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                    'client_assertion': '',
                    'redirect_uri': api.authorizationRedirectionUrl,
                    'code_verifier': codeVerifier
                }
                const requestBody = new URLSearchParams(bodyJson);

                let apiRequest: ApiRequest = api.fetchToken;
                let response = await fetchRequest(
                    apiRequest.url(issuerId) + `?code=${code}&clientId=${clientId}&codeVerifier=${codeVerifier}`,
                    apiRequest.methodType,
                    apiRequest.headers(),
                    requestBody
                );

                apiRequest = api.downloadVc;
                response = await fetchRequest(
                    apiRequest.url(issuerId, certificateId) + `?token=${response?.access_token}`,
                    apiRequest.methodType,
                    apiRequest.headers(response?.access_token)
                );
                await downloadCredentialPDF(response, certificateId);
                if (state === RequestStatus.DONE) {
                    await downloadCredentialPDF(response, certificateId);
                }
                if (urlState != null) {
                    removeActiveSession(urlState);
                }
            } else {
                setSession(null);
            }
        }
        fetchToken();

    }, [])

    if (!session) {
        return <div data-testid="Redirection-Page-Container">
            <NavBar title={activeSessionInfo?.issuerId} search={false}/>
            <DownloadResult title={t("error.invalidSession.title")}
                            subTitle={t("error.invalidSession.subTitle")}
                            success={false}/>
        </div>
    }

    if (state === RequestStatus.ERROR && error) {
        return <div data-testid="Redirection-Page-Container">
            <NavBar title={activeSessionInfo?.issuerId} search={false}/>
            <DownloadResult title={t("error.generic.title")}
                            subTitle={t("error.generic.subTitle")}
                            success={false}/>
        </div>
    }

    return <div data-testid="Redirection-Page-Container">
        <NavBar title={activeSessionInfo?.issuerId} search={false}/>
        <DownloadResult title={t("success.title")}
                        subTitle={t("success.subTitle")}
                        success={true}/>
    </div>
}
