import {CredentialTypeDisplayArrayObject, ErrorType, User} from "./data";
import {Dispatch, SetStateAction} from "react";
import {RequestStatus} from "../utils/constants";

export type UserContextType = {
    user: User | null;
    walletId: string | null;
    error: ErrorType | null;
    isLoading: boolean;
    isUserLoggedIn: () => boolean;
    fetchUserProfile: () => Promise<{ user: User; walletId: string }>;
    saveUser: (user: User) => void;
    saveWalletId: (string) => void;
    removeUser: () => void;
    removeWallet: () => void;
};

export type DownloadSessionContextType = {
    downloadInProgressSessions: SessionsMap;
    currentSessionDownloadId: string | null;
    latestDownloadedSessionId: string | null;
    addSession: (credentialTypeDisplayObj: CredentialTypeDisplayArrayObject[], downloadStatus: RequestStatus) => string;
    updateSession: (downloadId: string, downloadStatus: RequestStatus) => void;
    removeSession: (downloadId: string) => void;
    setCurrentSessionDownloadId: Dispatch<SetStateAction<string | null>>;
    setLatestDownloadedSessionId: Dispatch<SetStateAction<string | null>>;
}