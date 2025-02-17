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
import {CredentialConfigurationObject} from "../../types/data";
import {defaultLanguage} from "../../utils/i18n";

export const CredentialList: React.FC<CredentialListProps> = ({state}) => {
    const [errorObj, setErrorObj] = useState({
        code: "",
        message: ""
    });
    const selectedLanguage = useSelector(
        (state: RootState) => state.common.language
    );

    const credentials = useSelector((state: RootState) => state.credentials);

    const filterCredentialsBySelectedOrDefaultLanguage = () => {
        const missingLanguageSupport: string[] = [];

        const filteredCredentialsList = Object.entries(
            credentials?.filtered_credentials
                ?.credential_configurations_supported || {}
        ).filter(([credentialType, credential]) => {
            const {display, credential_definition} =
                credential as CredentialConfigurationObject; // Destructure
            const hasMatchingDisplay = display?.some(
                ({locale}) =>
                    locale === selectedLanguage || locale === defaultLanguage
            );

            if (!hasMatchingDisplay) {
                missingLanguageSupport.push(credential_definition.type[1]);
            }
            
            return hasMatchingDisplay;
        });

        if (missingLanguageSupport.length) {
            console.error(
                `Language support missing for these credential types of issuer: ${missingLanguageSupport.join(
                    ", "
                )}`
            );
        }
        return Object.fromEntries(filteredCredentialsList);
    };

    const filteredCredentialsWithLangSupport =
        filterCredentialsBySelectedOrDefaultLanguage();

    const {t} = useTranslation("CredentialsPage");

    if (state === RequestStatus.LOADING) {
        return <SpinningLoader />;
    }

    if (
        state === RequestStatus.ERROR ||
        Object.keys(filteredCredentialsWithLangSupport).length == 0 ||
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

    if (errorObj.code) {
        return (
            <DownloadResult
                title={t(errorObj.code)}
                subTitle={t(errorObj.message)}
                state={RequestStatus.ERROR}
            />
        );
    }

    return (
        <>
            <HeaderTile
                content={t("containerHeading")}
                subContent={t("containerSubHeading")}
            />
            <div className="flex flex-wrap gap-3 p-4 pb-20 justify-start">
                {Object.keys(filteredCredentialsWithLangSupport).map(
                    (credentialId: string, index: number) => (
                        <Credential
                            credentialId={credentialId}
                            credentialWellknown={
                                credentials?.filtered_credentials
                                    ?.credential_configurations_supported[
                                    credentialId
                                ]
                            }
                            key={index}
                            index={index}
                            setErrorObj={setErrorObj}
                        />
                    )
                )}
            </div>
        </>
    );
};
