import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {HelpAccordionItem} from "../../../components/Help/HelpAccordionItem";
import { renderWithProvider } from '../../../test-utils/mockUtils';


describe("Test Help Accordion Container",() => {
    test('check the presence of the container', () => {
        const openHandler = jest.fn();
        const{asFragment} = renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={1} setOpen={openHandler} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('if current help item is not open, it should not show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={0} setOpen={openHandler} />);
        const helpElement = screen.getByTestId("Help-Item-Container");
        expect(helpElement.childElementCount).toBe(1);
    });
    test('if current help item is open, it should show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={1} setOpen={openHandler} />);
        const helpElement = screen.getByTestId("Help-Item-Container");
        expect(helpElement.childElementCount).toBe(2);
    });

});
describe("Test the working of the Help Accordition Item",()=>{
    test('if current help item is open, it should show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(<HelpAccordionItem id={1} title={"HelpTitle"} content={["HelpContent"]} open={0} setOpen={openHandler} />);
        const helpElement = screen.getByTestId("Help-Item-Container");
        expect(helpElement.childElementCount).toBe(1);
        const buttonElement = screen.getByTestId("Help-Item-Title-Button");
        fireEvent.click(buttonElement);
        expect(openHandler).toHaveBeenCalled();
    });
});
