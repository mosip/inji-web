import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../../../hooks/useUser';
import {validateWalletUnlockStatus} from '../../Dashboard/utils';
import {KEYS} from '../../../utils/constants';

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();
    const {user, removeUser, fetchUserProfile} = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const displayNameFromLocalStorage = user?.displayName;

    useEffect(() => {
        setIsLoggedIn(!!displayNameFromLocalStorage);
    }, [displayNameFromLocalStorage]);

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
