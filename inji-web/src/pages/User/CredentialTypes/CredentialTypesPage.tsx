import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {storeSelectedIssuer} from '../../../redux/reducers/issuersReducer';
import {storeCredentials, storeFilteredCredentials} from '../../../redux/reducers/credentialsReducer';
import {api} from '../../../utils/api';
import {ApiRequest, IssuerWellknownDisplayArrayObject, ResponseTypeObject} from '../../../types/data';
import {getIssuerDisplayObjectForCurrentLanguage} from '../../../utils/i18n';
import {RootState} from '../../../types/redux';
import {navigateToUserHome} from "../../../utils/navigationUtils";
import {CredentialTypesPageStyles} from "./CredentialTypesPageStyles";
import {useDownloadSessionDetails} from "../../../hooks/User/useDownloadSession";
import {CredentialTypesPageContent} from "../../../components/User/CredentialTypes/CredentialTypesPageContent";
import {Header} from "../../../components/User/CredentialTypes/Header";
import {RequestStatus, ROUTES} from "../../../utils/constants";
import {useApi} from "../../../hooks/useApi";
import {useUser} from "../../../hooks/User/useUser";

type CredentialTypesPageProps = {
    backUrl?: string;
};

export const CredentialTypesPage: React.FC<CredentialTypesPageProps> = ({
                                                                            backUrl
                                                                        }) => {
    const params = useParams<CredentialParamProps>();
    const dispatch = useDispatch();
    const language = useSelector((state: RootState) => state.common.language);
    const [displayObject, setDisplayObject] = useState<IssuerWellknownDisplayArrayObject>();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        downloadInProgressSessions,
        currentSessionDownloadId,
        setCurrentSessionDownloadId,
        setLatestDownloadedSessionId
    } = useDownloadSessionDetails();

    const [state, setState] = useState<RequestStatus>(RequestStatus.LOADING);

    const [downloadStatus, setDownloadStatus] = useState<RequestStatus | null>(null);
    const issuerApi = useApi<ResponseTypeObject>()
    const issuersConfigurationApi = useApi<ResponseTypeObject>()
    const {fetchUserProfile} = useUser()

    useEffect(() => {
        const status = currentSessionDownloadId ? downloadInProgressSessions[currentSessionDownloadId]?.downloadStatus : null;
        setDownloadStatus(status);

    }, [currentSessionDownloadId, downloadInProgressSessions]);

    useEffect(() => {
        if (downloadStatus === RequestStatus.DONE) {
            navigate(ROUTES.CREDENTIALS)
        }
    }, [downloadStatus])

    useEffect(() => {
        const fetchIssuerAndConfiguration = async () => {
            try {
                await fetchUserProfile();
                let apiRequest: ApiRequest = api.fetchSpecificIssuer;
                const {data: issuerResponse, error: issuerResponseError} = await issuerApi.fetchData({
                    url: apiRequest.url(params.issuerId ?? ''),
                    apiConfig: apiRequest
                });
                if (issuerResponseError) {
                    setState(RequestStatus.ERROR);
                    return;
                }
                dispatch(storeSelectedIssuer(issuerResponse?.response));
                setDisplayObject(getIssuerDisplayObjectForCurrentLanguage(
                    issuerResponse?.response.display,
                    language
                ))

                apiRequest = api.fetchIssuersConfiguration;
                const {
                    data: issuerConfigurationResponse,
                    error: issuerConfigurationResponseError
                } = await issuersConfigurationApi.fetchData({
                    url: apiRequest.url(params.issuerId ?? ''),
                    apiConfig: apiRequest
                })
                if (issuerConfigurationResponseError) {
                    setState(RequestStatus.ERROR);
                    return;
                }
                dispatch(storeFilteredCredentials(issuerConfigurationResponse?.response));
                dispatch(storeCredentials(issuerConfigurationResponse?.response));
                setState(RequestStatus.DONE);
            } catch (error: any) {
                console.error("Error fetching user profile or issuers info:", error);
                setState(RequestStatus.ERROR);
            }
        };
        void fetchIssuerAndConfiguration();

        return (() => {
            setCurrentSessionDownloadId(null);
            setLatestDownloadedSessionId(null);
        })
    }, []);

    const previousPagePath = location.state?.from;

    const handleBackClick = () => {
        if (backUrl) {
            navigate(backUrl); // Navigate to the URL sent by the parent
        } else if (previousPagePath) {
            navigate(previousPagePath); // Navigate to the previous link in history
        } else {
            navigateToUserHome(navigate); // Navigate to homepage if opened directly
        }
    };

    return (
        <div
            data-testid={'credential-types-page-container'}
            className={CredentialTypesPageStyles.container}
        >
            <Header onBackClick={handleBackClick} displayObject={displayObject}
                    onClick={() => navigateToUserHome(navigate)}/>
            <CredentialTypesPageContent downloadStatus={downloadStatus} state={state}/>
        </div>
    );
};