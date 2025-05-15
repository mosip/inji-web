import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../../hooks/useUser";

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, removeUser, fetchUserProfile} = useUser();

    const fetchSessionAndUserInfo = async () => {
        try {
            await fetchUserProfile();
            if (user?.displayName) {
                window.dispatchEvent(new Event("displayNameUpdated"));
            }
        } catch (error) {
            console.error("Error occurred while fetching user profile:", error);
            removeUser();
            window.dispatchEvent(new Event("displayNameUpdated"));

            // Check if the error occurred due to invalid or expired session
            if (error.errorCode === "session_invalid_or_expired") {
                toast.error("You are not logged in. Please login to continue.");
                navigate("/login");
            }
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