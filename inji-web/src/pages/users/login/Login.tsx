import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "../../../utils/api";
import {useUser} from "../../../hooks/useUser";

const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProfileFetched, setIsProfileFetched] = useState(false);
    const navigate = useNavigate();
    const {fetchUserProfile, errorObj} = useUser();

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setError(null);
        window.location.href =
            window._env_.MIMOTO_HOST + "/oauth2/authorize/google";
    };

    useEffect(() => {
        const fetchProfileIfLoginIsSuccess = async () => {
            const params = new URLSearchParams(window.location.search);
            const status = params.get("status");

            if (status === "success") {
                setIsLoading(false);
                try {
                    await fetchUserProfile();
                    setIsProfileFetched(true);
                } catch (error) {
                    setError("Failed to fetch user profile");
                }
            } else if (status === "error") {
                setIsLoading(false);
                setError(params.get("error_message"));
            }
        };

        fetchProfileIfLoginIsSuccess();
    }, [navigate]);


    useEffect(() => {
        if (isProfileFetched) {
            // Trigger event to update the router state
            window.dispatchEvent(new Event("displayNameUpdated"));
            // Redirect to PIN page
            window.location.replace("/pin");
        }
    }, [isProfileFetched, navigate]);

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f7fc"
    };

    const buttonStyle: React.CSSProperties = {
        padding: "10px 20px",
        fontSize: "16px",
        color: "white",
        backgroundColor: "#4285f4",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease"
    };

    const buttonHoverStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: "#357ae8"
    };

    const buttonDisabledStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: "#cccccc",
        cursor: "not-allowed"
    };

    const errorStyle: React.CSSProperties = {
        color: "red",
        marginTop: "10px",
        fontSize: "14px"
    };

    return (
        <div style={containerStyle}>
            <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={isLoading ? buttonDisabledStyle : buttonStyle}
                onMouseEnter={(e) => {
                    if (!isLoading) {
                        (e.target as HTMLElement).style.backgroundColor =
                            "#357ae8";
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isLoading) {
                        (e.target as HTMLElement).style.backgroundColor =
                            "#4285f4";
                    }
                }}
            >
                {isLoading ? "Logging in..." : "Login with Google"}
            </button>
            {error && <p style={errorStyle}>{error}</p>}
        </div>
    );
};

export default Login;
