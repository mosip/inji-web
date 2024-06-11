import React from "react";
import {Credential} from "./Crendential";
import {useSelector} from "react-redux";
import {CredentialWellknownObject} from "../../types/data";
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

    if (state === RequestStatus.ERROR || !credentials?.filtered_credentials || (credentials?.filtered_credentials && credentials?.filtered_credentials.length === 0)) {
        return <div>
                <HeaderTile content={t("containerHeading")}/>
                <EmptyListContainer content={t("emptyContainerContent")}/>
            </div>
    }

    return <React.Fragment>
            <HeaderTile content={t("containerHeading")}/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {credentials?.filtered_credentials && credentials?.filtered_credentials.map((credential: CredentialWellknownObject, index: number) => (
                    <Credential credential={credential} key={index} index={index}/>
                ))}
            </div>
    </React.Fragment>
}


