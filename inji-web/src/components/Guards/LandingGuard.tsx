import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasVisitedLanding } from "../../utils/sessions";

interface LandingGuardProps {
    children: React.ReactNode;
}

export const LandingGuard: React.FC<LandingGuardProps> = ({ children }) => {
    const location = useLocation();

    if (!hasVisitedLanding()) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default LandingGuard;
