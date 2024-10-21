import React from 'react';
import { screen } from '@testing-library/react';
import { EmptyListContainer } from "../../../components/Common/EmptyListContainer";
import { renderWithProvider } from '../../../test-utils/mockUtils';


describe("Testing the Layouts of EmptyListContainer", () => {
    
    test('Check if the layout is matching with the snapshots', () => {
        const { asFragment } = renderWithProvider(<EmptyListContainer content={"No Issuers Found"} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
describe("Testing the Functionality EmptyListContainer", () => {
   
    test('Check if content is rendered properly', () => {
        renderWithProvider(<EmptyListContainer content={"No Issuers Found"} />);
        expect(screen.getByTestId("EmptyList-Text")).toHaveTextContent("No Issuers Found");
    });
});
