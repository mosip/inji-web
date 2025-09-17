import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {mockApiResponse, mockUseApi} from "../../test-utils/setupUseApiMock";
import {useUser} from "../../hooks/User/useUser";
import {RequestStatus} from "../../utils/constants";
import {mockIssuerObjectList, mockStore} from "../../test-utils/mockObjects";
import {IssuersPage} from "../../pages/IssuersPage";
import {api} from "../../utils/api";
import {storeFilteredIssuers, storeIssuers} from "../../redux/reducers/issuersReducer";

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

    it("should exclude issuers specified in IGNORED_ISSUER_IDS when storing issuers list in redux", async () => {
        mockIsUserLoggedIn.mockReturnValue(false);
        mockUseApi.state = RequestStatus.DONE;
        mockApiResponse({
            data: {response: {issuers: mockIssuerObjectList}},
            state: RequestStatus.DONE,
        });
        window._env_.IGNORED_ISSUER_IDS = "issuer1";

        render(<IssuersPage/>);

        await waitFor(() => {
            expect(mockFetchUserProfile).not.toHaveBeenCalled();
        });
        expect(mockUseApi.fetchData).toHaveBeenCalledWith({
            apiConfig: api.fetchIssuers,
        });

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        // Verify that the dispatched data excludes issuers with IDs in IGNORED_ISSUER_IDS
        const filteredIssuers = mockIssuerObjectList.filter(
            (issuer) => !issuer.issuer_id.includes("issuer1")
        );
        expect(mockDispatch).toHaveBeenCalledWith(storeFilteredIssuers(filteredIssuers));
        expect(mockDispatch).toHaveBeenCalledWith(storeIssuers(filteredIssuers));
    });

    it("should store all issuers in redux when IGNORED_ISSUER_IDS env variable is empty", async () => {
        mockIsUserLoggedIn.mockReturnValue(false);
        mockUseApi.state = RequestStatus.DONE;
        mockApiResponse({
            data: {response: {issuers: mockIssuerObjectList}},
            state: RequestStatus.DONE,
        });
        window._env_.IGNORED_ISSUER_IDS = "";

        render(<IssuersPage />);

        await waitFor(() => {
            expect(mockFetchUserProfile).not.toHaveBeenCalled();
        });
        expect(mockUseApi.fetchData).toHaveBeenCalledWith({
            apiConfig: api.fetchIssuers,
        });

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        // Verify that all issuers are dispatched to the store
        expect(mockDispatch).toHaveBeenCalledWith(storeFilteredIssuers(mockIssuerObjectList));
        expect(mockDispatch).toHaveBeenCalledWith(storeIssuers(mockIssuerObjectList));
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