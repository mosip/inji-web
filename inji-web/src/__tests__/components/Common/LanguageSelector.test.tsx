import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '../../../components/Common/LanguageSelector';
import { Provider } from 'react-redux';
import { reduxStore } from '../../../redux/reduxStore';

describe("Test Language Selector", () => {
    const renderWithProvider = () => {
        render(
            <Provider store={reduxStore}>
                <LanguageSelector />
            </Provider>
        );
    };

    test('check the presence of the Language Selector', () => {
        renderWithProvider();
        const languageSelector = screen.getByTestId("LanguageSelector-Outer-Div");
        expect(languageSelector).toBeInTheDocument();
    });

    test('check if the default language is rendered properly', () => {
        renderWithProvider();
        const selectedLanguage = screen.getByTestId("Language-Selector-Selected-DropDown-en");
        expect(selectedLanguage).toHaveTextContent("English");
    });

    test('check if dropdown opens and closes', () => {
        renderWithProvider();
        const button = screen.getByTestId("Language-Selector-Button");
        fireEvent.mouseDown(button);
        const dropdownItem = screen.getByTestId("Language-Selector-DropDown-Item-en");
        expect(dropdownItem).toBeInTheDocument();
        fireEvent.mouseDown(button);
        expect(screen.queryByTestId("Language-Selector-DropDown-Item-en")).not.toBeInTheDocument();
    });

    // test('check if language changes on selection', () => {
    //     renderWithProvider();
    //     const button = screen.getByTestId("Language-Selector-Button");
    //     fireEvent.mouseDown(button);
    //     const dropdownItem = screen.getByTestId("Language-Selector-DropDown-Item-fr");
    //     fireEvent.mouseDown(dropdownItem);
    //     const selectedLanguage = screen.getByTestId("Language-Selector-Selected-DropDown-fr");
    //     expect(selectedLanguage).toHaveTextContent("Français");
    // });
});
