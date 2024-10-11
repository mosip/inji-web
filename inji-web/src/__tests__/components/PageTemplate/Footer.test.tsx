import React from 'react';
import {render, screen} from '@testing-library/react';
import {Footer} from "../../../components/PageTemplate/Footer";
describe("Footer Container",() => {
    test('check the presence of the container', () => {
        const {asFragment} = render(<Footer />);
        expect(asFragment()).toMatchSnapshot();
    });
    
})
describe("Test the functionality of the Footer Container",()=>{
    test('check the presence of the container', () => {
        render(<Footer />);
        const footerElementText = screen.getByTestId("Footer-Text");
        expect(footerElementText).toHaveTextContent("Footer.copyRight");
    });
})

