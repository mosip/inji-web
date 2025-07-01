import {renderHook} from "@testing-library/react";
import {useInterceptor} from "../../hooks/useInterceptor";
import {useUser} from "../../hooks/User/useUser";
import {useLocation, useNavigate} from "react-router-dom";
import {apiInstance} from "../../hooks/useApi";
import {ROUTES} from "../../utils/constants";
import {AppStorage} from "../../utils/AppStorage";

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn()
}));

jest.mock("../../hooks/User/useUser", () => ({
    useUser: jest.fn()
}));

jest.mock("../../hooks/useApi", () => ({
    apiInstance: {
        interceptors: {
            response: {
                use: jest.fn(),
                eject: jest.fn()
            }
        }
    }
}));

jest.mock("../../utils/AppStorage.ts", () => ({
    AppStorage: {
        setItem: jest.fn(),
    },
}))
describe("useInterceptor", () => {
    let navigateMock: jest.Mock;
    let removeUserMock: jest.Mock;
    let isUserLoggedInMock: jest.Mock;
    let interceptorMock: number;

    beforeEach(() => {
        jest.clearAllMocks();

        navigateMock = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);

        (useLocation as jest.Mock).mockReturnValue({
            pathname: "/test-path",
            search: "?test=true",
            hash: "#test"
        });

        removeUserMock = jest.fn();
        isUserLoggedInMock = jest.fn();
        (useUser as jest.Mock).mockReturnValue({
            removeUser: removeUserMock,
            isUserLoggedIn: isUserLoggedInMock
        });

        interceptorMock = 123; // Some arbitrary interceptor ID
        (apiInstance.interceptors.response.use as jest.Mock).mockReturnValue(interceptorMock);
    });

    const getErrorCallback = () => {
        renderHook(() => useInterceptor());
        return (apiInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];
    };

    test("should set up response interceptor on mount", () => {
        renderHook(() => useInterceptor());

        expect(apiInstance.interceptors.response.use).toHaveBeenCalled();
    });

    test("should clean up interceptor on unmount", () => {
        const {unmount} = renderHook(() => useInterceptor());

        unmount();

        expect(apiInstance.interceptors.response.eject).toHaveBeenCalledWith(interceptorMock);
    });

    test("should handle successful responses correctly", () => {
        renderHook(() => useInterceptor());

        const successCallback = (apiInstance.interceptors.response.use as jest.Mock).mock.calls[0][0];
        const mockResponse = {data: "test data"};
        const result = successCallback(mockResponse);

        expect(result).toBe(mockResponse);
    });

    test("should redirect to root when logged-in user receives 401 on logged in", async () => {
        isUserLoggedInMock.mockReturnValue(true);
        const errorCallback = getErrorCallback()

        const mockError = {
            response: {
                status: 401,
                config: {
                    url: "/some-endpoint"
                }
            }
        };

        await assertRedirectToLogin(errorCallback, mockError);
    });

    test("should redirect to root when fetching wallets and receives 401", async () => {
        const mockError = {
            response: {
                status: 401,
                config: {
                    url: "/wallets"
                }
            }
        };
        isUserLoggedInMock.mockReturnValue(false);

        const errorCallback = getErrorCallback();

        await assertRedirectToLogin(errorCallback, mockError)
    });

    test("should not redirect for non-401 errors", async () => {
        isUserLoggedInMock.mockReturnValue(true);

        const errorCallback = getErrorCallback()
        const mockError = {
            response: {
                status: 500,
                config: {
                    url: "/some-endpoint"
                }
            }
        };

        await expect(errorCallback(mockError)).rejects.toBe(mockError);
        expect(removeUserMock).not.toHaveBeenCalled();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    test("should not redirect for 401 when user is not logged in and accessing any protected api", async () => {
        isUserLoggedInMock.mockReturnValue(false);

        const errorCallback = getErrorCallback();

        const mockError = {
            response: {
                status: 401,
                config: {
                    url: "/some-other-endpoint"
                }
            }
        };
        await expect(errorCallback(mockError)).rejects.toBe(mockError);
        expect(removeUserMock).not.toHaveBeenCalled();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    async function assertRedirectToLogin(errorCallback: (arg0: { response: { status: number; config: { url: string; }; }; }) => any, mockError: { response: { status: number; config: { url: string } } }) {
        await expect(errorCallback(mockError)).rejects.toBe(mockError);
        expect(removeUserMock).toHaveBeenCalled();
        expect(navigateMock).toHaveBeenCalledWith(ROUTES.ROOT);
        expect(AppStorage.setItem).toHaveBeenCalledTimes(1);
        expect(AppStorage.setItem).toHaveBeenCalledWith("redirectTo", "/test-path?test=true#test", true);
    }
});