import React from "react";
import {screen} from "@testing-library/react";
import {AppRouter} from "../Router";
import * as useUserModule from "../hooks/User/useUser";
import {renderMemoryRouterWithProvider} from "../test-utils/mockUtils";
import {AppStorage} from "../utils/AppStorage";
import {mockStore, userProfile} from "../test-utils/mockObjects";

jest.mock('../components/Preview/PDFViewer', () => ({
    PDFViewer: ({previewContent}: {
        previewContent: Blob
    }) => (
        <div data-testid="pdf-viewer">{previewContent && previewContent instanceof Blob ? "Test PDF Content" : ""}</div>
    ),
}));

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
jest.mock("../components/User/Header.tsx", () => ({
    Header: () => <div data-testid="user-header">User Header</div>
}));
jest.mock("../utils/AppStorage.ts", () => ({
    AppStorage: {
        getItem: jest.fn(),
    },
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

    it.each`
    route                    | notExpected           | expected
    ${"/"}                   | ${"HomePage"}          | ${"UserHomePage"}
    ${"/user/passcode"}      | ${"PasscodePage"}     | ${"UserHomePage"}
    ${"/user/reset-passcode"}| ${"ResetPasscodePage"}| ${"UserHomePage"}
`(
        "redirects to user home when logged in and url is $route",
        ({route, notExpected, expected}) => {
            (useUserModule.useUser as jest.Mock).mockReturnValue({isUserLoggedIn: () => true});

            renderMemoryRouterWithProvider(<AppRouter/>, [route]);

            expect(screen.queryByText(notExpected)).not.toBeInTheDocument();
            expect(screen.getByText(expected)).toBeInTheDocument();
        }
    );

    it.each`
    route                      | expectedPage         | notExpectedPage
    ${"/user/passcode"}        | ${"PasscodePage"}    | ${"UserHomePage"}
    ${"/user/reset-passcode"}  | ${"ResetPasscodePage"} | ${"UserHomePage"}
`(
        'should not redirect to home page when user is not logged in (but session active) when url is $route',
        ({route, expectedPage, notExpectedPage}) => {
            (useUserModule.useUser as jest.Mock).mockReturnValue({isUserLoggedIn: () => false});
            // Mock storage with user (active session) but locked wallet
            (AppStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(userProfile));

            renderMemoryRouterWithProvider(<AppRouter/>, [route]);

            expect(screen.getByText(expectedPage)).toBeInTheDocument();
            expect(screen.queryByText(notExpectedPage)).not.toBeInTheDocument();
        }
    );

    it.each`
    isLoggedIn | description                | route         | expectedText
    ${true}    | ${"logged in mode"}        | ${"/unknown"} | ${/not found/i}
    ${false}   | ${"guest mode"}            | ${"/unknown"} | ${/not found/i}
`(
        "renders 404 page for unknown route when in $description",
        ({isLoggedIn, route, expectedText}) => {
            (useUserModule.useUser as jest.Mock).mockReturnValue({isUserLoggedIn: () => isLoggedIn});
            renderMemoryRouterWithProvider(<AppRouter/>, [route]);
            expect(screen.getByText(expectedText)).toBeInTheDocument();
        }
    );
});