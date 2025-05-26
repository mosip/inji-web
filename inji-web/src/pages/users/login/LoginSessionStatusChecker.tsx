import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../../../hooks/useUser';
import {validateWalletUnlockStatus} from '../../Dashboard/utils';
import {KEYS} from '../../../utils/constants';

const LoginSessionStatusChecker: React.FC = () => {
    const navigate = useNavigate();
    const {user, walletId, removeUser, fetchUserProfile} = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const displayNameFromLocalStorage = localStorage.getItem(KEYS.WALLET_ID);
    const walletIdFromLocalStorage = localStorage.getItem(KEYS.WALLET_ID);

    useEffect(() => {
        setIsLoggedIn(
            !!displayNameFromLocalStorage && !!walletIdFromLocalStorage
        );
    }, [displayNameFromLocalStorage, walletIdFromLocalStorage]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchSessionAndUserInfo();
        }
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
            navigate('/');
        }
    };

    return null;
};

export default LoginSessionStatusChecker;
