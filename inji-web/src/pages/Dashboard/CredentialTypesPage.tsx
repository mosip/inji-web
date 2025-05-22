import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {RequestStatus, useFetch} from '../../hooks/useFetch';
// import {NavBar} from '../components/Common/NavBar';
import {CredentialList} from '../../components/Credentials/CredentialList';
import {useDispatch, useSelector} from 'react-redux';
import {storeSelectedIssuer} from '../../redux/reducers/issuersReducer';
import {
    storeCredentials,
    storeFilteredCredentials
} from '../../redux/reducers/credentialsReducer';
import {api} from '../../utils/api';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {
    ApiRequest,
    IssuerWellknownDisplayArrayObject,
    IssuerObject
} from '../../types/data';
import {getIssuerDisplayObjectForCurrentLanguage} from '../../utils/i18n';
import {RootState} from '../../types/redux';
import {isObjectEmpty} from '../../utils/misc';
import {SearchCredential} from '../../components/Credentials/SearchCredential';
import {CredentialTypesPageProps} from '../../components/Dashboard/types';
import {navigateToDashboardHome} from './utils';
import { NavBackArrowButton } from './NavBackArrowButton';

export const CredentialTypesPage: React.FC<CredentialTypesPageProps> = ({
    backUrl
}) => {
    const {state, fetchRequest} = useFetch();
    const params = useParams<CredentialParamProps>();
    const dispatch = useDispatch();
    const {t} = useTranslation(['CredentialsPage', 'Dashboard']);
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
            navigateToDashboardHome(navigate); // Navigate to homepage if opened directly
        }
    };

    return (
        <div
            data-testid={'Credential-Types-Page-Container'}
            className="container mx-auto sm:px-2 md:px-4 lg:px-6 py-6 flex flex-col srelative gap-4 sm:gap-6 md:gap-10 lg:gap-12 ml-4  sm:ml-0"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-2">
                <div className="flex items-start">
                    <div className="flex items-start">
                        <NavBackArrowButton handleBackClick={handleBackClick} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span
                            data-testid={'Stored-Credentials'}
                            className="text-2xl font-medium"
                        >
                            {displayObject?.name}
                        </span>
                        <button
                            data-testid={'Home'}
                            className="text-xs sm:text-sm text-[#5B03AD] cursor-pointer"
                            onClick={() => navigateToDashboardHome(navigate)}
                        >
                            {t('Dashboard:Home.title')}
                        </button>
                    </div>
                </div>
                <div>
                    <SearchCredential
                        issuerContainerBorderRadius={'rounded-md'}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-iw-emptyDocuments flex flex-col sm:flex-row justify-between items-start p-4 sm:p-6">
                <div
                    data-testid="Credential-List-Container"
                    className="container mx-auto"
                >
                    <CredentialList state={state} />
                </div>
            </div>
        </div>
    );
};
