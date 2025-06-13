import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {RequestStatus, useFetch} from '../../../hooks/useFetch';
import {useDispatch, useSelector} from 'react-redux';
import {storeSelectedIssuer} from '../../../redux/reducers/issuersReducer';
import {storeCredentials, storeFilteredCredentials} from '../../../redux/reducers/credentialsReducer';
import {api} from '../../../utils/api';
import {ApiRequest, IssuerObject, IssuerWellknownDisplayArrayObject} from '../../../types/data';
import {getIssuerDisplayObjectForCurrentLanguage} from '../../../utils/i18n';
import {RootState} from '../../../types/redux';
import {isObjectEmpty} from '../../../utils/misc';
import {navigateToUserHome} from "../../../utils/navigationUtils";
import {CredentialTypesPageStyles} from "./CredentialTypesPageStyles";
import {useDownloadSessionDetails} from "../../../hooks/userDownloadSessionDetails";
import {CredentialTypesPageContent} from "../../../components/User/CredentialTypes/CredentialTypesPageContent.tsx";
import {Header} from "../../../components/User/CredentialTypes/Header.tsx";
import {ROUTES} from "../../../utils/constants";

type CredentialTypesPageProps = {
    backUrl?: string;
};

export const CredentialTypesPage: React.FC<CredentialTypesPageProps> = ({
                                                                            backUrl
                                                                        }) => {
    const {state, fetchRequest} = useFetch();
    const params = useParams<CredentialParamProps>();
    const dispatch = useDispatch();
    const language = useSelector((state: RootState) => state.common.language);
    let displayObject = {} as IssuerWellknownDisplayArrayObject;
    let [selectedIssuer, setSelectedIssuer] = useState({} as IssuerObject);
    if (!isObjectEmpty(selectedIssuer)) {
        displayObject = getIssuerDisplayObjectForCurrentLanguage(
            selectedIssuer.display,
            language
        );
    }
    const navigate = useNavigate();
    const location = useLocation();
    const {
        downloadInProgressSessions,
        currentSessionDownloadId,
        setCurrentSessionDownloadId,
        setLatestDownloadedSessionId
    } = useDownloadSessionDetails();

    const [downloadStatus, setDownloadStatus] = useState<RequestStatus | null>(null);

    useEffect(() => {
        const status = currentSessionDownloadId ? downloadInProgressSessions[currentSessionDownloadId]?.downloadStatus : null;
        setDownloadStatus(status);

    }, [currentSessionDownloadId, downloadInProgressSessions]);

    useEffect(() => {
        return (() => {
            setCurrentSessionDownloadId(null);
            setLatestDownloadedSessionId(null);
        })
    }, []);

    useEffect(() => {
        if (downloadStatus === RequestStatus.DONE) {
            navigate(ROUTES.CREDENTIALS)
        }
    }, [downloadStatus])

    useEffect(() => {
        if (state === RequestStatus.ERROR) {
            setDownloadStatus(RequestStatus.ERROR);
        }
    }, [state])

    useEffect(() => {
        const fetchCall = async () => {
            let apiRequest: ApiRequest = api.fetchSpecificIssuer;
            let response = await fetchRequest(
                apiRequest.url(params.issuerId ?? ''),
                apiRequest.methodType,
                apiRequest.headers()
            );
            dispatch(storeSelectedIssuer(response?.response));
            setSelectedIssuer(response?.response);

            apiRequest = api.fetchIssuersConfiguration;
            response = await fetchRequest(
                apiRequest.url(params.issuerId ?? ''),
                apiRequest.methodType,
                apiRequest.headers()
            );
            dispatch(storeFilteredCredentials(response?.response));
            dispatch(storeCredentials(response?.response));
        };
        fetchCall();
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
            data-testid={'Credential-Types-Page-Container'}
            className={CredentialTypesPageStyles.container}
        >
            <Header onBackClick={handleBackClick} displayObject={displayObject}
                    onClick={() => navigateToUserHome(navigate)}/>
            <CredentialTypesPageContent downloadStatus={downloadStatus} state={state}/>
        </div>
    );
};