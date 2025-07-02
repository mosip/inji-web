import {CredentialTypeDisplayArrayObject} from "../../types/data";
import React, {createContext, useMemo, useState} from "react";
import {DownloadSessionContextType} from "../../types/contextTypes";
import {generateRandomString} from "../../utils/misc";
import {RequestStatus} from "../../utils/constants";

export interface SessionStatus {
    credentialTypeDisplayObj: CredentialTypeDisplayArrayObject[];
    downloadStatus: RequestStatus;
}

interface SessionsMap {
    [downloadId: string]: SessionStatus;
}

export const DownloadSessionContext = createContext<DownloadSessionContextType | undefined>(undefined);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [downloadInProgressSessions, currentSessionDownloadId, latestDownloadedSessionId]
    );

    return (
        <DownloadSessionContext.Provider value={contextValue}>
            {children}
        </DownloadSessionContext.Provider>
    );
};
