import React, {createContext, Dispatch, SetStateAction, useContext, useState} from "react";
import {RequestStatus} from "./useFetch";

interface SessionStatus {
    credentialType: string;
    downloadStatus: RequestStatus;
}

interface SessionsMap {
    [downloadId: string]: SessionStatus;
}

interface DownloadSessionContextProps {
    downloadInProgressSessions: SessionsMap;
    currentSessionDownloadId: string | null;
    latestDownloadedSessionId: string | null;
    addSession: (credentialType: string, downloadStatus: RequestStatus) => string;
    updateSession: (downloadId: string, downloadStatus: RequestStatus) => void;
    removeSession: (credentialType: string) => void;
    setCurrentSessionDownloadId: Dispatch<SetStateAction<string | null>>;
}

const DownloadSessionContext = createContext<DownloadSessionContextProps | undefined>(undefined);

export const DownloadSessionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [downloadInProgressSessions, setDownloadInProgressSessions] = useState<SessionsMap>({});
    const [currentSessionDownloadId, setCurrentSessionDownloadId] = useState<string | null>(null);
    const [latestDownloadedSessionId, setLatestDownloadedSessionId] = useState<string | null>(null);

    const generateUniqueDownloadId = (): string => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const addSession = (credentialType: string, downloadStatus: RequestStatus): string => {
        const newDownloadId = generateUniqueDownloadId();
        const updatedSessions = {...downloadInProgressSessions, [newDownloadId]: {credentialType, downloadStatus}};
        setDownloadInProgressSessions(updatedSessions);
        setCurrentSessionDownloadId(newDownloadId);
        return newDownloadId;
    };

    const updateSession = (downloadId: string, downloadStatus: RequestStatus) => {
        const updatedSessionDetails = {...downloadInProgressSessions[downloadId], downloadStatus};
        const updatedSessions = {...downloadInProgressSessions, [downloadId]: updatedSessionDetails};

        setDownloadInProgressSessions(updatedSessions);

        if (downloadStatus === RequestStatus.DONE || downloadStatus === RequestStatus.ERROR) {
            setLatestDownloadedSessionId(downloadId)
        }
    };

    const removeSession = (credentialType: string) => {
        const {[credentialType]: _, ...updatedSessions} = downloadInProgressSessions;
        setDownloadInProgressSessions(updatedSessions);
    };

    const contextValue = React.useMemo(
        () => ({
            downloadInProgressSessions,
            currentSessionDownloadId,
            latestDownloadedSessionId,
            addSession,
            updateSession,
            removeSession,
            setCurrentSessionDownloadId

        }),
        [downloadInProgressSessions, currentSessionDownloadId,latestDownloadedSessionId]
    );
    return (
        <DownloadSessionContext.Provider value={contextValue}>
            {children}
        </DownloadSessionContext.Provider>
    );
};

export const useDownloadSessionDetails = (): DownloadSessionContextProps => {
    const context = useContext(DownloadSessionContext);
    if (!context) {
        throw new Error("useDownloadSessionDetails must be used within a DownloadSessionProvider");
    }
    return context;
};