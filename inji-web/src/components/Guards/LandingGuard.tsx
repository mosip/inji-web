import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface LandingGuardProps {
    children: React.ReactNode;
}

export const LandingGuard: React.FC<LandingGuardProps> = ({ children }) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [visited, setVisited] = useState(false);

    useEffect(() => {
        try {
            const flag = sessionStorage.getItem("landingVisited") === "true";
            setVisited(flag);
        } catch {
            setVisited(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return null;
    }

    if (!visited) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default LandingGuard;