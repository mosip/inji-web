import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '../../../components/Common/LanguageSelector';
import { renderWithProvider } from '../../../test-utils/mockUtils'; // Import from mockutils

describe("Language Selector Component Layout Tests", () => {
    test('check the presence of the Language Selector', () => {
        const { asFragment } = renderWithProvider(<LanguageSelector />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Language Selector Component Functionality Tests", () => {
    test('check if dropdown opens and closes', () => {
        renderWithProvider(<LanguageSelector />);
        const button = screen.getByTestId("Language-Selector-Button");
        fireEvent.mouseDown(button);
        const dropdownItem = screen.getByTestId("Language-Selector-DropDown-Item-en");
        expect(dropdownItem).toBeInTheDocument();
        fireEvent.mouseDown(button);
        expect(screen.queryByTestId("Language-Selector-DropDown-Item-en")).not.toBeInTheDocument();
    });

    // Uncomment and update this test if needed
    // test('check if language changes on selection', () => {
    //     renderWithProvider(<LanguageSelector />);
    //     const button = screen.getByTestId("Language-Selector-Button");
    //     fireEvent.mouseDown(button);
    //     const dropdownItem = screen.getByTestId("Language-Selector-DropDown-Item-fr");
    //     fireEvent.mouseDown(dropdownItem);
    //     const selectedLanguage = screen.getByTestId("Language-Selector-Selected-DropDown-fr");
    //     expect(selectedLanguage).toHaveTextContent("Français");
    // });
});
