import React, {createContext, useState} from "react";
import {UserContextType} from "../../types/contextTypes";
import {ErrorType, User} from "../../types/data";
import {KEYS} from "../../utils/constants";
import {api, MethodType} from "../../utils/api";
import {Storage} from "../../utils/Storage";
import {useApi} from "../../hooks/useApi.ts";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children
                                                                      }) => {
    const [user, setUser] = useState<User | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const userProfile = useApi<User>()

    // This stores the user info which indicates whether user has authenticated or not
    const saveUser = (userData: User) => {
        Storage.setItem(KEYS.USER, JSON.stringify(userData));
        setUser(userData);
    };

    // This stores the wallet ID which indicates whether user has unlocked wallet or not
    const saveWalletId = (walletId: string) => {
        Storage.setItem(KEYS.WALLET_ID, walletId);
        setWalletId(walletId);
    };

    const removeUser = () => {
        console.log("Removing user data from storage");
        Storage.removeItem(KEYS.USER);
        Storage.removeItem(KEYS.WALLET_ID);
        setUser(null);
        setWalletId(null);
    };

    const removeWallet = () => {
        Storage.removeItem(KEYS.WALLET_ID);
        setWalletId(null);
    };

    // Logged in = authenticated + unlocked wallet
    const isUserLoggedIn = () => {
        const user = Storage.getItem(KEYS.USER);
        const walletId = Storage.getItem(KEYS.WALLET_ID);
        return !!user && !!walletId
    };

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const  response = await userProfile.fetchData({
                apiRequest: api.fetchUserProfile,
            })

            //TODO: check if this is still needed
            if (!response.ok) {
                throw response.error
            };
            const responseData = response.data

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
            saveUser,
            saveWalletId,
            removeUser,
            removeWallet
        }),
        [user, walletId, error, isLoading]
    );

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};