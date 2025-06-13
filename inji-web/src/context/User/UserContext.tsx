import React, {createContext, useState} from "react";
import {UserContextType} from "../../types/contextTypes";
import {ErrorType, User} from "../../types/data";
import {KEYS} from "../../utils/constants";
import {api, MethodType} from "../../utils/api";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({
                                                                        children
                                                                    }) => {
    const [user, setUser] = useState<User | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const saveUser = (userData: User) => {
        localStorage.setItem(KEYS.USER, JSON.stringify(userData));
        setUser(userData);
    };

    const removeUser = () => {
        localStorage.removeItem(KEYS.USER);
        localStorage.removeItem(KEYS.WALLET_ID);
        setUser(null);
        setWalletId(null);
    };

    const removeWallet = () => {
        localStorage.removeItem(KEYS.WALLET_ID);
        setWalletId(null);
    };

    const isUserLoggedIn = React.useMemo(() => !!user && !!walletId, [user, walletId]);

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
            localStorage.setItem(KEYS.WALLET_ID, responseData.walletId);
            setIsLoading(false);
            return {user: userData, walletId: responseData.walletId};
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError(error as ErrorType);
            removeUser();
            localStorage.removeItem(KEYS.WALLET_ID);
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