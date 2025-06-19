import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUser} from '../../hooks/User/useUser';
import {KEYS, ROUTES} from '../../utils/constants';

import {User} from "../../types/data";
import {Storage} from "../../utils/Storage";

const loginProtectedPrefixes = [ROUTES.USER];

const isLoginProtectedRoute = (pathname: string) => {
    return loginProtectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {removeUser, fetchUserProfile} = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
    const userFromLocalStorage = Storage.getItem(KEYS.USER);
    const walletIdFromLocalStorage = Storage.getItem(KEYS.WALLET_ID);

    useEffect(() => {
        setIsLoggedIn(!!userFromLocalStorage && !!walletIdFromLocalStorage);
        setIsSessionActive(!!userFromLocalStorage);
    }, [userFromLocalStorage, walletIdFromLocalStorage]);

    useEffect(() => {
        if (isSessionActive) {
            console.debug("Session is active in local, checking user info from backend...");
            fetchSessionAndUserInfo();
        }
    }, [isSessionActive]);

    useEffect(() => {
        const handleStorageChange = (event: any) => {
            if (event.key === KEYS.USER) {
                fetchSessionAndUserInfo();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const validateWalletUnlockStatus = (
        cachedWalletId: string | null,
        storageWalletId: string | null,
        navigate: (path: string) => void,
        user: User
    ) => {
        if (cachedWalletId && (cachedWalletId === storageWalletId)) {
            console.info('Wallet is unlocked!');
        } else {
            console.warn(
                'Wallet exists but is locked, redirecting to `/user/passcode` to unlock the wallet.'
            );
            if (user) {
                navigate(ROUTES.PASSCODE);
                Storage.removeItem(KEYS.WALLET_ID);
            }
        }
    };

    const fetchSessionAndUserInfo = async () => {
        try {
            const {user, walletId} = await fetchUserProfile();
            if (user && !walletId) {
                console.warn(
                    'No wallet ID found for the user, redirecting to `/user/passcode`'
                );
                navigate(ROUTES.PASSCODE);
                return;
            }
            const cachedWalletId = walletId;
            const storageWalletId = Storage.getItem(KEYS.WALLET_ID);

            validateWalletUnlockStatus(
                cachedWalletId,
                storageWalletId,
                navigate,
                user
            );
        } catch (error) {
            console.error('Error occurred while fetching user profile:', error);
            removeUser();
            Storage.removeItem(KEYS.WALLET_ID);
            if (isLoggedIn || (!isLoggedIn && isLoginProtectedRoute(location.pathname))) {
                navigate(ROUTES.ROOT);
            }
        }
    };

    return null;
};

export default LoginSessionStatusChecker;
