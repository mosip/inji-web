import {ErrorType, User} from "./data";

export type UserContextType = {
    user: User | null;
    walletId: string | null;
    error: ErrorType | null;
    isLoading: boolean;
    fetchUserProfile: () => Promise<{ user: User; walletId: string }>;
    saveUser: (user: User) => void;
    removeUser: () => void;
    removeWallet: () => void;
};