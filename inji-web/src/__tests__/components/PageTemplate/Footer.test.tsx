import React from 'react';
import {render, screen} from '@testing-library/react';
import {Footer} from "../../../components/PageTemplate/Footer";
describe("Testing the Layout of Footer Container",() => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = render(<Footer />);
        expect(asFragment()).toMatchSnapshot();
    });
    
})
describe("Testing the functionality of Footer Container",()=>{
    test('Check if it has the rendered the content properly', () => {
        render(<Footer />);
        const footerElementText = screen.getByTestId("Footer-Text");
        expect(footerElementText).toHaveTextContent("Footer.copyRight");
    });
})

