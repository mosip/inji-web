import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {RequestStatus, useFetch} from '../../../hooks/useFetch';
import {CredentialList} from '../../../components/Credentials/CredentialList';
import {useDispatch, useSelector} from 'react-redux';
import {storeSelectedIssuer} from '../../../redux/reducers/issuersReducer';
import {storeCredentials, storeFilteredCredentials} from '../../../redux/reducers/credentialsReducer';
import {api} from '../../../utils/api';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {ApiRequest, IssuerObject, IssuerWellknownDisplayArrayObject} from '../../../types/data';
import {getIssuerDisplayObjectForCurrentLanguage} from '../../../utils/i18n';
import {RootState} from '../../../types/redux';
import {isObjectEmpty} from '../../../utils/misc';
import {SearchCredential} from '../../../components/Credentials/SearchCredential';
import {NavBackArrowButton} from '../../../components/Common/Buttons/NavBackArrowButton';
import {navigateToUserHome} from "../../../utils/navigationUtils";
import {CredentialTypesPageStyles} from "./CredentialTypesPageStyles";

type CredentialTypesPageProps = {
    backUrl?: string;
};

export const CredentialTypesPage: React.FC<CredentialTypesPageProps> = ({
    backUrl
}) => {
    const {state, fetchRequest} = useFetch();
    const params = useParams<CredentialParamProps>();
    const dispatch = useDispatch();
    const {t} = useTranslation(['CredentialsPage', 'User']);
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

    if (state === RequestStatus.ERROR) {
        toast.error(t('errorContent'));
    }

    const location = useLocation();
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

    //TODO here check if the div with testId "Credential-List-Container" can be moved to credentialList component
    return (
        <div
            data-testid={'credential-types-page-container'}
            className={CredentialTypesPageStyles.container}
        >
            <div className={CredentialTypesPageStyles.headerContainer}>
                <div className={CredentialTypesPageStyles.headerLeftSection}>
                    <div className={CredentialTypesPageStyles.headerLeftSection}>
                        <NavBackArrowButton onBackClick={handleBackClick} />
                    </div>
                    <div className={CredentialTypesPageStyles.headerTitleSection}>
                        <span
                            data-testid={'stored-credentials'}
                            className={CredentialTypesPageStyles.pageTitle}
                        >
                            {displayObject?.name}
                        </span>
                        <button
                            data-testid={'home'}
                            className={CredentialTypesPageStyles.homeButton}
                            onClick={() => navigateToUserHome(navigate)}
                        >
                            {t('User:Home.title')}
                        </button>
                    </div>
                </div>
                <div>
                    <SearchCredential
                        issuerContainerBorderRadius={'rounded-md'}
                    />
                </div>
            </div>

            <div className={CredentialTypesPageStyles.contentContainer}>
                <div
                    data-testid="credential-list-container"
                    className={CredentialTypesPageStyles.credentialListContainer}
                >
                    <CredentialList state={state} />
                </div>
            </div>
        </div>
    );
};
