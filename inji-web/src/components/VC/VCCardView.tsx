import {WalletCredential} from "../../types/data";

export function VCCardView(props: Readonly<{
    onClick: (credential: WalletCredential) => void,
    credential: WalletCredential
}>) {
    return (
        <div
            className="bg-iw-tileBackground grid grid-cols-[1fr_auto_2fr] gap-4 items-center shadow hover:shadow-lg hover:scale-105 hover:shadow-iw-selectedShadow p-4 m-2 rounded-md cursor-pointer"
            onClick={() => props.onClick(props.credential)}
            datatest-id="vc-card-vew"
            tabIndex={0}
            role="menuitem"
            onKeyDown={() => props.onClick(props.credential)}
        >
            <img
                data-testid="issuer-logo"
                src={props.credential.credentialTypeLogo}
                alt="Credential Type Logo"
                className="w-20 h-20"
            />
            <span
                className="text-sm font-semibold text-iw-title"
                data-testid="credential-type-display-name"
            >
                {props.credential.credentialTypeDisplayName}
            </span>
        </div>
    );
}