import React, {useState} from "react";
import {Credential} from "./Crendential";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {EmptyListContainer} from "../Common/EmptyListContainer";
import {useTranslation} from "react-i18next";
import {RequestStatus} from "../../hooks/useFetch";
import {SpinningLoader} from "../Common/SpinningLoader";
import {CredentialListProps} from "../../types/components";
import {HeaderTile} from "../Common/HeaderTile";
import {DownloadResult} from "../Redirection/DownloadResult";
import {toast} from "react-toastify";

export const CredentialList: React.FC<CredentialListProps> = ({state}) => {
    const [errorObj, setErrorObj] = useState({
        code: "",
        message: ""
    });
    const [toastError, setToastError] = useState("");
    const credentials = useSelector((state: RootState) => state.credentials);
    const {t} = useTranslation("CredentialsPage");

    if (state === RequestStatus.LOADING) {
        return <SpinningLoader />;
    }

    if (toastError !== "") {
        toast.error(t("errorContent"), {onClose: () => setToastError("")});
    }

    if (
        state === RequestStatus.ERROR ||
        !credentials?.filtered_credentials
            ?.credential_configurations_supported ||
        (credentials?.filtered_credentials
            ?.credential_configurations_supported &&
            credentials?.filtered_credentials
                ?.credential_configurations_supported.length === 0)
    ) {
        return (
            <div>
                <HeaderTile
                    content={t("containerHeading")}
                    subContent={t("containerSubHeading")}
                />
                <EmptyListContainer content={t("emptyContainerContent")} />
            </div>
        );
    }

    return (
        <React.Fragment>
            {errorObj.code === "" ? (
                <React.Fragment>
                    <HeaderTile
                        content={t("containerHeading")}
                        subContent={t("containerSubHeading")}
                    />
                    <div className="flex flex-wrap gap-3 p-4 pb-20 justify-start">
                        {credentials?.filtered_credentials &&
                            Object.keys(
                                credentials?.filtered_credentials
                                    ?.credential_configurations_supported
                            ).map((credentialId: string, index: number) => (
                                <Credential
                                    credentialId={credentialId}
                                    credentialWellknown={
                                        credentials?.filtered_credentials
                                    }
                                    key={index}
                                    index={index}
                                    setErrorObj={setErrorObj}
                                    setToastError={setToastError}
                                />
                            ))}
                    </div>
                </React.Fragment>
            ) : (
                <DownloadResult
                    title={t(errorObj.code)}
                    subTitle={t(errorObj.message)}
                    state={RequestStatus.ERROR}
                />
            )}
        </React.Fragment>
    );
};
