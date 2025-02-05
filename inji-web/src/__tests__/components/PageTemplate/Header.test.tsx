import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Header } from "../../../components/PageTemplate/Header";
import { mockCrypto } from '../../../test-utils/mockUtils';
import { renderWithProvider,mockUseLanguageSelector } from '../../../test-utils/mockUtils';

mockUseLanguageSelector();
global.crypto = mockCrypto;
//todo : extract the local method to mockUtils, which is added to bypass the routing problems
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

describe("Header Container Layout Test", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const { asFragment } = renderWithProvider((<Header />));
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing Header Container Functionality", () => {
    test("Check the length of the Header menu elements", () => {
        renderWithProvider((<Header />));
        const headerElementLi = screen.getByTestId("Header-Menu-Elements");
        expect(headerElementLi.children.length).toBe(2);
    });

    // Uncomment and fix these tests if needed
    // test('check the presence of the help', () => {
    //     render(wrapUnderRouter(<Header />));
    //     const headerElementLi = screen.getByTestId("Header-Menu-Help");
    //     expect(headerElementLi).toBeInTheDocument();
    //     expect(headerElementLi).toHaveTextContent("Header.help");
    //     const headerElementDiv = screen.getByTestId("Header-Menu-Help-div");
    //     expect(headerElementDiv).toBeInTheDocument();

    //     jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockUseNavigate);
    //     fireEvent.click(headerElementDiv);

    //     expect(mockedUsedNavigate).toHaveBeenCalled();
    //     expect(mockedUsedNavigate).toHaveBeenCalledWith("/help");
    // });

    // test('check the presence of the About Inji', () => {
    //     render(wrapUnderRouter(<Header />));
    //     const headerElementLi = screen.getByTestId("Header-Menu-AboutInji");
    //     expect(headerElementLi).toBeInTheDocument();
    //     expect(headerElementLi).toHaveTextContent("Header.aboutInji");
    //     const headerElementDiv = screen.getByTestId("Header-Menu-Help-div");
    //     expect(headerElementDiv).toBeInTheDocument();

    //     jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockUseNavigate);
    //     fireEvent.click(headerElementDiv);

    //     expect(mockedUsedNavigate).toHaveBeenCalled();
    // });

    // test('Check the presence of the Language Selector', () => {
    //     renderWithProvider((<Header />));
    //     const headerElementLi = screen.getByTestId("Header-Menu-LanguageSelector");
    //     expect(headerElementLi).toBeInTheDocument();
    //     const headerElementDiv = screen.getByTestId("Header-Menu-Help-div");
    //     expect(headerElementDiv).toBeInTheDocument();

    //     jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockUseNavigate);
    //     fireEvent.click(headerElementDiv);

    //     expect(mockedUsedNavigate).toHaveBeenCalled();
    // });
});
