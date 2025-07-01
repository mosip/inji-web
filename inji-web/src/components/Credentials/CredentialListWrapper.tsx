import React from "react";
import {CredentialList} from "./CredentialList";
import {RequestStatus} from "../../utils/constants";

interface CredentialListWrapperProps {
    state: RequestStatus;
    className: string;
}

export const CredentialListWrapper: React.FC<CredentialListWrapperProps> = ({state, className}) => {
    return (
        <div
            data-testid="Credential-List-Container"
            className={className}
        >
            <CredentialList state={state}/>
        </div>
    );
};