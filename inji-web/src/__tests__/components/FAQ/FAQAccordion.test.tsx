import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {FAQAccordion} from "../../../components/Faq/FAQAccordion";
import { renderWithProvider } from '../../../test-utils/mockUtils';
describe("Testing the layout of Faq Accordion",() => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} =  renderWithProvider(<FAQAccordion />)
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if renders the correct number of Faq item containers', () => {
        renderWithProvider(<FAQAccordion />);
        const faqItemElement = screen.getAllByTestId(
            'Faq-Item-Container'
        );
        expect(faqItemElement.length).toBe(23)
    });
    test('Check if renders the correct number of Faq item titles', () => {
        renderWithProvider(<FAQAccordion />);
        const faqItemElement = screen.getAllByTestId("Faq-Item-Title-Text");
        expect(faqItemElement.length).toBe(23)
    });
    test('Check first item should be expanded', () => {
        renderWithProvider(<FAQAccordion />);
        const faqItemElement = screen.getAllByTestId("Faq-Item-Content-Text");
        expect(faqItemElement.length).toBe(1)
    });
})

describe("Testing the Functionality of Faq Accordion",() => {
    test('Check whether Description should open when we press on the title', () => {
        renderWithProvider(<FAQAccordion />);
        const faqItemElement = screen.getAllByTestId("Faq-Item-Container")[1];
        const button = screen.getAllByTestId("Faq-Item-Title-Button")[1];
        expect(faqItemElement.childElementCount).toBe(1)
        fireEvent.click(button);
        expect(faqItemElement.childElementCount).toBe(2)
    });

    test('Check only one description should be open at a time, rest should close', () => {
        renderWithProvider(<FAQAccordion />);
        const faqItemElement = screen.getAllByTestId("Faq-Item-Container")[1];
        const button = screen.getAllByTestId("Faq-Item-Title-Button")[1];
        expect(faqItemElement.childElementCount).toBe(1)
        fireEvent.click(button);
        expect(faqItemElement.childElementCount).toBe(2)
        const overallDescElemet = screen.getAllByTestId("Faq-Item-Content-Text");
        expect(overallDescElemet.length).toBe(1)
    });
})
