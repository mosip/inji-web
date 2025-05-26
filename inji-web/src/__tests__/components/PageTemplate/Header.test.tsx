import {screen} from '@testing-library/react';
import {Header} from '../../../components/PageTemplate/Header';
import {createRefElement, mockCrypto} from '../../../test-utils/mockUtils';
import {
    renderWithProvider,
    mockUseLanguageSelector
} from "../../../test-utils/mockUtils";
import {useCookies} from "react-cookie";

mockUseLanguageSelector();
global.crypto = mockCrypto;
//todo : extract the local method to mockUtils, which is added to bypass the routing problems
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate
}));

jest.mock("react-cookie", () => {
    return {
        ...jest.requireActual("react-cookie"),
        useCookies: jest.fn().mockReturnValue([{},jest.fn()])
    };
});

global.fetch = jest.fn(() =>
    Promise.resolve(
        new Response(JSON.stringify({success: true}), {
            status: 200,
            headers: {"Content-Type": "application/json"}
        })
    )
);

describe("Header Container Layout Test", () => {
    test("Check if the layout is matching with the snapshots", () => {
        (useCookies as jest.Mock).mockReturnValue([
            {"XSRF-TOKEN": "test-xsrf-token"},
            jest.fn()
        ]);
        const {asFragment} = renderWithProvider(
            <Header headerRef={createRefElement()} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing Header Container Functionality", () => {
    beforeEach(() => {
        (useCookies as jest.Mock).mockReturnValue([
            {"XSRF-TOKEN": "test-xsrf-token"},
            jest.fn()
        ]);
        renderWithProvider(<Header headerRef={createRefElement()} />);
    });

    test('Check the presence of all Header elements', () => {
        // Check Logo
        expect(screen.getByTestId("Header-InjiWeb-Logo")).toBeInTheDocument();
        
        // Check FAQ
        expect(screen.getByTestId("Header-Menu-FAQ")).toBeInTheDocument();
        
        // Check Language Selector
        expect(screen.getByTestId("Header-Menu-LanguageSelector")).toBeInTheDocument();
    });

    // Should match Logo and FAQ/Language Selector container.
    test("Check the length of Header elements", () => {
        const headerContainer = screen.getByTestId("Header-Container");
        
        expect(headerContainer.children.length).toBe(2);
    });

    // Should match FAQ and Language-Selector Containers.
    test('Check the length of FAQ-LanguageSelector container elements', () => {
        const headerContainer = screen.getByTestId("Header-FAQ-LanguageSelector-Container");

        expect(headerContainer.children.length).toBe(2);
    });

    // Should match Logo and Hamburger menu.
    test("Check the length of Logo-HamburgerMenu container elements", () => {
        const headerContainer = screen.getByTestId("Header-InjiWeb-Logo-Container");

        expect(headerContainer.children.length).toBe(2);
    });
});
