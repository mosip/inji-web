import React from 'react';
import { render, screen } from '@testing-library/react';
import {HeaderTile} from "../../../components/Common/HeaderTile";



describe("Test Header Tile Container",() => {
    test('check the presence of the container', () => {
        render(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"}/>);
        const headerElement = screen.getByTestId("HeaderTile-Text");
        expect(headerElement).toBeInTheDocument();
    });
    test('check if content is rendered properly', () => {
        render(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        const headerElement = screen.getByTestId("HeaderTile-Text");
        expect(headerElement).toHaveTextContent("No Issuers Found")
    });
    test('check if sub-content is rendered properly', () => {
        render(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        const headerElement = screen.getByTestId("HeaderTile-Text-subContent");
        expect(headerElement).toHaveTextContent("No Issuers Found")
    });
})

