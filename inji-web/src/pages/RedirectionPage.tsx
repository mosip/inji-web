import React, {useEffect, useRef, useState} from 'react';
import {getActiveSession, removeActiveSession} from '../utils/sessions';
import {useLocation, useNavigate} from 'react-router-dom';
import {NavBar} from '../components/Common/NavBar';
import {RequestStatus, useFetch} from '../hooks/useFetch';
import {DownloadResult} from '../components/Redirection/DownloadResult';
import {api, MethodType} from '../utils/api';
import {SessionObject, TokenRequestBody} from '../types/data';
import {useTranslation} from 'react-i18next';
import {downloadCredentialPDF, getErrorObject, getTokenRequestBody} from '../utils/misc';
import {getIssuerDisplayObjectForCurrentLanguage} from '../utils/i18n';
import {RootState} from '../types/redux';
import {useSelector} from 'react-redux';
import {useCookies} from 'react-cookie';
import {useUser} from '../hooks/useUser';
import {ROUTES} from "../utils/constants";
import {useDownloadSessionDetails} from "../hooks/userDownloadSessionDetails";

interface LoggedInDownloadFlowProps {
    issuerId: string;
    requestBody: TokenRequestBody;
}

export const RedirectionPage: React.FC = () => {
    const {error, state, response, fetchRequest} = useFetch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectedSessionId = searchParams.get("state");
    const activeSessionInfo: any = getActiveSession(redirectedSessionId);
    const credentialType = activeSessionInfo?.selectedCredentialType?.type;
    const credentialTypeDisplayObj =
        activeSessionInfo?.selectedCredentialType?.displayObj;
    const {t} = useTranslation("RedirectionPage");
    const [session, setSession] = useState<SessionObject | null>(activeSessionInfo);
    const [completedDownload, setCompletedDownload] = useState<boolean>(false);
    const displayObject = getIssuerDisplayObjectForCurrentLanguage(session?.selectedIssuer?.display ?? []);
    const language = useSelector((state: RootState) => state.common.language);
    const [errorObj, setErrorObj] = useState({
        code: "error.generic.title",
        message: "error.generic.subTitle"
    });
    const [cookies] = useCookies(["XSRF-TOKEN"]);
    const {isLoading, fetchUserProfile, isUserLoggedIn} = useUser();
    const hasFetchedRef = useRef(false);
    const navigate = useNavigate();
    const {addSession, updateSession} = useDownloadSessionDetails();

    const handleLoggedInDownloadFlow = async ({issuerId, requestBody}: LoggedInDownloadFlowProps) => {
        const apiRequest = api.downloadVCInloginFlow;
        const downloadId = addSession(credentialTypeDisplayObj, RequestStatus.LOADING);
        navigate(ROUTES.USER_ISSUER(issuerId))
        let credentialDownloadResponse = await fetch(
            apiRequest.url(),
            {
                method: MethodType[apiRequest.methodType],
                headers: {
                    ...apiRequest.headers(language),
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                },
                credentials: apiRequest.credentials,
                body: JSON.stringify(requestBody),
            }
        );
        if (credentialDownloadResponse.ok) {
            updateSession(downloadId, RequestStatus.DONE)
        } else {
            updateSession(downloadId, RequestStatus.ERROR)
        }
    }

    const handleGuestDownloadFlow = async (requestBody: TokenRequestBody) => {
        const urlState = searchParams.get('state') ?? '';
        const apiRequest = api.fetchTokenAnddownloadVc;
        const credentialDownloadResponse = await fetchRequest(
            apiRequest.url(),
            apiRequest.methodType,
            apiRequest.headers(),
            apiRequest.credentials,
            new URLSearchParams(requestBody)
        );
        if (state !== RequestStatus.ERROR) {
            await downloadCredentialPDF(
                credentialDownloadResponse,
                credentialType
            );
            setCompletedDownload(true);
        } else {
            setErrorObj(
                getErrorObject(credentialDownloadResponse)
            );
        }
        if (urlState != null) {
            removeActiveSession(urlState);
        }
    }

    const fetchToken = async () => {
        if (Object.keys(activeSessionInfo).length > 0) {
            const code = searchParams.get('code') ?? '';
            const codeVerifier = activeSessionInfo?.codeVerifier;
            const issuerId =
                activeSessionInfo?.selectedIssuer?.issuer_id ?? '';
            const vcStorageExpiryLimitInTimes =
                activeSessionInfo?.vcStorageExpiryLimitInTimes ??
                '-1';

            const requestBody =
                getTokenRequestBody(
                    code,
                    codeVerifier,
                    issuerId,
                    credentialType,
                    vcStorageExpiryLimitInTimes,
                    isUserLoggedIn
                );

            if (isUserLoggedIn) {
                await handleLoggedInDownloadFlow({issuerId, requestBody});
            } else {
                await handleGuestDownloadFlow(requestBody);
            }
        } else {
            setSession(null);
        }
    };

    useEffect(() => {
        const downloadCredential = async () => {
            if (!isLoading && !hasFetchedRef.current) {
                hasFetchedRef.current = true;
                await fetchToken();
            }
            if (isLoading) {
                try {
                    await fetchUserProfile();
                } catch (error) {
                    console.log(
                        'Error occurred while fetching user profile:',
                        error
                    );
                }
            }
        };
        downloadCredential();
    }, [isLoading]);

    const loadStatusOfRedirection = () => {
        if (!session) {
            return <DownloadResult title={t("error.invalidSession.title")}
                                   subTitle={t("error.invalidSession.subTitle")}
                                   state={RequestStatus.ERROR}/>
        }
        if (state === RequestStatus.ERROR && error) {
            const errorObject = getErrorObject(response);
            return <DownloadResult title={t(errorObject.code)}
                                   subTitle={t(errorObject.message)}
                                   state={RequestStatus.ERROR}/>
        }
        if (!completedDownload) {
            return <DownloadResult title={t("loading.title")}
                                   subTitle={t("loading.subTitle")}
                                   state={RequestStatus.LOADING}/>
        }
        return <DownloadResult title={t("success.title")}
                               subTitle={t("success.subTitle")}
                               state={RequestStatus.DONE}/>
    }

    return <div data-testid="Redirection-Page-Container">
        {activeSessionInfo?.selectedIssuer?.issuer_id && <NavBar title={displayObject?.name ?? ""} search={false}
                                                                 link={`/issuers/${activeSessionInfo?.selectedIssuer?.issuer_id}`}/>}
        {loadStatusOfRedirection()}
    </div>
}