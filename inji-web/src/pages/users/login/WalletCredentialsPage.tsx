import {useEffect, useState} from "react";
import {RootState} from "../../../types/redux";
import {useSelector} from "react-redux";
import {api} from "../../../utils/api";
import {WalletCredential} from "../../../types/data";
import {DownloadResult} from "../../../components/Redirection/DownloadResult";
import {RequestStatus} from "../../../hooks/useFetch";

const WalletCredentialsPage = () => {
    const [credentials, setCredentials] = useState<WalletCredential[]>([]);
    const [loading, setLoading] = useState(true);
    const language = useSelector((state: RootState) => state.common.language);
    const [errorObj, setErrorObj] = useState({
        code: "",
        message: ""
    });
    const fetchWalletCredentials = async () => {
        try {
            const apiRequest = api.fetchWalletVCs;
            const response = await fetch(apiRequest.url(language), {
                method: "GET",
                headers: apiRequest.headers(),
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
                {credentials.map((credential) => (
                    <div
                        key={credential.credential_id}
                        className={`bg-iw-tileBackground flex flex-col shadow hover:shadow-lg hover:scale-105 hover:shadow-iw-selectedShadow p-5 m-4 rounded-md cursor-pointer items-center`}
                        tabIndex={0}
                        role="menuitem"
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
