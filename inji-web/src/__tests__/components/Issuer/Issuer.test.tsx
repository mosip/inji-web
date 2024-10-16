import React from 'react';
import {screen, fireEvent } from '@testing-library/react';
import { Issuer } from '../../../components/Issuers/Issuer';
import { reduxStore } from '../../../redux/reduxStore';
import { IssuerObject } from '../../../types/data';
import { mockIssuerObject } from '../../../test-utils/mockObjects';
import { renderWithProvider } from '../../../test-utils/mockUtils';
reduxStore.dispatch({ type: 'STORE_COMMON_LANGUAGE', language: 'en' });
const mockIssuer : IssuerObject = mockIssuerObject;
describe("Testing the layout of Issuer Component",()=> {
    test('Check if the layout is matching with the snapshots', () => {
        jest.spyOn(require('../../../utils/i18n'), 'getObjectForCurrentLanguage').mockReturnValue(mockIssuer.display[0]);
        const {asFragment} =  renderWithProvider(<Issuer index={1} issuer={mockIssuer} />)
        expect(asFragment()).toMatchSnapshot();
    });
});
describe('Testing the Functionality of Issuer Component', () => {

    let originalOpen: typeof window.open;

    beforeAll(() => {
        originalOpen = window.open;
        window.open = jest.fn();
    });
    beforeEach(()=>{
        jest.spyOn(require('../../../utils/i18n'), 'getObjectForCurrentLanguage').mockReturnValue(mockIssuer.display[0]);
    })

    test('Check if content is rendered properly', () => {
        renderWithProvider(<Issuer index={1} issuer={mockIssuer} />)
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("Name");
    });

    test('Check if onClick function is called', () => {
        renderWithProvider(<Issuer index={1} issuer={mockIssuer} />)
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        fireEvent.click(itemBoxElement);
        expect(window.location.pathname).toBe('/issuers/test-issuer');
    });
    afterAll(() => {
        window.open = originalOpen;
    });
});
