import React from "react";
import {screen} from "@testing-library/react";
import {AppRouter} from "../Router";
import * as useUserModule from "../hooks/User/useUser";
import {renderMemoryRouterWithProvider} from "../test-utils/mockUtils";

jest.mock('../components/Preview/PDFViewer', () => ({
    PDFViewer: ({previewContent}: {
        previewContent: Blob
    }) => (
        <div data-testid="pdf-viewer">{previewContent && previewContent instanceof Blob ? "Test PDF Content" : ""}</div>
    ),
}));
const mockStore = {
    getState: () => ({
        common: {
            language: 'en'
        }
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(selector => selector(mockStore.getState()))
}));
jest.mock("../hooks/User/useUser");
jest.mock("../components/PageTemplate/Header", () => ({
    Header: () => <div data-testid="header"/>
}));
jest.mock("../components/PageTemplate/Footer", () => ({
    Footer: () => <div data-testid="footer"/>
}));
jest.mock("../components/Common/LoginSessionStatusChecker", () => () => <div data-testid="login-checker"/>);
jest.mock("../pages/HomePage", () => ({
    HomePage: () => <div>HomePage</div>
}));
jest.mock("../pages/User/Passcode/PasscodePage", () => ({
    PasscodePage: () => <div>PasscodePage</div>
}));
jest.mock("../pages/User/ResetPasscode/ResetPasscodePage", () => ({
    ResetPasscodePage: () => <div>ResetPasscodePage</div>
}));
jest.mock("../pages/User/Home/HomePage.tsx", () => ({
    HomePage: () => <div>UserHomePage</div>
}));
jest.mock("../components/User/Header.tsx",() => ({
    Header: () => <div data-testid="user-header">User Header</div>
}));

describe("AppRouter", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders HomePage for root route when not logged in", async () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({isUserLoggedIn: () => false});
        renderMemoryRouterWithProvider(<AppRouter/>, ["/"]);

        await screen.findByText("HomePage");
        expect(screen.getByText("HomePage")).toBeInTheDocument();
        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("redirects to user home when logged in and url is root page", () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => true });
        renderMemoryRouterWithProvider(<AppRouter/>, ["/"]);

        expect(screen.getByText("UserHomePage")).toBeInTheDocument();
    });

    it("redirects to user home when logged in and url is passcode page", () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => true });
        renderMemoryRouterWithProvider(<AppRouter/>, ["/user/passcode"]);

        expect(screen.queryByText("PasscodePage")).not.toBeInTheDocument();
        expect(screen.getByText("UserHomePage")).toBeInTheDocument();
    });

    it('should not redirect to home page when user is not logged in (but session active) when url is passcode page', () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => false });
        renderMemoryRouterWithProvider(<AppRouter/>, ["/user/passcode"]);

        expect(screen.getByText("PasscodePage")).toBeInTheDocument();
        expect(screen.queryByText("UserHomePage")).not.toBeInTheDocument();
    });

    it('should not redirect to home page when user is not logged in (but session active) when url is reset-passcode page', () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => false });
        renderMemoryRouterWithProvider(<AppRouter/>, ["/user/passcode"]);

        expect(screen.getByText("PasscodePage")).toBeInTheDocument();
        expect(screen.queryByText("UserHomePage")).not.toBeInTheDocument();
    });

    it("redirects to user home when logged in and url is reset-passcode page", () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => true });
        renderMemoryRouterWithProvider(<AppRouter/>, ["/user/reset-passcode"]);

        expect(screen.queryByText("ResetPasscodePage")).not.toBeInTheDocument();
        expect(screen.getByText("UserHomePage")).toBeInTheDocument();
    });

    it("renders 404 page for unknown route when in logged in mode", () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => true });
        renderMemoryRouterWithProvider(<AppRouter/>, ["/unknown"]);

        expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });

    it("renders 404 page for unknown route when in guest mode", () => {
        (useUserModule.useUser as jest.Mock).mockReturnValue({ isUserLoggedIn: () => false });
        renderMemoryRouterWithProvider(<AppRouter/>, ["/unknown"]);

        expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
});