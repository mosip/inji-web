import React from "react";
import {getObjectForCurrentLanguage} from "../../utils/i18n";
import {ItemBox} from "../Common/ItemBox";
import {generateCodeChallenge, generateRandomString} from "../../utils/misc";
import {addNewSession} from "../../utils/sessions";
import {useSelector} from "react-redux";
import {api} from "../../utils/api";
import {CredentialProps} from "../../types/components";
import {CodeChallengeObject, CredentialConfigurationObject} from "../../types/data";
import {RootState} from "../../types/redux";

export const Credential: React.FC<CredentialProps> = (props) => {
    const selectedIssuer = useSelector((state: RootState) => state.issuers);
    const language = useSelector((state: RootState) => state.common.language);
    const filteredCredentialConfig: CredentialConfigurationObject = props.credentialWellknown.credential_configurations_supported[props.credentialId];
    const credentialObject = getObjectForCurrentLanguage(filteredCredentialConfig.display, language);
    return <ItemBox index={props.index}
                    url={credentialObject.logo.url}
                    title={credentialObject.name}
                    onClick={() => {
                        const state = generateRandomString();
                        const code_challenge: CodeChallengeObject = generateCodeChallenge(state);
                        window.open(api.authorization(selectedIssuer.selected_issuer, props.credentialWellknown, filteredCredentialConfig, state, code_challenge), '_self', 'noopener');
                        addNewSession({
                            selectedIssuer: selectedIssuer.selected_issuer,
                            certificateId: props.credentialId,
                            codeVerifier: state,
                            state: state,
                        });
                    }}
    />
}

