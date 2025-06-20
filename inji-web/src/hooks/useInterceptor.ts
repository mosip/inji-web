import {useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {api} from "../utils/api";

export function useAxiosInterceptor() {
    const navigate = useNavigate();
    const location = useLocation();

    const interceptor = api.instance.interceptors.response.use(function (response: any) {
        console.log("interceptor response", response);
        return response;
    }, function (error: { response: { status: number; }; }) {
        console.log("interceptor error out", error.response);
        if( error.response && error.response.status === 401) {
            navigate("user/passcode", {
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
