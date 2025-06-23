import {useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {api} from "../utils/api";
import {ROUTES} from "../utils/constants";
import {useUser} from "./User/useUser";

export function useAxiosInterceptor() {
    const navigate = useNavigate();
    const location = useLocation();
    const {removeUser} = useUser()

    const interceptor = api.instance.interceptors.response.use(function (response: any) {
        return response;
    }, function (error: { response: { status: number; }; }) {
        if( error.response && error.response.status === 401) {
            console.warn("Unauthorized access detected. Redirecting to / page.");
            removeUser()
            navigate(ROUTES.ROOT, {
                state: {
                    from: location.pathname + location.search + location.hash
                }
            })
        }
        return Promise.reject(error);
    });

    useEffect(() => {
        return () => {
            api.instance.interceptors.response.eject(interceptor);
        };
    }, [navigate, location, interceptor]);
}
