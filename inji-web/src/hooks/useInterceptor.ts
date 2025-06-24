import {useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {api} from "../utils/api";
import {ROUTES} from "../utils/constants";
import {useUser} from "./User/useUser";

//TODO: Add tests for this hook
export function useInterceptor() {
    const navigate = useNavigate();
    const location = useLocation();
    const {removeUser, isUserLoggedIn} = useUser()

    const interceptor = api.instance.interceptors.response.use(function (response: any) {
        return response;
    }, function (error: {
        response: {
            config: { url: string; };
            status: number;
        };
    }) {
        // Redirect to / page on logged-in user if unauthorized access is detected
        if (isUserLoggedIn()) {
            if (error.response && error.response.status === 401) {
                console.warn("Unauthorized access detected. Redirecting to / page.");
                removeUser()
                navigate(ROUTES.ROOT, {
                    state: {
                        from: location.pathname + location.search + location.hash
                    }
                })
            }
        }
        return Promise.reject(error);
    });

    useEffect(() => {
        return () => {
            api.instance.interceptors.response.eject(interceptor);
        };
    }, [navigate, location, interceptor]);
}
