import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {Header} from "../../../components/PageTemplate/Header";
import {mockUseNavigate, wrapUnderRouter} from "../../../utils/mockUtils";

const mockedUsedNavigate = jest.fn();
// const originalWindowEnv = global.window._env_;

jest.mock('../../../components/Common/LanguageSelector', () => ({
    LanguageSelector: () => <></>,
}))
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}))

window._env_ = {
    DEFAULT_FAVICON: "favicon.ico",
    DEFAULT_FONT_URL: "",
    DEFAULT_THEME: "purple_theme",
    DEFAULT_TITLE: "Inji Web Test",
    DEFAULT_LANG: 'en'
};

describe("Header Container",() => {

    test('check the presence of the three menus in the header', () => {
        render(wrapUnderRouter(<Header />));
        const headerElementLi = screen.getByTestId("Header-Menu-Elements");
        expect(headerElementLi).toBeInTheDocument();
        expect(headerElementLi.children.length).toBe(3);
    });

    // test('check the presence of the help', () => {
    //     render(wrapUnderRouter(<Header />));
    //     const headerElementLi = screen.getByTestId("Header-Menu-Help");
    //     expect(headerElementLi).toBeInTheDocument()
    //     expect(headerElementLi).toHaveTextContent("Header.help");
    //     const headerElementDiv = screen.getByTestId("Header-Menu-Help-div");
    //     expect(headerElementDiv).toBeInTheDocument()
    //
    //     jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockUseNavigate);
    //     fireEvent.click(headerElementDiv);
    //
    //     expect(mockedUsedNavigate).toHaveBeenCalled();
    //     expect(mockedUsedNavigate).toHaveBeenCalledWith("/help");
    // });
    //
    // test('check the presence of the About Inji', () => {
    //     render(wrapUnderRouter(<Header />));
    //     const headerElementLi = screen.getByTestId("Header-Menu-AboutInji");
    //     expect(headerElementLi).toBeInTheDocument()
    //     expect(headerElementLi).toHaveTextContent("Header.aboutInji");
    //     const headerElementDiv = screen.getByTestId("Header-Menu-Help-div");
    //     expect(headerElementDiv).toBeInTheDocument()
    //
    //     jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockUseNavigate);
    //     fireEvent.click(headerElementDiv);
    //
    //     expect(mockedUsedNavigate).toHaveBeenCalled();
    // });

    test('check the presence of the Langauge Selector', () => {
        render(wrapUnderRouter(<Header />));
        const headerElementLi = screen.getByTestId("Header-Menu-LanguageSelector");
        expect(headerElementLi).toBeInTheDocument()
        const headerElementDiv = screen.getByTestId("Header-Menu-Help-div");
        expect(headerElementDiv).toBeInTheDocument()

        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockUseNavigate);
        fireEvent.click(headerElementDiv);

        expect(mockedUsedNavigate).toHaveBeenCalled();
    });
})

