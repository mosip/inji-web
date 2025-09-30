import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface LandingGuardProps {
    children: React.ReactNode;
}

export const LandingGuard: React.FC<LandingGuardProps> = ({ children }) => {
    const location = useLocation();

    const hasVisitedLanding = () => {
        try {
            return sessionStorage.getItem("landingVisited") === "true";
        } catch {
            return false;
        }
    };

    if (!hasVisitedLanding()) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default LandingGuard;