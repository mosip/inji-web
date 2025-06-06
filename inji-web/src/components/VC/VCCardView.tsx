import {WalletCredential} from "../../types/data";
import {RxDotsHorizontal} from "react-icons/rx";
import {VCStyles} from "./VCStyles";
import React from "react";
import DownloadIcon from "../../assets/Download.svg"
import {Clickable} from "../Common/Clickable.tsx";

export function VCCardView(props: Readonly<{
    onPreview: (credential: WalletCredential) => void,
    onDownload: (credential: WalletCredential) => void,
    credential: WalletCredential
}>) {
    const handlePreview = () => {
        props.onPreview(props.credential);
    }

    const handleDownload = () => {
        props.onDownload(props.credential);
    }

    return (
        <Clickable onClick={handlePreview} testId={"vc-card-view"} className={VCStyles.cardView.container}>
            <div className={"flex items-center gap-6"}>
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
            <div className={"flex flex-row gap-2"}>
                <img
                    onClick={handleDownload}
                    data-testid={"icon-download"}
                    src={DownloadIcon}
                    alt={"icon-download"}
                    className={"h-25 w-25"}
                />
                <RxDotsHorizontal size={20} color={"#707070"}/>
            </div>
        </Clickable>
    );
}