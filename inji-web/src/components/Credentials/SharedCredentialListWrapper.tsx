import React from "react";
import { PresentationCredential } from "../types/components";

type SharedCredentialListWrapperProps = {
    credentials: PresentationCredential[];
};

export const SharedCredentialListWrapper: React.FC<SharedCredentialListWrapperProps> = ({
                                                                                            credentials,
                                                                                        }) => {
    return (
        <div
            className="w-[425px] h-[245px] mx-auto my-0 overflow-y-auto rounded-lg bg-[var(--iw-color-shieldSuccessShadow)] py-8 sm:w-[425px] sm:h-[245px] w-full max-w-[425px]"
            data-testid="shared-credentials-container"
        >
            <div className="flex flex-col items-center gap-7">
                {credentials.map((cred, idx) => (
                    <div
                        key={cred.credentialId}
                        id={`item-${cred.credentialTypeDisplayName}-${idx}`}
                        data-testid={`item-${cred.credentialTypeDisplayName}-${idx}`}
                        className="flex items-center w-[388px] h-[78px] bg-white rounded-lg shadow px-4 flex-shrink-0 sm:w-[388px] w-[90%]"
                    >
                        <img
                            src={cred.credentialTypeLogo}
                            alt={cred.credentialTypeDisplayName}
                            className="w-[50px] h-[50px] mr-4 rounded"
                        />
                        <span className="truncate text-sm sm:text-base font-medium">
          {cred.credentialTypeDisplayName}
        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
