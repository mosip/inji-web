import {RequestStatus} from "../../../hooks/useFetch";
import React from "react";
import {DownloadResult} from "../../../components/Redirection/DownloadResult";
import {CredentialTypesPageStyles} from "./CredentialTypesPageStyles";
import {CredentialList} from "../../../components/Credentials/CredentialList";
import {useTranslation} from "react-i18next";

interface RenderModalProps {
    downloadStatus: RequestStatus | null,
    state: RequestStatus
}

    
//TODO here check if the div with testId "Credential-List-Container" can be moved to credentialList component
export const RenderModalBasedOnDownloadStatus: React.FC<RenderModalProps> = (props) => {
    const {t} = useTranslation('CredentialTypesPage');

    if (props.downloadStatus === RequestStatus.LOADING) {
        return <DownloadResult
            title={t('CredentialTypesPage:download.loading.header')}
            state={RequestStatus.LOADING}
        />
    }

    if (props.downloadStatus === RequestStatus.ERROR) {
        return <DownloadResult
            title={t('CredentialTypesPage:download.error.header')}
            subTitle={t('CredentialTypesPage:download.error.subHeader')}
            state={RequestStatus.ERROR}
        />
    }

    return (
        <div className={CredentialTypesPageStyles.contentContainer}>
            <div
                data-testid="Credential-List-Container"
                className={CredentialTypesPageStyles.credentialListContainer}
            >
                <CredentialList state={props.state}/>
            </div>
        </div>
    );
}