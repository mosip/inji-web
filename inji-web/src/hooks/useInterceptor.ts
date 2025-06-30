import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {KEYS, ROUTES} from "../utils/constants";
import {useUser} from "./User/useUser";
import {apiInstance} from "./useApi";
import {AppStorage} from "../utils/AppStorage.ts";

export function useInterceptor() {
    const navigate = useNavigate();
    const location = useLocation();
    const {removeUser, isUserLoggedIn} = useUser()

    const interceptor = apiInstance.interceptors.response.use(function (response: any) {
        return response;
    }, function (error: {
        response: {
            config: { url: string; };
            status: number;
        };
    }) {
        const isFetchingWallets = error.response?.config?.url.includes('/wallets');
        console.log("useInterceptor error:", error.response?.config?.url, "Status:", error.response?.status);
        // Redirect to / page on logged-in user if unauthorized access is detected
        const currentRoute = location.pathname + location.search + location.hash;
        if (isUserLoggedIn() || isFetchingWallets) {
            if (error.response && error.response.status === 401) {
                removeUser()
                AppStorage.setItem(KEYS.REDIRECT_TO, currentRoute, true);
                console.warn("Unauthorized access detected. Redirecting to / page.");
                navigate(ROUTES.ROOT)
            }
        }
        return Promise.reject(error);
    });

    useEffect(() => {
        return () => {
            apiInstance.interceptors.response.eject(interceptor);
        };
    }, [navigate, location, interceptor]);
}
