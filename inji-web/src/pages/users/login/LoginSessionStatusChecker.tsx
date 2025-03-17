import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "../../../utils/api";

const LoginSessionStatusChecker = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessionAndUserInfo = async () => {
            try {
                const sessionResponse = await fetch(
                    api.fetchUserLoginStatus.url(),
                    {
                        method:
                            api.fetchUserLoginStatus.methodType === 0
                                ? "GET"
                                : "POST",
                        headers: {
                            ...api.fetchUserLoginStatus.headers()
                        },
                        credentials: "include"
                    }
                );

                const sessionData = await sessionResponse.json();
                const loginSessionStatus = sessionData?.response;

                if (!sessionResponse.ok) {
                    throw new Error("Session expired");
                }

                let storedDisplayName = localStorage.getItem("displayName");

                if (!storedDisplayName) {
                    const userProfileResponse = await fetch(
                        api.fetchUserProfile.url(),
                        {
                            method:
                                api.fetchUserProfile.methodType === 0
                                    ? "GET"
                                    : "POST",
                            headers: {
                                ...api.fetchUserProfile.headers()
                            },
                            credentials: "include"
                        }
                    );

                    const userProfileData = await userProfileResponse.json();

                    if (userProfileResponse.ok) {
                        try {
                            const userInfo = JSON.parse(
                                userProfileData.response
                            );
                            if (userInfo?.displayName) {
                                localStorage.setItem(
                                    "displayName",
                                    userInfo.displayName
                                );
                                storedDisplayName = userInfo.displayName;
                            }
                        } catch (error) {
                            console.error("Error parsing user info:", error);
                        }
                    } else {
                        console.error(
                            "Failed to fetch user profile:",
                            userProfileData.errors
                        );
                    }
                }
                window.dispatchEvent(new Event("displayNameUpdated"));
            } catch (error) {
                console.error("Error fetching user session : ", error);
                localStorage.removeItem("displayName");
                window.dispatchEvent(new Event("displayNameUpdated"));
                navigate("/");
            }
        };

        fetchSessionAndUserInfo();
    }, []);

    return null;
};

export default LoginSessionStatusChecker;
