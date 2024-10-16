import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {HelpAccordionItem} from "../../../components/Help/HelpAccordionItem";
import { renderWithProvider } from '../../../test-utils/mockUtils';


describe("Testing the Layout of Help Accordion",() => {
    test('Check if the layout is matching with the snapshots', () => {
        const openHandler = jest.fn();
        const{asFragment} = renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={1} setOpen={openHandler} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if current help item is not open, it should not show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={0} setOpen={openHandler} />);
        const helpElement = screen.getByTestId("Help-Item-Container");
        expect(helpElement.childElementCount).toBe(1);
    });
    test('Check if current help item is open, it should show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={1} setOpen={openHandler} />);
        const helpElement = screen.getByTestId("Help-Item-Container");
        expect(helpElement.childElementCount).toBe(2);
    });

});
describe("Testing the Functionality of Help Accordition Item",()=>{
    test('Check if current help item is open, it should show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={0} setOpen={openHandler} />);
        const helpElement = screen.getByTestId("Help-Item-Container");
        expect(helpElement.childElementCount).toBe(1);
        const buttonElement = screen.getByTestId("Help-Item-Title-Button");
        fireEvent.click(buttonElement);
        expect(openHandler).toHaveBeenCalled();
    });
});
