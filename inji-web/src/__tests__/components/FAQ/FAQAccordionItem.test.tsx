import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {FAQAccordionItem} from "../../../components/Faq/FAQAccordionItem";
import { renderWithProvider } from '../../../test-utils/mockUtils';


describe("Testing the Layout of Faq Accordion",() => {
    test('Check if the layout is matching with the snapshots', () => {
        const openHandler = jest.fn();
        const{asFragment} = renderWithProvider(<FAQAccordionItem id={1} title={"FaqTitle"} content={["FaqContent"]} open={1} setOpen={openHandler} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if current Faq item is not open, it should not show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(
            <FAQAccordionItem
                id={1}
                title={'FaqTitle'}
                content={['FaqContent']}
                open={0}
                setOpen={openHandler}
            />
        );
        const faqElement = screen.getByTestId('faq-Item-Container');
        expect(faqElement.childElementCount).toBe(1);
    });
    test('Check if current Faq item is open, it should show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(
            <FAQAccordionItem
                id={1}
                title={'FaqTitle'}
                content={['FaqContent']}
                open={1}
                setOpen={openHandler}
            />
        );
        const faqElement = screen.getByTestId('Faq-Item-Container');
        expect(faqElement.childElementCount).toBe(2);
    });

});
describe('Testing the Functionality of Faq Accordition Item', () => {
    test('Check if current Faq item is open, it should show description', () => {
        const openHandler = jest.fn();
        renderWithProvider(
            <FAQAccordionItem
                id={1}
                title={'FaqTitle'}
                content={['FaqContent']}
                open={0}
                setOpen={openHandler}
            />
        );
        const faqElement = screen.getByTestId('Faq-Item-Container');
        expect(faqElement.childElementCount).toBe(1);
        const buttonElement = screen.getByTestId('Faq-Item-Title-Button');
        fireEvent.click(buttonElement);
        expect(openHandler).toHaveBeenCalled();
    });
});
