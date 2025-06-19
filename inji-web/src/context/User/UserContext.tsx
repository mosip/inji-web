import React, {createContext, useState} from "react";
import {UserContextType} from "../../types/contextTypes";
import {ErrorType, User} from "../../types/data";
import {KEYS} from "../../utils/constants";
import {api, MethodType} from "../../utils/api";
import {Storage} from "../../utils/Storage";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children
                                                                      }) => {
    const [user, setUser] = useState<User | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const saveUser = (userData: User) => {
        Storage.setItem(KEYS.USER, JSON.stringify(userData));
        setUser(userData);
    };

    const removeUser = () => {
        Storage.removeItem(KEYS.USER);
        Storage.removeItem(KEYS.WALLET_ID);
        setUser(null);
        setWalletId(null);
    };

    const removeWallet = () => {
        Storage.removeItem(KEYS.WALLET_ID);
        setWalletId(null);
    };

    const isUserLoggedIn = () => {
        return !!Storage.getItem(KEYS.WALLET_ID)
    };

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(api.fetchUserProfile.url(), {
                method: MethodType[api.fetchUserProfile.methodType],
                headers: {...api.fetchUserProfile.headers()},
                credentials: api.fetchUserProfile.credentials
            });

            const responseData = await response.json();
            if (!response.ok) throw responseData;

            const userData: User = {
                displayName: responseData.displayName,
                profilePictureUrl: responseData.profilePictureUrl,
                email: responseData.email
            };

            saveUser(userData);
            setWalletId(responseData.walletId);
            Storage.setItem(KEYS.WALLET_ID, responseData.walletId);
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