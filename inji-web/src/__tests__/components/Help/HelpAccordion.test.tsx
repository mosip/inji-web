import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {HelpAccordion} from "../../../components/Help/HelpAccordion";
import { renderWithProvider } from '../../../test-utils/mockUtils';
describe("Test layout of Help Accordion Container",() => {
    test('check the presence of the container', () => {
        const {asFragment} =  renderWithProvider(<HelpAccordion />)
        expect(asFragment()).toMatchSnapshot();
    });

    test('check if renders the correct number of help item containers', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Container");
        expect(helpItemElement.length).toBe(23)
    });
    test('check if renders the correct number of help item titles', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Title-Text");
        expect(helpItemElement.length).toBe(23)
    });
    test('check first item should be expanded', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Content-Text");
        expect(helpItemElement.length).toBe(1)
    });
})

describe("Test Help Accordion Working",() => {
    test('The Description should open when we press on the title', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Container")[1];
        const button = screen.getAllByTestId("Help-Item-Title-Button")[1];
        expect(helpItemElement.childElementCount).toBe(1)
        fireEvent.click(button);
        expect(helpItemElement.childElementCount).toBe(2)
    });

    test('only one description should be open at a time, rest should close', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Container")[1];
        const button = screen.getAllByTestId("Help-Item-Title-Button")[1];
        expect(helpItemElement.childElementCount).toBe(1)
        fireEvent.click(button);
        expect(helpItemElement.childElementCount).toBe(2)
        const overallDescElemet = screen.getAllByTestId("Help-Item-Content-Text");
        expect(overallDescElemet.length).toBe(1)
    });
})
