import {useEffect, useState} from "react";
import {RootState} from "../../../types/redux";
import {useSelector} from "react-redux";
import {api} from "../../../utils/api";
import {WalletCredential} from "../../../types/data";
import {DownloadResult} from "../../../components/Redirection/DownloadResult";
import {RequestStatus} from "../../../hooks/useFetch";
import {downloadCredentialPDF} from "../../../utils/misc";
import {Worker, Viewer} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const WalletCredentialsPage = () => {
    const [credentials, setCredentials] = useState<WalletCredential[]>([]);
    const [loading, setLoading] = useState(true);
    const language = useSelector((state: RootState) => state.common.language);
    const [errorObj, setErrorObj] = useState({
        code: "",
        message: ""
    });
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

    const fetchWalletCredentials = async () => {
        try {
            const apiRequest = api.fetchWalletVCs;
            const response = await fetch(apiRequest.url(), {
                method: "GET",
                headers: apiRequest.headers(language),
                credentials: "include"
            });

            const responseData = await response.json();
            if (response.ok) {
                setCredentials(responseData);
            } else {
                setErrorObj({
                    code: "Fetching Credentials Failed",
                    message: responseData.errorMessage
                });
                throw new Error(responseData.errorMessage);
            }
        } catch (error) {
            console.error("Failed to fetch credentials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletCredentials();
    }, []);

    if (loading) {
        return (
            <div style={{textAlign: "center", marginTop: "2rem"}}>
                Loading...
            </div>
        );
    }

    if (errorObj.code !== "") {
        return (
            <DownloadResult
                title={errorObj.code}
                subTitle={errorObj.message}
                state={RequestStatus.ERROR}
            />
        );
    }

    const fetchCredential = async (credentialId: string, action: string) => {
        try {
            const response = await fetch(
                api.fetchWalletCredentialPreview.url(credentialId),
                {
                    method:
                        api.fetchWalletCredentialPreview.methodType === 0
                            ? "GET"
                            : "POST",
                    headers: api.fetchWalletCredentialPreview.headers(language),
                    credentials: "include"
                }
            );

            if (!response.ok) {
                let responseData = await response.json();
                throw responseData;
            }

            const pdfContent = await response.blob();

            if (action === "download") {
                console.log("inside download::")
                const disposition = response.headers.get("Content-Disposition");
                const fileNameMatch = /filename="(.+)"/.exec(disposition);
                const fileName = fileNameMatch?.[1] || "download.pdf";

                await downloadCredentialPDF(pdfContent, fileName);
            } else {
                console.log("inside preview::");
                const pdfUrl = URL.createObjectURL(pdfContent);
                setPdfPreviewUrl(pdfUrl);
            }
        } catch (error) {
            console.error(
                "Error occurred while fetching credential details:",
                error
            );
        }
    };

    console.log("pdfPreviewUrl::",pdfPreviewUrl)
    return (
        <div style={{padding: "2rem"}}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                {pdfPreviewUrl && (
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                        style={{display: pdfPreviewUrl ? "flex" : "none"}}
                    >
                        <div
                            className="relative bg-white p-5 rounded-lg w-4/5 md:w-2/3 flex flex-col gap-4"
                            style={{
                                height: "80vh",
                                maxWidth: "1200px"
                            }}
                        >
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setPdfPreviewUrl(null)}
                                    className="text-white bg-red-500 px-3 py-1 rounded-full"
                                >
                                    X
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <Worker
                                    workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                                >
                                    <Viewer fileUrl={pdfPreviewUrl} />
                                </Worker>
                            </div>
                        </div>
                    </div>
                )}

                {credentials.map((credential) => (
                    <div
                        key={credential.credential_id}
                        className="bg-iw-tileBackground flex flex-col shadow hover:shadow-lg hover:scale-105 hover:shadow-iw-selectedShadow p-5 m-4 rounded-md cursor-pointer items-center"
                        tabIndex={0}
                        role="menuitem"
                        onClick={() =>
                            fetchCredential(credential.credential_id, "preview")
                        }
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
                                src={credential.credential_type_logo}
                                alt="Credential Type Logo"
                                className="w-20 h-20"
                            />
                            <span
                                className="text-sm font-semibold text-iw-title"
                                data-testid="ItemBox-Text"
                            >
                                {credential.credential_type}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fetchCredential(
                                        credential.credential_id,
                                        "download"
                                    );
                                }}
                                className="mt-3 bg-grey-600 hover:bg-green-700 text-blank font-semibold py-1 px-4 rounded shadow"
                            >
                                Download
                            </button>
                        </div>

                        <span className="text-sm font-semibold text-gray-500 mt-2">
                            {credential.issuer_name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletCredentialsPage;
