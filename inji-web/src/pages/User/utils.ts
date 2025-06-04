import { User } from "../../components/Dashboard/types";
import { KEYS } from "../../utils/constants";
import {ROUTES} from "../../constants/Routes";

export const convertStringIntoPascalCase = (text: string | undefined) => {
    return (
        text?.toLocaleLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    );
};

export const navigateToUserHome = (navigate: any) =>
    navigate(ROUTES.USER_HOME);

export const validateWalletUnlockStatus = (
    cachedWalletId: string | null,
    storageWalletId: string | null,
    navigate: (path: string) => void,
    user: User
) => {
    if (cachedWalletId && (cachedWalletId === storageWalletId)) {
        console.info('Wallet is unlocked!');
    } else {
        console.warn(
            'Wallet exists but is locked, redirecting to `/pin` to unlock the wallet.'
        );
        if(user) {
            navigate('/pin');
            localStorage.removeItem(KEYS.WALLET_ID);
        }
    }
};