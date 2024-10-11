import React from 'react';
import {  screen } from '@testing-library/react';
import { HeaderTile } from "../../../components/Common/HeaderTile";
import { renderWithProvider } from '../../../test-utils/mockUtils';


describe("HeaderTile Layout Tests", () => {
    test('check the presence of the container', () => {
        const {asFragment} = renderWithProvider(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
describe("HeaderTile Functionality Tests", () => {
    test('check if content is rendered properly', () => {
        renderWithProvider(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        expect(screen.getByTestId("HeaderTile-Text")).toHaveTextContent("No Issuers Found");
    });

    test('check if sub-content is rendered properly', () => {
        renderWithProvider(<HeaderTile content={"No Issuers Found"} subContent={"No Issuers Found"} />);
        expect(screen.getByTestId("HeaderTile-Text-subContent")).toHaveTextContent("No Issuers Found");
    });
});
