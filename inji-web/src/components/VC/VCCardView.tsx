import {WalletCredential} from "../../types/data";

export function VCCardView(props: { onClick: (credential: WalletCredential) => void, credential: WalletCredential }) {
    return <div

        className="bg-iw-tileBackground flex flex-col shadow hover:shadow-lg hover:scale-105 hover:shadow-iw-selectedShadow p-5 m-4 rounded-md cursor-pointer items-center"
        tabIndex={0}
        role="menuitem"
        onClick={()=>props.onClick(props.credential)}
        style={{
            width: "85%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "1rem"
        }}
    >
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%"
            }}
        >
            <img
                data-testid="ItemBox-Logo"
                src={props.credential.credentialTypeLogo}
                alt="Credential Type Logo"
                className="w-20 h-20"
            />
            <span
                className="text-sm font-semibold text-iw-title"
                data-testid="ItemBox-Text"
            >{props.credential.credentialType}</span>
        </div>

        <span className="text-sm font-semibold text-gray-500 mt-2">{props.credential.issuerName}</span>
    </div>;
}