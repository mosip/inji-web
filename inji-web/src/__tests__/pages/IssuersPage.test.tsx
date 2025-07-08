import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {mockApiResponse, mockUseApi} from "../../test-utils/setupUseApiMock";
import {useUser} from "../../hooks/User/useUser";
import {RequestStatus} from "../../utils/constants";
import {mockIssuerObjectList} from "../../test-utils/mockObjects";
import {IssuersPage} from "../../pages/IssuersPage";
import {api} from "../../utils/api";

const mockStore = {
    getState: () => ({
        common: {
            language: 'en'
        }
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
};

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(selector => selector(mockStore.getState()))
}));

jest.mock("../../utils/misc", () => {
    const originalModule = jest.requireActual("../../utils/misc");
    const mockRandomString = jest.fn().mockReturnValue("randomChallengeValue");
    return {
        ...originalModule,
        generateRandomString: mockRandomString,
    };
});

jest.mock("../../hooks/useApi", () => ({
    useApi: () => mockUseApi,
}));

jest.mock("../../hooks/User/useUser", () => ({
    useUser: jest.fn(),
}));

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
    },
}));

jest.mock("../../utils/api", () => ({
    api: {
        fetchIssuers: {url: () => "/issuers"},
    },
}));

describe("IssuersPage", () => {
    const mockDispatch = jest.fn();
    const mockFetchUserProfile = jest.fn();
    const mockIsUserLoggedIn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useUser as jest.Mock).mockReturnValue({
            isUserLoggedIn: mockIsUserLoggedIn,
            fetchUserProfile: mockFetchUserProfile,
            error: null,
        });
        mockApiResponse({
            data: {response: {issuers: mockIssuerObjectList}},
            state: RequestStatus.LOADING,
        });
    });

    it("should render component with loading state when data is being fetched", async () => {
        mockIsUserLoggedIn.mockReturnValue(false);
        mockUseApi.state = RequestStatus.LOADING;
        mockApiResponse({
            data: {response: {issuers: mockIssuerObjectList}},
            state: RequestStatus.LOADING,
        });

        render(<IssuersPage/>);

        expect(screen.getByTestId("Home-Page-Container")).toBeInTheDocument();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should fetch issuers and dispatch actions when user is not logged in", async () => {
        mockIsUserLoggedIn.mockReturnValue(false);
        mockUseApi.state = RequestStatus.DONE;
        mockApiResponse({
            data: {response: {issuers: mockIssuerObjectList}},
            state: RequestStatus.DONE,
        });

        render(<IssuersPage/>);

        await waitFor(() => {
            expect(mockFetchUserProfile).not.toHaveBeenCalled();
        });
        expect(mockUseApi.fetchData).toHaveBeenCalledWith({
            apiConfig: api.fetchIssuers,
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    it("should fetch user profile and issuers when user is logged in", async () => {
        mockIsUserLoggedIn.mockReturnValue(true);
        mockFetchUserProfile.mockResolvedValue({});
        mockUseApi.state = RequestStatus.DONE;
        mockApiResponse({
            data: {response: {issuers: mockIssuerObjectList}},
            state: RequestStatus.DONE,
        });

        render(<IssuersPage/>);

        await waitFor(() => {
            expect(mockFetchUserProfile).toHaveBeenCalled();
        });
        expect(mockUseApi.fetchData).toHaveBeenCalledWith({
            apiConfig: api.fetchIssuers,
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    it("should show error toast when API request fails", async () => {
        mockIsUserLoggedIn.mockReturnValue(false);
        mockUseApi.fetchData.mockReset()
        mockApiResponse({
            error: new Error("Failed to fetch issuers"),
            state: RequestStatus.ERROR,
            status: 500,
        });

        render(<IssuersPage/>);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("The service is currently unavailable now. Please try again later.");
        });
    });

    it("should show error toast when fetchUserProfile fails", async () => {
        mockIsUserLoggedIn.mockReturnValue(true);
        (useUser as jest.Mock).mockReturnValue({
            isUserLoggedIn: mockIsUserLoggedIn,
            fetchUserProfile: mockFetchUserProfile,
            error: new Error("User profile fetch failed"),
        });
        mockFetchUserProfile.mockRejectedValue(new Error("User profile fetch failed"));

        mockUseApi.state = RequestStatus.DONE;
        mockApiResponse({
            data: {response: {issuers: mockIssuerObjectList}},
            state: RequestStatus.DONE,
        });

        render(<IssuersPage/>);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("The service is currently unavailable now. Please try again later.");
        });
    });

    it("should handle error when fetchUserProfile promise rejects", async () => {
        mockIsUserLoggedIn.mockReturnValue(true);
        mockFetchUserProfile.mockRejectedValue(new Error("User profile fetch failed"));
        mockUseApi.state = RequestStatus.ERROR;

        render(<IssuersPage/>);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("The service is currently unavailable now. Please try again later.");
        });
    });

    it("should apply className prop to the container when provided", () => {
        mockIsUserLoggedIn.mockReturnValue(false);
        mockUseApi.state = RequestStatus.LOADING;

        render(<IssuersPage className="custom-class"/>);

        const introBoxContainer = screen.getByTestId("Home-Page-Container")
            .querySelector(".custom-class");
        expect(introBoxContainer).toBeInTheDocument();
    });
});