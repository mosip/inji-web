import {ApiRequest, WalletCredential} from "../../types/data";
import {VCStyles} from "./VCStyles";
import React, {useEffect, useState} from "react";
import {Clickable} from "../Common/Clickable";
import {api, MethodType} from "../../utils/api";
import {downloadCredentialPDF} from "../../utils/misc";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {EllipsisMenu} from "../Common/Menu/EllipsisMenu";
import {ConfirmationModal} from "../../modals/ConfirmationModal";
import {useTranslation} from "react-i18next";
import {VCDetailView} from "./VCDetailView";
import {DownloadIcon} from "../Common/Icons/DownloadIcon";
import {HTTP_STATUS_CODES, ROUTES} from "../../utils/constants";
import {useNavigate} from "react-router-dom";
import {RiDeleteBin6Line} from "react-icons/ri";
import {BsBoxArrowRight} from "react-icons/bs";
import {showToast} from "../Common/toast/ToastWrapper";

export function VCCardView(props: Readonly<{
    credential: WalletCredential,
    refreshCredentials: () => void
}>) {
    const language = useSelector((state: RootState) => state.common.language);
    const [error, setError] = useState<string>()
    const [previewContent, setPreviewContent] = useState<string>("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const {t} = useTranslation('StoredCards', {
        keyPrefix: "cardView"
    })
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            showToast({
                type: "error",
                message: t(`error.${error}`),
                testId: error === "downloadError" ? "download-failure" : "delete-failure"
            })
            setError("")
        }
    }, [error, t])

    const executeCredentialApiRequest = async (
        apiCall: ApiRequest,
        onSuccess: (response: Response) => Promise<void>,
        errorType: string = "downloadError"
    ) => {
        try {
            const response = await fetch(
                apiCall.url(props.credential.credentialId),
                {
                    method: MethodType[apiCall.methodType],
                    headers: apiCall.headers(language),
                    credentials: apiCall.credentials
                }
            );

            if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
                console.error("Unauthorized access - redirecting to root page");
                navigate(ROUTES.ROOT);
                return;
            }

            if (!response.ok) {
                console.error(`Failed to fetch request, got ${errorType} with response - `, response);
                setError(errorType);
                return;
            }

            await onSuccess(response);
        } catch (error) {
            console.error("API request failed:", error);
            setError(errorType);
        }
    };

    const preview = async () => {
        console.info("Fetching credential preview for:", props.credential.credentialId);
        await executeCredentialApiRequest(
            api.fetchWalletCredentialPreview,
            async (response) => {
                const pdfContent = await response.blob();
                const pdfUrl = URL.createObjectURL(pdfContent);
                console.info("Credential preview fetched successfully");
                setPreviewContent(pdfUrl);
            }
        );
    };

    const handleDownload = async (event: React.MouseEvent) => {
        event.stopPropagation();
        await download();
    };

    const download = async () => {
        console.info("Downloading credential PDF for:", props.credential.credentialId);
        await executeCredentialApiRequest(
            api.downloadWalletCredentialPdf,
            async (response) => {
                const pdfContent = await response.blob();
                const disposition = response.headers.get("Content-Disposition");
                const fileNameMatch = /filename="(.+)"/.exec(disposition ?? "");
                const fileName = fileNameMatch?.[1] ?? "download.pdf";

                await downloadCredentialPDF(pdfContent, fileName);
                console.info("Credential PDF downloaded successfully");
            }
        );
    };

    const handleDelete = () => {
        setShowDeleteConfirmation(true)
    }

    const deleteCredential = async () => {
        console.debug("Delete credential clicked for:", props.credential.credentialId);
        try {
            await executeCredentialApiRequest(
                api.deleteWalletCredential,
                async () => {
                    console.info("Credential deleted successfully.");
                    props.refreshCredentials();
                },
                "deleteError"
            );
        } catch (error) {
            console.error("Failed to delete credential:", error);
            setError("deleteError");
        } finally {
            setShowDeleteConfirmation(false);
        }
    };

    const clearPreview = () => {
        setPreviewContent("");
    }

    return (
        <Clickable onClick={preview} testId={"vc-card-view"}
                   className={VCStyles.cardView.container}>
            <VCDetailView previewContent={previewContent} onClose={clearPreview} onDownload={download}
                          credential={props.credential}/>
            {
                showDeleteConfirmation && (
                    <ConfirmationModal
                        testId={"delete-card"}
                        title={t("delete.confirmation.title")}
                        message={t("delete.confirmation.message")}
                        onConfirm={deleteCredential}
                        onCancel={() => setShowDeleteConfirmation(false)}
                    />
                )
            }

            <div className={VCStyles.cardView.contentsContainer}>
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
            <div className={VCStyles.cardView.actionsContainer}>
                <DownloadIcon onClick={handleDownload}
                              testId={"icon-download"}
                              style={{color: "var(--iw-color-grayMedium)"}}
                              className={VCStyles.cardView.downloadIcon}/>
                <EllipsisMenu
                    testId={"mini-view-card"}
                    menuItems={[
                        {
                            label: t('menu.view'),
                            onClick: preview,
                            id: "view",
                            icon: <BsBoxArrowRight data-testid={"icon-view"} size={18}
                                                   className={VCStyles.cardView.menuIcon}/>
                        },
                        {
                            label: t('download'),
                            onClick: download,
                            id: "download",
                            icon: <DownloadIcon testId={"icon-download"}/>
                        },
                        {
                            label: t('menu.delete'),
                            onClick: handleDelete,
                            id: "delete",
                            icon: <RiDeleteBin6Line data-testid={"icon-delete"} size={18}
                                                    className={VCStyles.cardView.menuIcon}
                                                    color={"var(--iw-color-red)"}/>,
                            color: "var(--iw-color-red)"
                        },
                    ]}
                />
            </div>
        </Clickable>
    )
        ;
}