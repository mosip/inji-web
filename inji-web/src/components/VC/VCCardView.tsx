import {WalletCredential} from "../../types/data";
import {RxDotsHorizontal} from "react-icons/rx";
import {VCStyles} from "./VCStyles";
import React, {useState} from "react";
import DownloadIcon from "../../assets/Download.svg"
import {Clickable} from "../Common/Clickable";
import {api} from "../../utils/api";
import {downloadCredentialPDF} from "../../utils/misc";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {toast} from "react-toastify";
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {Modal} from "../../modals/Modal";
import {SolidButton} from "../Common/Buttons/SolidButton";

function VCDetailView(props: { previewContent: string, onClick: () => void }) {
    return (
        <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
            <Viewer fileUrl={props.previewContent}/>
        </Worker>
    )
}


export function VCCardView(props: Readonly<{
    credential: WalletCredential
}>) {
    const language = useSelector((state: RootState) => state.common.language);
    const [error, setError] = useState<string>()
    const [previewContent, setPreviewContent] = useState<string>("");


    if (error) {
        toast.error("Download failed. Please try again later.");
    }

    const preview = async () => {
        console.log("Fetching credential preview for:", props.credential.credentialId);
        try {
            const response = await fetch(
                api.fetchWalletCredentialPreview.url(props.credential.credentialId),
                {
                    method:
                        api.fetchWalletCredentialPreview.methodType === 0
                            ? "GET"
                            : "POST",
                    headers: api.fetchWalletCredentialPreview.headers(language),
                    credentials: api.fetchWalletCredentialPreview.credentials
                }
            );
            //
            const pdfContent = await response.blob();

            const pdfUrl = URL.createObjectURL(pdfContent);
            setPreviewContent(pdfUrl)
        } catch (error) {
            console.error("Failed to download credential PDF:", error);
            setError("downloadError");
        }
    }

    const download = async (mouseEvent : React.MouseEvent) => {
        mouseEvent.stopPropagation()
        console.log("Downloading credential PDF for:", props.credential.credentialId);
        try {
            const response = await fetch(
                api.fetchWalletCredentialPreview.url(props.credential.credentialId),
                {
                    method:
                        api.fetchWalletCredentialPreview.methodType === 0
                            ? "GET"
                            : "POST",
                    headers: api.fetchWalletCredentialPreview.headers(language),
                    credentials: api.fetchWalletCredentialPreview.credentials
                }
            );
            //
            const pdfContent = await response.blob();

            const disposition = response.headers.get("Content-Disposition");
            const fileNameMatch = /filename="(.+)"/.exec(disposition ?? "");
            const fileName = fileNameMatch?.[1] || "download.pdf";

            await downloadCredentialPDF(pdfContent, fileName);
        } catch (error) {
            console.error("Failed to download credential PDF:", error);
            setError("downloadError");
        }
    }

    const clearPreview = () => {
        setPreviewContent("");
    }

    return (
        <Clickable onClick={preview} testId={"vc-card-view"} className={VCStyles.cardView.container}>
            <Modal isOpen={!!previewContent}
                   onClose={clearPreview}
                   action={<SolidButton testId={"btn-download"} title={"download"} onClick={download}/>}
                   title={props.credential.credentialTypeDisplayName}
            >
                <VCDetailView
                    previewContent={previewContent}
                    onClick={clearPreview}
                />
            </Modal>

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
                    onClick={download}
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