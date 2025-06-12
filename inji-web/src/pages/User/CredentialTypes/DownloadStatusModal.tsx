import {RequestStatus} from "../../../hooks/useFetch";
import React from "react";
import {DownloadResult} from "../../../components/Redirection/DownloadResult";
import {CredentialTypesPageStyles} from "./CredentialTypesPageStyles";
import {useTranslation} from "react-i18next";
import {CredentialListWrapper} from "../../../components/Credentials/CredentialListWrapper";

interface DownloadStatusModalProps {
    downloadStatus: RequestStatus | null;
    state: RequestStatus;
}

export const DownloadStatusModal: React.FC<DownloadStatusModalProps> = (
    props
) => {
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
            <CredentialListWrapper
                state={props.state}
                className={CredentialTypesPageStyles.credentialListContainer}
            />
        </div>
    );
};
