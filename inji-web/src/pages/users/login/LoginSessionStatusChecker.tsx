import { useEffect } from "react";
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
            return responseData.display_name;
        }
    } catch (error) {
        throw error;
    }
};

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();

    const fetchSessionAndUserInfo = async () => {
        try {
            const displayName = await fetchUserProfile();
            if (displayName) {
                window.dispatchEvent(new Event("displayNameUpdated"));
            }
        } catch (error) {
            console.error("Error occurred while fetching user profile:", error);
            localStorage.removeItem("displayName");
            window.dispatchEvent(new Event("displayNameUpdated"));
            navigate("/");
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