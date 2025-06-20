import {useCallback, useEffect} from 'react';
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
//TODO: Add test for LoginSessionStatusChecker
const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {removeUser, fetchUserProfile} = useUser();


    const validateStatus = useCallback(() => {
        const user = Storage.getItem(KEYS.USER);
        const isSessionActive: boolean = !!user
        const walletId = Storage.getItem(KEYS.WALLET_ID);
        const isLoggedIn = !!walletId && isSessionActive;
        if (isSessionActive && !isLoggedIn) {
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
            console.log("Fetching user profile and wallet ID on app launch");
            await fetchUserProfile();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }, [fetchUserProfile]);

    function isCurrentPageNotPasscodePage() {
        return location.pathname !== ROUTES.PASSCODE;
    }

// on app launch, populate the data from backend
    useEffect(() => {
        console.log("App launched, fetching user profile and wallet ID");
        // After successful login, user is redirected to passcode page which is also app launch point
        if (isCurrentPageNotPasscodePage()) {
            fetchInfo();
        }

        const handleStorageChange = (event: any) => {
            if (event.key === KEYS.USER) {
                validateStatus();
            }
            console.log("Storage change detected:", event);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // on every path change, validate the status
    useEffect(() => {
        console.log("LoginSessionStatusChecker mounted at ", location.pathname);
        validateStatus();
    }, [location.pathname, validateStatus]);

    return null;
};

export default LoginSessionStatusChecker;
