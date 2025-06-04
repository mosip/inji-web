import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUser} from '../../../hooks/useUser';
import {validateWalletUnlockStatus} from '../../User/utils';
import {KEYS} from '../../../utils/constants';
import {ROUTES} from "../../../constants/Routes";

const loginProtectedPrefixes = ['/dashboard', '/pin'];

const isLoginProtectedRoute = (pathname: string) => {
    return loginProtectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

const LoginSessionStatusChecker: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, walletId, removeUser, fetchUserProfile, isLoading} = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const userFromLocalStorage = localStorage.getItem(KEYS.USER);
    const walletIdFromLocalStorage = localStorage.getItem(KEYS.WALLET_ID);

    useEffect(() => {
        setIsLoggedIn(!!userFromLocalStorage && !!walletIdFromLocalStorage);
    }, [userFromLocalStorage, walletIdFromLocalStorage]);

    useEffect(() => {
        fetchSessionAndUserInfo();
    }, [isLoggedIn]);

    useEffect(() => {
        const handleStorageChange = (event: any) => {
            if (event.key === KEYS.USER) {
                fetchSessionAndUserInfo();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const fetchSessionAndUserInfo = async () => {
        try {
            const {user, walletId} = await fetchUserProfile();
            if (user && !walletId) {
                console.warn(
                    'No wallet ID found for the user, redirecting to `/pin`'
                );
                navigate(ROUTES.PIN);
                return;
            }
            const cachedWalletId = walletId;
            const storageWalletId = localStorage.getItem(KEYS.WALLET_ID);

            validateWalletUnlockStatus(
                cachedWalletId,
                storageWalletId,
                navigate,
                user
            );
        } catch (error) {
            console.error('Error occurred while fetching user profile:', error);
            removeUser();
            localStorage.removeItem(KEYS.WALLET_ID);
            if (isLoggedIn || (!isLoggedIn && isLoginProtectedRoute(location.pathname))) {
                navigate(ROUTES.ROOT);
            }
        }
    };

    return null;
};

export default LoginSessionStatusChecker;
