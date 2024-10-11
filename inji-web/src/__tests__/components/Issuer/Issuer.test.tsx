import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Issuer } from '../../../components/Issuers/Issuer';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { reduxStore } from '../../../redux/reduxStore';
import { IssuerObject } from '../../../types/data';
import { mockIssuerObject } from '../../../test-utils/mockObjects';

// Mock the initial state of the store
reduxStore.dispatch({ type: 'STORE_COMMON_LANGUAGE', language: 'en' });
const mockIssuer : IssuerObject = mockIssuerObject;

const renderwithprovider = () => {
        jest.spyOn(require('../../../utils/i18n'), 'getObjectForCurrentLanguage').mockReturnValue(mockIssuer.display[0]);
        return render(
            <Provider store={reduxStore}>
                <Router>
                    <Issuer index={1} issuer={mockIssuer} />
                </Router>
            </Provider>
        );
    }
describe("Test the layout of the Issuer Component",()=> {
    test('check the presence of the container', () => {
        const {asFragment} =  renderwithprovider()
        expect(asFragment()).toMatchSnapshot();
    });
});
describe('Test Issuer Component', () => {

    let originalOpen: typeof window.open;

    beforeAll(() => {
        originalOpen = window.open;
        window.open = jest.fn();
    });

    afterAll(() => {
        window.open = originalOpen;
    });
    test('check if content is rendered properly', () => {
        renderwithprovider();
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("Name");
    });

    test('check if onClick function is called', () => {
        renderwithprovider();
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        fireEvent.click(itemBoxElement);
        expect(window.location.pathname).toBe('/issuers/test-issuer');
    });
});
