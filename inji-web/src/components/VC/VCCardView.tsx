import {WalletCredential} from "../../types/data";
import {VCStyles} from "./VCStyles";

export function VCCardView(props: Readonly<{
    onClick: (credential: WalletCredential) => void,
    credential: WalletCredential
}>) {
    return (
        <div
            className={VCStyles.cardView.container}
            onClick={() => props.onClick(props.credential)}
            data-testid="vc-card-view"
            role={"menuitem"}
            tabIndex={0}
            onKeyDown={() => props.onClick(props.credential)}
        >
            <img
                data-testid="issuer-logo"
                src={props.credential.credentialTypeLogo}
                alt="Credential Type Logo"
                className={VCStyles.cardView.logo}
            />
            <span
                className={VCStyles.cardView.credentialName}
                data-testid="credential-type-display-name"
            >
                {props.credential.credentialTypeDisplayName}
            </span>
        </div>
    );
}