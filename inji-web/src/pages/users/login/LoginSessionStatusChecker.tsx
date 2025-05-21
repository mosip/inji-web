import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";

const fetchUserProfile = async () => {
    try {
        const response = await fetch(api.fetchUserProfile.url(), {
            method: api.fetchUserProfile.methodType === 0 ? "GET" : "POST",
            headers: { ...api.fetchUserProfile.headers() },
            credentials: "include"
        });
        const responseData = await response.json();

        if (!response.ok) {
            throw responseData;
        }

        if (responseData.display_name) {
            localStorage.setItem("displayName", responseData.display_name);
        }

        // Store walletId for authentication verification
        if (!!responseData.wallet_id) {
            localStorage.setItem("walletId", responseData.wallet_id);
        } else {
            localStorage.removeItem("walletId"); // Ensure proper validation
        }

        return { displayName: responseData.display_name, walletId: responseData.walletId };

    } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("displayName");
        localStorage.removeItem("walletId"); // Clear wallet data if error occurs
        throw error;
    }
};

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();
    const fetchSessionAndUserInfo = async () => {
        try {
            const userData = await fetchUserProfile();
            if (userData?.displayName) {
                window.dispatchEvent(new Event("displayNameUpdated"));
            }

            const cachedWalletId = userData?.walletId; // Wallet ID from cache
            const localWalletId = localStorage.getItem("walletId"); // Stored in frontend
            
            // // If wallet ID is missing or doesn't match, redirect to unlock flow
            if (!cachedWalletId || cachedWalletId !== localWalletId) {
                    console.warn("Wallet is locked or missing. Redirecting to unlock.");
                    navigate("/");
                    return;
                }
                
            //Determine unlock status via wallet ID match
            if (cachedWalletId === localWalletId) {
                console.info("Wallet is unlocked! Redirecting to `/issuers`.");
                navigate("/issuers"); // Skip `/pin`
            } else {
                console.warn("Wallet exists but is locked, redirecting to `/pin` to enter passcode.");
                navigate("/pin"); // Enter passcode
            }

        } catch (error) {
            console.error("Error occurred while fetching user profile:", error);
            localStorage.removeItem("displayName");
            localStorage.removeItem("walletId");
            window.dispatchEvent(new Event("displayNameUpdated"));
            navigate("/"); // Redirect on error
        }
    };

    useEffect(() => {
        fetchSessionAndUserInfo();
    }, []);

    useEffect(() => {
        const handleStorageChange = (event: any) => {
            if (event.key === "displayName") {
                fetchSessionAndUserInfo();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return null;
};

export default LoginSessionStatusChecker;