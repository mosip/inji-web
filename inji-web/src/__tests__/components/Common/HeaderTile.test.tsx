import React from 'react';
import {  screen } from '@testing-library/react';
import { HeaderTile } from "../../../components/Common/HeaderTile";
import { renderWithProvider } from '../../../test-utils/mockUtils';


describe("Testing the Layout of HeaderTile", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = renderWithProvider(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
describe("Testing the Functionality of HeaderTile", () => {
    test('Check if content is rendered properly', () => {
        renderWithProvider(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        expect(screen.getByTestId("HeaderTile-Text")).toHaveTextContent("No Issuers Found");
    });

    test('Check if sub-content is rendered properly', () => {
        renderWithProvider(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        expect(screen.getByTestId("HeaderTile-Text-SubContent")).toHaveTextContent("No Issuers Found");
    });
});
