export const convertStringIntoPascalCase = (text: string | undefined) => {
    return (
        text &&
        text
            .toLocaleLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
};

export const getProfileInitials = (displayName: string | undefined) => {
    return displayName
        ? displayName
              .split(" ")
              .map((name) => name.charAt(0).toUpperCase())
              .join("")
        : "U";
};

export const navigateToDashboardHome = (navigate: any) =>
    navigate('/dashboard/home');


export const validateWalletUnlockStatus = (
    cachedWalletId: string | null,
    storageWalletId: string | null,
    navigate: (path: string) => void
) => {
    if (cachedWalletId === storageWalletId) {
        console.info('Wallet is unlocked!');
    } else {
        console.warn(
            'Wallet exists but is locked, redirecting to `/pin` to unlock the wallet.'
        );
        localStorage.removeItem('walletId');
        navigate('/pin');
    }
};