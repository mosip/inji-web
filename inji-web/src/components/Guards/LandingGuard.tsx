import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {SpinningLoader} from "../Common/SpinningLoader";
import {LANDING_VISITED} from "../../utils/constants";

interface LandingGuardProps {
    children: React.ReactNode;
}

export const LandingGuard: React.FC<LandingGuardProps> = ({ children }) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [visited, setVisited] = useState(false);

    useEffect(() => {
        try {
            const flag = sessionStorage.getItem(LANDING_VISITED) === "true";
            setVisited(flag);
        } catch {
            setVisited(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <SpinningLoader />;
    }

    if (!visited) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default LandingGuard;