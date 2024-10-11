import React from 'react';
import { screen } from '@testing-library/react';
import { EmptyListContainer } from "../../../components/Common/EmptyListContainer";
import { renderWithProvider } from '../../../test-utils/mockUtils';


describe("Test EmptyListContainer Layout", () => {
    
    test('check the presence of the container', () => {
        const { asFragment } = renderWithProvider(<EmptyListContainer content={"No Issuers Found"} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
describe("Test EmptyListContainer Functionality", () => {
   
    test('check if content is rendered properly', () => {
        renderWithProvider(<EmptyListContainer content={"No Issuers Found"} />);
        expect(screen.getByTestId("EmptyList-Text")).toHaveTextContent("No Issuers Found");
    });
});
