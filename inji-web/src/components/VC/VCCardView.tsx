import {WalletCredential} from "../../types/data";
import {VCStyles} from "./VCStyles";
import React, {useEffect, useState} from "react";
import {Clickable} from "../Common/Clickable";
import {api} from "../../utils/api";
import {downloadCredentialPDF} from "../../utils/misc";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {toast} from "react-toastify";
import {EllipsisMenu} from "../Common/Menu/EllipsisMenu";
import {ConfirmationModal} from "../../modals/ConfirmationModal";
import {useTranslation} from "react-i18next";
import {VCDetailView} from "./VCDetailView";
import {DownloadIcon} from "../Common/Icons/DownloadIcon";
import {ROUTES} from "../../utils/constants";
import {useNavigate} from "react-router-dom";

export function VCCardView(props: Readonly<{
    credential: WalletCredential,
    refreshCredentials: () => void
}>) {
    const language = useSelector((state: RootState) => state.common.language);
    const [error, setError] = useState<string>()
    const [previewContent, setPreviewContent] = useState<string>("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const {t} = useTranslation('StoredCards')
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            toast.error(t(`error.${error}`));
            setError("")
        }
    }, [error, t])

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
            if (response.status === 401) {
                console.error("Unauthorized access - redirecting to login");
                // Redirect to root page if unauthorized
                navigate(ROUTES.ROOT);
                return;
            }

            if (!response.ok) {
                console.error("Failed to fetch credential preview:", response);
                setError("downloadError");
                return
            }

            const pdfContent = await response.blob();

            const pdfUrl = URL.createObjectURL(pdfContent);
            console.log("Credential preview fetched successfully:", pdfUrl);
            setPreviewContent(pdfUrl)
        } catch (error) {
            console.error("Failed to download credential PDF:", error);
            setError("downloadError");
        }
    }

    const handleDownload = async (event: React.MouseEvent) => {
        event.stopPropagation()
        await download();
    }

    const download = async () => {
        console.log("Downloading credential PDF for:", props.credential.credentialId);
        try {
            const response = await fetch(
                api.downloadWalletCredentialPdf.url(props.credential.credentialId),
                {
                    method:
                        api.downloadWalletCredentialPdf.methodType === 0
                            ? "GET"
                            : "POST",
                    headers: api.downloadWalletCredentialPdf.headers(language),
                    credentials: api.downloadWalletCredentialPdf.credentials
                }
            );

            if (response.status === 401) {
                console.error("Unauthorized access - redirecting to login");
                // Redirect to root page if unauthorized
                navigate(ROUTES.ROOT);
                return;
            }

            if (!response.ok) {
                console.error("Failed to fetch credential preview:", response);
                setError("downloadError");
                return
            }

            const pdfContent = await response.blob();

            const disposition = response.headers.get("Content-Disposition");
            const fileNameMatch = /filename="(.+)"/.exec(disposition ?? "");
            const fileName = fileNameMatch?.[1] ?? "download.pdf";

            await downloadCredentialPDF(pdfContent, fileName);
        } catch (error) {
            console.error("Failed to download credential PDF:", error);
            setError("downloadError");
        }
    }

    const handleDelete = () => {
        setShowDeleteConfirmation(true)
    }

    const deleteCredential = async () => {
        console.debug("Delete credential clicked for:", props.credential.credentialId);
        try {
            const response = await fetch(
                api.deleteWalletCredential.url(props.credential.credentialId),
                {
                    // TODO: Get methodType from api.deleteWalletCredential.methodType, make sure the ApiRequest is sending methodType as a string and not enum
                    method: "DELETE",
                    headers: api.deleteWalletCredential.headers(),
                    credentials: api.deleteWalletCredential.credentials
                }
            );

            if (response.status === 401) {
                console.error("Unauthorized access - redirecting to login");
                // Redirect to root page if unauthorized
                navigate(ROUTES.ROOT);
                return;
            }

            if (!response.ok) {
                console.error("Failed to fetch credential preview:", response);
                setError("deleteError");
                return
            }
            console.info("Credential deleted successfully.");
            props.refreshCredentials()
        } catch (error) {
            console.error("Failed to delete credential:", error);
            setError("deleteError");
        } finally {
            setShowDeleteConfirmation(false)
        }
    }

    const clearPreview = () => {
        setPreviewContent("");
    }

    return (
        <Clickable onClick={preview} testId={"vc-card-view"}
                   className={"bg-iw-tileBackground grid grid-cols-[2.5fr_0.5fr] items-center shadow hover:shadow-lg hover:scale-105 hover:shadow-iw-selectedShadow p-4 m-2 rounded-md cursor-pointer"}>
            <VCDetailView previewContent={previewContent} onClose={clearPreview} onDownload={download}
                          credential={props.credential}/>
            {
                showDeleteConfirmation && (
                    <ConfirmationModal
                        title={"Delete Card!"}
                        message={"Are you sure you want to delete this card?"}
                        onConfirm={deleteCredential}
                        onCancel={() => setShowDeleteConfirmation(false)}
                    />
                )
            }

            <div className={"flex items-center overflow-scroll gap-6 sm:gap-4"}>
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
            <div className={"flex flex-row items-center flex-shrink-0 gap-0.2"}>
                <DownloadIcon onClick={handleDownload}
                              testId={"icon-download"}
                              style={{color: "#707070"}}
                              className={"h-25 w-25"}/>
                <EllipsisMenu
                    testId={"mini-view-card"}
                    menuItems={[
                        {label: "View", onClick: preview, id: "view"},
                        {label: "Download", onClick: download, id: "download"},
                        {label: "Delete", onClick: handleDelete, id: "delete"},
                    ]}
                />
            </div>
        </Clickable>
    )
        ;
}