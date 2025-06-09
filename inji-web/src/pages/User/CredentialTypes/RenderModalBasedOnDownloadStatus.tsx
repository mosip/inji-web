import {RequestStatus} from "../../../hooks/useFetch";
import React from "react";
import {DownloadResult} from "../../../components/Redirection/DownloadResult";
import {CredentialTypesPageStyles} from "./CredentialTypesPageStyles";
import {CredentialList} from "../../../components/Credentials/CredentialList";
import {useTranslation} from "react-i18next";

interface RenderModalProps {
    downloadStatus: RequestStatus,
    state: RequestStatus
}

export const RenderModalBasedOnDownloadStatus: React.FC<RenderModalProps> = (props) => {
    const {t} = useTranslation('CredentialTypesPage');
    return (
        <>
            {props.downloadStatus === RequestStatus.LOADING &&
                <DownloadResult
                    title={t('CredentialTypesPage:download.loading.header')}
                    state={RequestStatus.LOADING}
                />

            }
            {
                props.downloadStatus === RequestStatus.ERROR &&
                <DownloadResult
                    title={t('CredentialTypesPage:download.error.header')}
                    subTitle={t('CredentialTypesPage:download.error.subHeader')}
                    state={RequestStatus.ERROR}
                />
            }
            {
                props.downloadStatus == null &&
                <div className={CredentialTypesPageStyles.contentContainer}>
                    <div
                        data-testid="Credential-List-Container"
                        className={CredentialTypesPageStyles.credentialListContainer}
                    >
                        <CredentialList state={props.state}/>
                    </div>
                </div>
            }
        </>
    );
}