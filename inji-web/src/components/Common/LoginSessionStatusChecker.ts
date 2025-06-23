import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUser} from '../../hooks/User/useUser';
import {KEYS, ROUTES} from '../../utils/constants';
import {Storage} from "../../utils/Storage";

const loginProtectedPrefixes = [ROUTES.USER];

const isLoginProtectedRoute = (pathname: string) => {
    return loginProtectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * LoginSessionStatusChecker component checks the login session status
 * and redirects the user to the appropriate page based on their login state.
 * It listens for changes in the local storage to update the session status.
 * It relies on the storage data to determine if the user is logged in or not.
 */
const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {removeUser, fetchUserProfile} = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const validateStatus = useCallback(() => {
        const user = Storage.getItem(KEYS.USER);
        const isSessionActive: boolean = !!user
        const walletId = Storage.getItem(KEYS.WALLET_ID);
        const isLoggedIn = !!walletId && isSessionActive;

        // user can reset-passcode when session is active but not logged out state
        if (isSessionActive && !isLoggedIn && location.pathname !== ROUTES.USER_RESET_PASSCODE && isLoginProtectedRoute(location.pathname)) {
            // Session is active but user required to enter passcode to unlock wallet
            console.warn('Session is active but no wallet ID found, redirecting to `/user/passcode` to unlock wallet from path - ', location.pathname);
            navigate(ROUTES.PASSCODE);
        } else if (!isLoggedIn && isLoginProtectedRoute(location.pathname)) {
            // User is not logged in and trying to access a login protected route
            console.warn('User is not logged in, redirecting to `/` to login');
            removeUser();
            navigate(ROUTES.ROOT);
        }
    }, [navigate, location.pathname, removeUser]);


    const fetchInfo = useCallback(async () => {
        try {
            setIsLoading(true)
            await fetchUserProfile();
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (isLoginProtectedRoute(location.pathname)) {
                console.warn(". Redirecting to / page as accessing protected route");
                navigate(ROUTES.ROOT)
            }
        }
    }, [fetchUserProfile]);

    // on app launch, populate the data from backend
    useEffect(() => {
        fetchInfo();

        const handleStorageChange = (event: any) => {
            if (event.key === KEYS.USER || event.key === KEYS.WALLET_ID) {
                fetchInfo();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // on every path change, validate the status. This happens after app launch handlers are set up
    useEffect(() => {
        if (!isLoading) {
            validateStatus();
        }
    }, [location.pathname, validateStatus, isLoading]);

    return null;
};

export default LoginSessionStatusChecker;
