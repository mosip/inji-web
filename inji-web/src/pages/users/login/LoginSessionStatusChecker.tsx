import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../../../hooks/useUser';

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();
    const {user, removeUser, fetchUserProfile, walletId} = useUser();
    const fetchSessionAndUserInfo = async () => {
        try {
            await fetchUserProfile();
            if (user?.displayName) {
                window.dispatchEvent(new Event('displayNameUpdated'));
            }

            const cachedWalletId = walletId; // Wallet ID from cache
            const localWalletId = localStorage.getItem('walletId'); // Stored in frontend

            // // If wallet ID is missing or doesn't match, redirect to unlock flow
            if (!cachedWalletId || cachedWalletId !== localWalletId) {
                console.warn(
                    'Wallet is locked or missing. Redirecting to unlock.'
                );
                navigate('/');
                return;
            }

            //Determine unlock status via wallet ID match
            if (cachedWalletId === localWalletId) {
                console.info('Wallet is unlocked! Redirecting to `/issuers`.');
                navigate('/issuers'); // Skip `/pin`
            } else {
                console.warn(
                    'Wallet exists but is locked, redirecting to `/pin` to enter passcode.'
                );
                navigate('/pin'); // Enter passcode
            }
        } catch (error) {
            console.error('Error occurred while fetching user profile:', error);
            removeUser();
            localStorage.removeItem('walletId');
            window.dispatchEvent(new Event('displayNameUpdated'));
            navigate('/');
        }
    };

    useEffect(() => {
        fetchSessionAndUserInfo();
    }, []);

    useEffect(() => {
        const handleStorageChange = (event: any) => {
            if (event.key === 'displayName') {
                fetchSessionAndUserInfo();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return null;
};

export default LoginSessionStatusChecker;
