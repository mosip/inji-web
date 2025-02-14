import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../../utils/api";

const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProfileFetched, setIsProfileFetched] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setError(null);
        window.location.href = "http://localhost:8099/v1/mimoto/oauth2/authorize/google";
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');

        if (status === 'success') {
            setIsLoading(false);
            fetchUserProfile();
        } else if (status === 'error') {
            setIsLoading(false);
            setError('Login failed');
        }
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(api.fetchUserProfile.url(), {
                method: api.fetchUserProfile.methodType === 0 ? 'GET' : 'POST',
                headers: {
                    ...api.fetchUserProfile.headers(),
                },
                credentials: 'include',
            });

            if (response.ok) {
                const userProfile = await response.json();
                if (userProfile.displayName) {
                    localStorage.setItem('displayName', userProfile.displayName);
                }
                setIsProfileFetched(true);
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError('Failed to fetch user profile');
        }
    };

    useEffect(() => {
        if (isProfileFetched) {
            window.location.replace("/");
        }
    }, [isProfileFetched, navigate]);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7fc',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#4285f4',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#357ae8',
    };

    const buttonDisabledStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
    };

    const errorStyle: React.CSSProperties = {
        color: 'red',
        marginTop: '10px',
        fontSize: '14px',
    };

    return (
        <div style={containerStyle}>
            <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={isLoading ? buttonDisabledStyle : buttonStyle}
                onMouseEnter={(e) => {
                    if (!isLoading) {
                        (e.target as HTMLElement).style.backgroundColor = '#357ae8';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isLoading) {
                        (e.target as HTMLElement).style.backgroundColor = '#4285f4';
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
