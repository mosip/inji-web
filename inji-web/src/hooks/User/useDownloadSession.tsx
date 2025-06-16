import {useContext} from "react";
import {DownloadSessionContextType} from "../../types/contextTypes";
import {DownloadSessionContext} from "../../context/User/DownloadSessionContext";

export const useDownloadSessionDetails = (): DownloadSessionContextType => {
    const context = useContext(DownloadSessionContext);
    if (!context) {
        throw new Error("useDownloadSessionDetails must be used within a DownloadSessionProvider");
    }
    return context;
};