import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {HelpAccordion} from "../../../components/Help/HelpAccordion";
import { renderWithProvider } from '../../../test-utils/mockUtils';
describe("Testing the layout of Help Accordion",() => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} =  renderWithProvider(<HelpAccordion />)
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if renders the correct number of help item containers', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Container");
        expect(helpItemElement.length).toBe(23)
    });
    test('Check if renders the correct number of help item titles', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Title-Text");
        expect(helpItemElement.length).toBe(23)
    });
    test('Check first item should be expanded', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Content-Text");
        expect(helpItemElement.length).toBe(1)
    });
})

describe("Testing the Functionality of Help Accordion",() => {
    test('Check whether Description should open when we press on the title', () => {
        renderWithProvider(<HelpAccordion />);
        const helpItemElement = screen.getAllByTestId("Help-Item-Container")[1];
        const button = screen.getAllByTestId("Help-Item-Title-Button")[1];
        expect(helpItemElement.childElementCount).toBe(1)
        fireEvent.click(button);
        expect(helpItemElement.childElementCount).toBe(2)
    });

    test('Check only one description should be open at a time, rest should close', () => {
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
