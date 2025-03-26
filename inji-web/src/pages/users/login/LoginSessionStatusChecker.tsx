import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "../../../utils/api";

const fetchUserProfile = async () => {
    try {
        const userProfileResponse = await fetch(api.fetchUserProfile.url(), {
            method: api.fetchUserProfile.methodType === 0 ? "GET" : "POST",
            headers: { ...api.fetchUserProfile.headers() },
            credentials: "include"
        });

        const userProfileData = await userProfileResponse.json();

        if (!userProfileResponse.ok) {
            console.error("Failed to fetch user profile:", userProfileData.errors);
            throw new Error(userProfileData?.errors?.[0]?.errorMessage);
        }

        const userInfo = userProfileData?.response;
        if (userInfo?.display_name) {
            localStorage.setItem("displayName", userInfo.display_name);
            return userInfo.display_name;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();

    const fetchSessionAndUserInfo = async (shouldFetchUserDetails = false) => {
        try {
            const sessionResponse = await fetch(
                api.fetchUserLoginStatus.url(),
                {
                    method:
                        api.fetchUserLoginStatus.methodType === 0
                            ? "GET"
                            : "POST",
                    headers: {...api.fetchUserLoginStatus.headers()},
                    credentials: "include"
                }
            );

            const sessionData = await sessionResponse.json();

            if (!sessionResponse.ok) {
                throw new Error(sessionData?.errors?.[0]?.errorMessage);
            }

            let storedDisplayName = localStorage.getItem("displayName");

            if (!storedDisplayName || shouldFetchUserDetails) {
                storedDisplayName = await fetchUserProfile();
            }

            window.dispatchEvent(new Event("displayNameUpdated"));
        } catch (error) {
            console.error(
                "Error occurred while fetching session or user metadata:",
                error
            );
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
                fetchSessionAndUserInfo(true);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return null;
};

export default LoginSessionStatusChecker;
