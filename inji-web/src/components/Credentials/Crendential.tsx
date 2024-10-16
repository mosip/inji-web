import React, {useState} from "react";
import {getObjectForCurrentLanguage} from "../../utils/i18n";
import {ItemBox} from "../Common/ItemBox";
import {generateCodeChallenge, generateRandomString} from "../../utils/misc";
import {addNewSession} from "../../utils/sessions";
import {useSelector} from "react-redux";
import {api} from "../../utils/api";
import {CredentialProps} from "../../types/components";
import {CodeChallengeObject, CredentialConfigurationObject} from "../../types/data";
import {RootState} from "../../types/redux";
import {DataShareExpiryModal} from "../../modals/DataShareExpiryModal";
import {storage} from "../../utils/storage";

export const Credential: React.FC<CredentialProps> = (props) => {
    const selectedIssuer = useSelector((state: RootState) => state.issuers);
    const [credentialExpiry, setCredentialExpiry] = useState<boolean>(false);
    const language = useSelector((state: RootState) => state.common.language);
    const filteredCredentialConfig: CredentialConfigurationObject = props.credentialWellknown.credential_configurations_supported[props.credentialId];
    const credentialObject = getObjectForCurrentLanguage(filteredCredentialConfig.display, language);
    const vcStorageExpiryLimitInTimes = useSelector((state: RootState) => state.common.vcStorageExpiryLimitInTimes);

    const onSuccess = () => {
        const state = generateRandomString();
        const code_challenge: CodeChallengeObject = generateCodeChallenge(state);
        window.open(api.authorization(selectedIssuer.selected_issuer, props.credentialWellknown, filteredCredentialConfig, state, code_challenge), '_self', 'noopener');
        addNewSession({
            selectedIssuer: selectedIssuer.selected_issuer,
            certificateId: props.credentialId,
            codeVerifier: state,
            vcStorageExpiryLimitInTimes: vcStorageExpiryLimitInTimes ?? 1,
            state: state,
        });
    }

    return <React.Fragment>
        <ItemBox index={props.index}
                 url={credentialObject.logo.url}
                 title={credentialObject.name}
                 onClick={() => setCredentialExpiry(true)}/>
                        { credentialExpiry &&
                            <DataShareExpiryModal onCancel={() => setCredentialExpiry(false)}
                                                  onSuccess={onSuccess}
                                                  credentialName={credentialObject.name}
                                                  credentialLogo={credentialObject.logo.url}/>
                        }
    </React.Fragment>
}

