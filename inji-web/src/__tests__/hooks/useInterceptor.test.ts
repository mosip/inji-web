import {renderHook} from "@testing-library/react";
import {useInterceptor} from "../../hooks/useInterceptor";
import {useUser} from "../../hooks/User/useUser";
import {useLocation, useNavigate} from "react-router-dom";
import {apiInstance} from "../../hooks/useApi";
import {ROUTES} from "../../utils/constants";
import {Storage} from "../../utils/Storage";

// Mock dependencies
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

jest.mock("../../utils/Storage.ts", () => ({
    Storage: {
        setItem: jest.fn(),
    },
}))
describe("useInterceptor", () => {
    // Setup mocks before each test
    let navigateMock: jest.Mock;
    let removeUserMock: jest.Mock;
    let isUserLoggedInMock: jest.Mock;
    let interceptorMock: number;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup navigate mock
        navigateMock = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);

        // Setup location mock
        (useLocation as jest.Mock).mockReturnValue({
            pathname: "/test-path",
            search: "?test=true",
            hash: "#test"
        });

        // Setup user hook mocks
        removeUserMock = jest.fn();
        isUserLoggedInMock = jest.fn();
        (useUser as jest.Mock).mockReturnValue({
            removeUser: removeUserMock,
            isUserLoggedIn: isUserLoggedInMock
        });

        // Setup interceptor mock
        interceptorMock = 123; // Some arbitrary interceptor ID
        (apiInstance.interceptors.response.use as jest.Mock).mockReturnValue(interceptorMock);
    });

    test("should set up response interceptor on mount", () => {
        // Render the hook
        renderHook(() => useInterceptor());

        // Verify interceptor was set up
        expect(apiInstance.interceptors.response.use).toHaveBeenCalled();
    });

    test("should clean up interceptor on unmount", () => {
        // Render the hook with ability to unmount
        const {unmount} = renderHook(() => useInterceptor());

        // Unmount the component
        unmount();

        // Verify the interceptor was removed
        expect(apiInstance.interceptors.response.eject).toHaveBeenCalledWith(interceptorMock);
    });

    test("should handle successful responses correctly", () => {
        // Render the hook
        renderHook(() => useInterceptor());

        // Get the success callback from the interceptor
        const successCallback = (apiInstance.interceptors.response.use as jest.Mock).mock.calls[0][0];

        // Test with a sample response
        const mockResponse = {data: "test data"};
        const result = successCallback(mockResponse);

        // The success callback should just return the response
        expect(result).toBe(mockResponse);
    });

    test("should redirect to root when logged-in user receives 401", () => {
        isUserLoggedInMock.mockReturnValue(true);

        renderHook(() => useInterceptor());

        const errorCallback = (apiInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];
        const mockError = {
            response: {
                status: 401,
                config: {
                    url: "/some-endpoint"
                }
            }
        };

        return errorCallback(mockError).catch((error) => {
            expect(removeUserMock).toHaveBeenCalled();
            expect(navigateMock).toHaveBeenCalledWith(ROUTES.ROOT);
            expect(Storage.setItem).toHaveBeenCalledTimes(1)
            expect(Storage.setItem).toHaveBeenCalledWith("redirectTo", "/test-path?test=true#test", true)
            expect(error).toBe(mockError);
        });
    });

    test("should redirect to root when fetching wallets and receives 401", () => {
        const mockError = {
            response: {
                status: 401,
                config: {
                    url: "/wallets"
                }
            }
        };
        isUserLoggedInMock.mockReturnValue(false);
        renderHook(() => useInterceptor());

        const errorCallback = (apiInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];

        return errorCallback(mockError).catch((error: Error) => {
            expect(removeUserMock).toHaveBeenCalled();
            expect(navigateMock).toHaveBeenCalledWith(ROUTES.ROOT);
            expect(Storage.setItem).toHaveBeenCalledTimes(1)
            expect(Storage.setItem).toHaveBeenCalledWith("redirectTo", "/test-path?test=true#test", true)
            expect(error).toBe(mockError);
        });
    });

    test("should not redirect for non-401 errors", () => {
        // Mock user as logged in
        isUserLoggedInMock.mockReturnValue(true);

        // Render the hook
        renderHook(() => useInterceptor());

        // Get the error callback from the interceptor
        const errorCallback = (apiInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];

        // Mock a 500 error
        const mockError = {
            response: {
                status: 500,
                config: {
                    url: "/some-endpoint"
                }
            }
        };

        return errorCallback(mockError).catch((error) => {
            // Verify no redirection happened
            expect(removeUserMock).not.toHaveBeenCalled();
            expect(navigateMock).not.toHaveBeenCalled();
        });
    });

    test("should not redirect for 401 when user is not logged in and not fetching wallets", () => {
        // Mock user as logged out
        isUserLoggedInMock.mockReturnValue(false);

        // Render the hook
        renderHook(() => useInterceptor());

        // Get the error callback from the interceptor
        const errorCallback = (apiInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];

        // Mock a 401 error for a non-wallets endpoint
        const mockError = {
            response: {
                status: 401,
                config: {
                    url: "/some-other-endpoint"
                }
            }
        };

        return errorCallback(mockError).catch((error) => {
            // Verify no redirection happened
            expect(removeUserMock).not.toHaveBeenCalled();
            expect(navigateMock).not.toHaveBeenCalled();
        });
    });
});