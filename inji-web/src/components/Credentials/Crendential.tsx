import React, {useState} from "react";
import {getObjectForCurrentLanguage} from "../../utils/i18n";
import {ItemBox} from "../Common/ItemBox";
import {generateCodeChallenge, generateRandomString} from "../../utils/misc";
import {addNewSession} from "../../utils/sessions";
import {useSelector} from "react-redux";
import {api} from "../../utils/api";
import {CredentialProps} from "../../types/components";
import {
    AuthServerWellknownObject,
    CodeChallengeObject,
    CredentialConfigurationObject
} from "../../types/data";
import {RootState} from "../../types/redux";
import {DataShareExpiryModal} from "../../modals/DataShareExpiryModal";
import {useTranslation} from "react-i18next";

export const Credential: React.FC<CredentialProps> = (props) => {
    const {t} = useTranslation("CredentialsPage");
    const authServerWellknownResponse: AuthServerWellknownObject = useSelector(
        (state: RootState) => state.credentials.credentials.authorization
    );
    const selectedIssuer = useSelector((state: RootState) => state.issuers.selected_issuer);
    const [credentialExpiry, setCredentialExpiry] = useState<boolean>(false);
    const language = useSelector((state: RootState) => state.common.language);
    const filteredCredentialConfig: CredentialConfigurationObject =
        props.credentialWellknown.credential_configurations_supported[
            props.credentialId
        ];
    const credentialObject = getObjectForCurrentLanguage(
        filteredCredentialConfig.display,
        language
    );
    const vcStorageExpiryLimitInTimes = useSelector(
        (state: RootState) => state.common.vcStorageExpiryLimitInTimes
    );

    const onSuccess = async (
        defaultVCStorageExpiryLimit: number = vcStorageExpiryLimitInTimes
    ) => {
        const state = generateRandomString();
        const code_challenge: CodeChallengeObject =
            generateCodeChallenge(state);
        addNewSession({
            selectedIssuer: selectedIssuer,
            certificateId: props.credentialId,
            codeVerifier: state,
            vcStorageExpiryLimitInTimes: isNaN(defaultVCStorageExpiryLimit)
                ? vcStorageExpiryLimitInTimes
                : defaultVCStorageExpiryLimit,
            state: state
        });
        if (
            validateIfAuthServerSupportRequiredGrantTypes(
                authServerWellknownResponse
            )
        ) {
            window.open(
                api.authorization(
                    selectedIssuer,
                    filteredCredentialConfig,
                    state,
                    code_challenge,
                    authServerWellknownResponse["authorization_endpoint"]
                ),
                "_self",
                "noopener"
            );
        } else {
            props.setErrorObj({
                code: "errors.authorizationGrantTypeNotSupportedByWallet.code",
                message:
                    "errors.authorizationGrantTypeNotSupportedByWallet.message"
            });
        }
    };

    const validateIfAuthServerSupportRequiredGrantTypes = (
        authorizationServerWellknown: AuthServerWellknownObject
    ) => {
        const supportedGrantTypes = ["authorization_code"];
        let authorizationServerGrantTypes;

        if (authorizationServerWellknown?.grant_types_supported) {
            authorizationServerGrantTypes =
                authorizationServerWellknown["grant_types_supported"];
            return authorizationServerGrantTypes.some((grantType: string) =>
                supportedGrantTypes.includes(grantType)
            );
        }
        return false;
    };

    return (
        <React.Fragment>
            <ItemBox
                index={props.index}
                url={credentialObject.logo.url}
                title={credentialObject.name}
                onClick={() => {
                    selectedIssuer.qr_code_type ===
                    "OnlineSharing"
                        ? setCredentialExpiry(true)
                        : onSuccess(-1);
                }}
            />
            {credentialExpiry && (
                <DataShareExpiryModal
                    onCancel={() => setCredentialExpiry(false)}
                    onSuccess={onSuccess}
                    credentialName={credentialObject.name}
                    credentialLogo={credentialObject.logo.url}
                />
            )}
        </React.Fragment>
    );
};
