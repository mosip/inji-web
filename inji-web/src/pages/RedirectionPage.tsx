import React, {useEffect, useRef, useState} from 'react';
import {getActiveSession, removeActiveSession} from '../utils/sessions';
import {useLocation, useNavigate} from 'react-router-dom';
import {NavBar} from '../components/Common/NavBar';
import {RequestStatus, useFetch} from '../hooks/useFetch';
import {DownloadResult} from '../components/Redirection/DownloadResult';
import {api} from '../utils/api';
import {SessionObject} from '../types/data';
import {useTranslation} from 'react-i18next';
import {
    downloadCredentialPDF,
    getErrorObject,
    getTokenRequestBody
} from '../utils/misc';
import {getIssuerDisplayObjectForCurrentLanguage} from '../utils/i18n';
import {RootState} from '../types/redux';
import {useSelector} from 'react-redux';
import {useCookies} from 'react-cookie';
import {useUser} from '../hooks/useUser';

export const RedirectionPage: React.FC = () => {
    const {error, state, response, fetchRequest} = useFetch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectedSessionId = searchParams.get("state");
    const activeSessionInfo: any = getActiveSession(redirectedSessionId);
    const {t} = useTranslation("RedirectionPage");
    const [session, setSession] = useState<SessionObject | null>(activeSessionInfo);
    const [completedDownload, setCompletedDownload] = useState<boolean>(false);
    const displayObject = getIssuerDisplayObjectForCurrentLanguage(session?.selectedIssuer?.display ?? []);
    const language = useSelector((state: RootState) => state.common.language);
    const [errorObj, setErrorObj] = useState({
        code: "error.generic.title",
        message: "error.generic.subTitle"
    });
    const [loginErrorObj, setLoginErrorObj] = useState({
        code: "",
        message: ""
    });
    const [cookies] = useCookies(["XSRF-TOKEN"]);
    const {user, walletId, isLoading, fetchUserProfile} = useUser();
    const hasFetchedRef = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        const downloadCredential = async () => {
            if (!isLoading && !hasFetchedRef.current) {
                hasFetchedRef.current = true;
                const fetchToken = async () => {
                    if (Object.keys(activeSessionInfo).length > 0) {
                        const code = searchParams.get('code') ?? '';
                        const urlState = searchParams.get('state') ?? '';
                        const codeVerifier = activeSessionInfo?.codeVerifier;
                        const issuerId =
                            activeSessionInfo?.selectedIssuer?.issuer_id ?? '';
                        const certificateId = activeSessionInfo?.certificateId;
                        const vcStorageExpiryLimitInTimes =
                            activeSessionInfo?.vcStorageExpiryLimitInTimes ??
                            '-1';

                        const requestBody = new URLSearchParams(
                            getTokenRequestBody(
                                code,
                                codeVerifier,
                                issuerId,
                                certificateId,
                                vcStorageExpiryLimitInTimes,
                                language
                            )
                        );

                        let apiRequest, credentialDownloadResponse;
                        const isLoggedIn = !!user && !!walletId;

                        if (isLoggedIn) {
                            apiRequest = api.downloadVCInloginFlow;
                            let credentialDownloadResponse = await fetch(
                                apiRequest.url(),
                                {
                                    method: 'POST',
                                    headers: {
                                        ...apiRequest.headers,
                                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                                    },
                                    credentials: 'include',
                                    body: requestBody
                                }
                            );
                            if (credentialDownloadResponse.ok) {
                                navigate('/dashboard/credentials');
                            } else {
                                const responseData =
                                    await credentialDownloadResponse.json();
                                setLoginErrorObj({
                                    code: 'Downlaoding Credential Failed',
                                    message: responseData.errorMessage
                                });
                            }
                        } else {
                            apiRequest = api.fetchTokenAnddownloadVc;
                            credentialDownloadResponse = await fetchRequest(
                                apiRequest.url(),
                                apiRequest.methodType,
                                apiRequest.headers(),
                                apiRequest.credentials,
                                requestBody
                            );
                            if (state !== RequestStatus.ERROR) {
                                await downloadCredentialPDF(
                                    credentialDownloadResponse,
                                    certificateId
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
                    } else {
                        setSession(null);
                    }
                };
                fetchToken();
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

        if (loginErrorObj.code !== "") {
            return (
                <DownloadResult
                    title={t(loginErrorObj.code)}
                    subTitle={t(loginErrorObj.message)}
                    state={RequestStatus.ERROR}
                />
            );
        }

        if (state === RequestStatus.ERROR && error) {
            const errorObject = getErrorObject(response);
            return <DownloadResult title={t(errorObject.code)}
                                   subTitle={t(errorObject.message)}
                                   state={RequestStatus.ERROR}/>
        }
        if(!completedDownload){
            return <DownloadResult title={t("loading.title")}
                                   subTitle={t("loading.subTitle")}
                                   state={RequestStatus.LOADING}/>
        }
        return <DownloadResult title={t("success.title")}
                               subTitle={t("success.subTitle")}
                               state={RequestStatus.DONE}/>
    }

    return <div data-testid="Redirection-Page-Container">
        {activeSessionInfo?.selectedIssuer?.issuer_id && <NavBar title={displayObject?.name ?? ""} search={false} link={`/issuers/${activeSessionInfo?.selectedIssuer?.issuer_id}`}/>}
        {loadStatusOfRedirection()}
    </div>
}
