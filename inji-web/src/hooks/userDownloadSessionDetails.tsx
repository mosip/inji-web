import {useEffect, useState} from "react";
import {RequestStatus} from "./useFetch";

interface SessionStatus {
    downloadStatus: RequestStatus;
}

interface SessionsMap {
    [credentialType: string]: SessionStatus;
}

const getSessionsFromLocalStorage = (): SessionsMap => {
    try {
        const sessions = localStorage.getItem('downloadSessions');
        return sessions ? JSON.parse(sessions) : {};
    } catch (e) {
        console.error("Error parsing download sessions from localStorage:", e);
        return {};
    }
};

const dispatchLocalStorageChangeEvent = () => {
    window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT));
};

export const LOCAL_STORAGE_CHANGE_EVENT = 'downloadSessionsChange';

export const useDownloadSessionDetails = () => {
    const [downloadSessions, setDownloadSessions] = useState<SessionsMap>(getSessionsFromLocalStorage());

    useEffect(() => {
        const updateSessionsFromEvent = () => {
            setDownloadSessions(getSessionsFromLocalStorage());
        };

        window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, updateSessionsFromEvent);

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'downloadSessions') {
                updateSessionsFromEvent();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, updateSessionsFromEvent);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const addOrUpdateSession = (credentialType: string, downloadStatus: RequestStatus) => {
        const sessions = getSessionsFromLocalStorage();
        const updatedSessions = {...sessions, [credentialType]: {downloadStatus}}
        localStorage.setItem('downloadSessions', JSON.stringify(updatedSessions));
        dispatchLocalStorageChangeEvent();
    };

    const removeActiveSession = (credentialType: string) => {
        const sessions = getSessionsFromLocalStorage();
        const {[credentialType]: _, ...updatedSessions} = sessions;
        localStorage.setItem('downloadedSessions', JSON.stringify(updatedSessions));
        dispatchLocalStorageChangeEvent();
    };

    return {
        addOrUpdateSession,
        removeActiveSession,
        downloadSessions
    };
};