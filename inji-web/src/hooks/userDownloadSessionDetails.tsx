import React, {createContext, Dispatch, SetStateAction, useContext, useState, useMemo} from "react";
import {RequestStatus} from "./useFetch";
import {CredentialTypeDisplayArrayObject} from "../types/data";
import {generateRandomString} from "../utils/misc";

export interface SessionStatus {
    credentialTypeDisplayObj: CredentialTypeDisplayArrayObject[];
    downloadStatus: RequestStatus;
}

interface SessionsMap {
    [downloadId: string]: SessionStatus;
}

interface DownloadSessionContextProps {
    downloadInProgressSessions: SessionsMap;
    currentSessionDownloadId: string | null;
    latestDownloadedSessionId: string | null;
    addSession: (credentialTypeDisplayObj: CredentialTypeDisplayArrayObject[], downloadStatus: RequestStatus) => string;
    updateSession: (downloadId: string, downloadStatus: RequestStatus) => void;
    removeSession: (downloadId: string) => void;
    setCurrentSessionDownloadId: Dispatch<SetStateAction<string | null>>;
    setLatestDownloadedSessionId: Dispatch<SetStateAction<string | null>>;
}

const DownloadSessionContext = createContext<DownloadSessionContextProps | undefined>(undefined);

export const DownloadSessionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [downloadInProgressSessions, setDownloadInProgressSessions] = useState<SessionsMap>({});
    const [currentSessionDownloadId, setCurrentSessionDownloadId] = useState<string | null>(null);
    const [latestDownloadedSessionId, setLatestDownloadedSessionId] = useState<string | null>(null);

    const generateUniqueDownloadId = (): string => {
        return Date.now().toString(36) + generateRandomString();
    };

    const addSession = (
        credentialTypeDisplayObj: CredentialTypeDisplayArrayObject[],
        downloadStatus: RequestStatus
    ): string => {
        const newDownloadId = generateUniqueDownloadId();

        setDownloadInProgressSessions(prevSessions => {
            const updatedSessionsMap = {
                ...prevSessions, [newDownloadId]: {credentialTypeDisplayObj, downloadStatus}
            };
            return updatedSessionsMap;
        });

        setCurrentSessionDownloadId(newDownloadId);
        return newDownloadId;
    };

    const updateSession = (downloadId: string, downloadStatus: RequestStatus) => {
        setDownloadInProgressSessions(prevSessions => {
            if (!prevSessions[downloadId]) {
                console.warn(`Attempted to update non-existent session with download ID: ${downloadId}`);
                return prevSessions;
            }

            const updatedSessionDetails = {...prevSessions[downloadId], downloadStatus};
            const updatedSessionsMap = {
                ...prevSessions,
                [downloadId]: updatedSessionDetails
            };

            return updatedSessionsMap;
        });

        if (downloadStatus === RequestStatus.DONE || downloadStatus === RequestStatus.ERROR) {
            setLatestDownloadedSessionId(downloadId)
        }
    };

    const removeSession = (downloadId: string) => {
        setDownloadInProgressSessions(prevSessions => {
            const {[downloadId]: _, ...updatedSessionsMap} = prevSessions;
            return updatedSessionsMap;
        });
        setLatestDownloadedSessionId(null);
    };

    const contextValue = useMemo(
        () => ({
            downloadInProgressSessions,
            currentSessionDownloadId,
            latestDownloadedSessionId,
            addSession,
            updateSession,
            removeSession,
            setCurrentSessionDownloadId,
            setLatestDownloadedSessionId
        }),
        [downloadInProgressSessions, currentSessionDownloadId, latestDownloadedSessionId]
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