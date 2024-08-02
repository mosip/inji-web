import React from "react";
import {Credential} from "./Crendential";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {EmptyListContainer} from "../Common/EmptyListContainer";
import {useTranslation} from "react-i18next";
import {RequestStatus} from "../../hooks/useFetch";
import {SpinningLoader} from "../Common/SpinningLoader";
import {CredentialListProps} from "../../types/components";
import {HeaderTile} from "../Common/HeaderTile";

export const CredentialList: React.FC<CredentialListProps> = ({state}) => {

    const credentials = useSelector((state: RootState) => state.credentials);
    const {t} = useTranslation("CredentialsPage");

    if (state === RequestStatus.LOADING) {
        return <SpinningLoader />
    }

    if (state === RequestStatus.ERROR ||
        !credentials?.filtered_credentials?.credential_configurations_supported ||
        (credentials?.filtered_credentials?.credential_configurations_supported &&
            credentials?.filtered_credentials?.credential_configurations_supported.length === 0 )
    ) {
        return <div>
                <HeaderTile content={t("containerHeading")}/>
                <EmptyListContainer content={t("emptyContainerContent")}/>
            </div>
    }

    return <React.Fragment>
            <HeaderTile content={t("containerHeading")}/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {credentials?.filtered_credentials && Object.keys(credentials?.filtered_credentials?.credential_configurations_supported).map((credentialId: string, index: number) => (
                    <Credential credentialId={credentialId} credentialWellknown={credentials?.filtered_credentials} key={index} index={index}/>
                ))}
            </div>
    </React.Fragment>
}


