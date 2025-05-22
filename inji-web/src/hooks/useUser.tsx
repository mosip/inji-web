import {useState, useEffect} from 'react';
import {api} from '../utils/api';

export type User = {
    displayName: string;
    profilePictureUrl: string;
};

type Error = {
    errorCode: string;
    errorMessage: string;
};

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error("Invalid user data in localStorage");
                localStorage.removeItem("user");
            }
        }
    }, []);

    const saveUser = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const removeUser = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(api.fetchUserProfile.url(), {
                method: api.fetchUserProfile.methodType === 0 ? "GET" : "POST",
                headers: {...api.fetchUserProfile.headers()},
                credentials: "include"
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                throw responseData;
            }
    
            const userData: User = {
                "displayName": responseData.display_name,
                "profilePictureUrl": responseData.profile_picture_url
            };
            saveUser(userData);
            setWalletId(responseData.wallet_id);
            return {user: userData, walletId: responseData.wallet_id};
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
            setError(error as Error);
            localStorage.removeItem('user');
            localStorage.removeItem('walletId');
            throw error;
        }
    };

    return {user, error, saveUser, removeUser, fetchUserProfile, walletId};
}
