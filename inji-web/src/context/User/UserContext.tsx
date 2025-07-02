import React, {createContext, useState} from "react";
import {UserContextType} from "../../types/contextTypes";
import {ErrorType, User} from "../../types/data";
import {KEYS} from "../../utils/constants";
import {api} from "../../utils/api";
import {AppStorage} from "../../utils/AppStorage";
import {useApi} from "../../hooks/useApi";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children
                                                                      }) => {
    const [user, setUser] = useState<User | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const userProfileApi = useApi<User>()

    // This stores the user info which indicates whether user has authenticated or not
    const saveUser = (userData: User) => {
        AppStorage.setItem(KEYS.USER, JSON.stringify(userData));
        setUser(userData);
    };

    // This stores the wallet ID which indicates whether user has unlocked wallet or not
    const saveWalletId = (walletId: string) => {
        AppStorage.setItem(KEYS.WALLET_ID, walletId);
        setWalletId(walletId);
    };

    const removeUser = () => {
        AppStorage.removeItem(KEYS.USER);
        AppStorage.removeItem(KEYS.WALLET_ID);
        setUser(null);
        setWalletId(null);
    };

    const removeWallet = () => {
        AppStorage.removeItem(KEYS.WALLET_ID);
        setWalletId(null);
    };

    // Logged in = authenticated + unlocked wallet
    const isUserLoggedIn = () => {
        const user = AppStorage.getItem(KEYS.USER);
        const walletId = AppStorage.getItem(KEYS.WALLET_ID);
        return !!user && !!walletId
    };

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const  response = await userProfileApi.fetchData({
                apiConfig: api.fetchUserProfile,
            })

            if (!response.ok()) {
                throw response.error
            }
            const responseData = response.data!

            const userData: User = {
                displayName: responseData.displayName,
                profilePictureUrl: responseData.profilePictureUrl,
                email: responseData.email
            };

            saveUser(userData);
            setIsLoading(false);
            return {user: userData, walletId: responseData.walletId};
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError(error as ErrorType);
            removeUser();
            setIsLoading(false);
            throw error;
        }
    };

    const contextValue = React.useMemo(
        () => ({
            user,
            walletId,
            error,
            isLoading,
            isUserLoggedIn,
            fetchUserProfile,
            saveWalletId,
            removeUser,
            removeWallet
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, walletId, error, isLoading]
    );

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};