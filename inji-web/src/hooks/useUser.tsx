import React, {createContext, useContext, useState} from 'react';
import {api} from '../utils/api';
import {KEYS} from '../utils/constants';
import {ErrorType, User, UserContextType} from '../components/Dashboard/types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);

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

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(api.fetchUserProfile.url(), {
                method: api.fetchUserProfile.methodType === 0 ? 'GET' : 'POST',
                headers: {...api.fetchUserProfile.headers()},
                credentials: 'include'
            });

            const responseData = await response.json();
            if (!response.ok) throw responseData;

            const userData: User = {
                displayName: responseData.display_name,
                profilePictureUrl: responseData.profile_picture_url
            };

            saveUser(userData);
            setWalletId(responseData.wallet_id);
            localStorage.setItem(KEYS.WALLET_ID, responseData.wallet_id);
            return {user: userData, walletId: responseData.wallet_id};
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
            setWalletId(null);
            setError(error as ErrorType);
            removeUser();
            localStorage.removeItem(KEYS.WALLET_ID);
            throw error;
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                walletId,
                error,
                fetchUserProfile,
                saveUser,
                removeUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
