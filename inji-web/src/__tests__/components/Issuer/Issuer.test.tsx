import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Issuer } from '../../../components/Issuers/Issuer';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { reduxStore } from '../../../redux/reduxStore';
import { IssuerObject } from '../../../types/data';

// Mock data
const getMockIssuer = (): IssuerObject => {
    return {
        name: 'Test Issuer',
        desc: 'Test Description',
        protocol: 'OTP' as 'OTP', // Explicitly set the type to 'OTP' or 'OpenId4VCI'
        credential_issuer: 'test-issuer',
        authorization_endpoint: 'https://auth.test.com',
        credentials_endpoint: 'https://credentials.test.com',
        display: [{
            name: "Name",
            language: "en",
            locale: "en",
            logo: {
                url: "https://url.com",
                alt_text: "alt text of the url"
            },
            title: "Title",
            description: "Description",
        }],
        client_id: 'test-client-id',
        redirect_uri:'test-redirect-uri',
        token_endpoint:'test-token_endpoint',
        proxy_token_endpoint:'test-proxy_token_endpoint',
        client_alias:'',
        ovp_qr_enabled: true,
        scopes_supported: ['scope1', 'scope2']
    };
};

// Mock the initial state of the store
reduxStore.dispatch({ type: 'STORE_COMMON_LANGUAGE', language: 'en' });

describe('Issuer Component', () => {

    let originalOpen: typeof window.open;

    beforeAll(() => {
        originalOpen = window.open;
        window.open = jest.fn();
    });

    afterAll(() => {
        window.open = originalOpen;
    });

    test('check the presence of the container', () => {
        const mockIssuer : IssuerObject = getMockIssuer();
        jest.spyOn(require('../../../utils/i18n'), 'getObjectForCurrentLanguage').mockReturnValue(mockIssuer.display[0]);
        render(
            <Provider store={reduxStore}>
                <Router>
                    <Issuer index={1} issuer={mockIssuer} />
                </Router>
            </Provider>
        );
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toBeInTheDocument();
    });

    test('check if content is rendered properly', () => {
        const mockIssuer = getMockIssuer();
        jest.spyOn(require('../../../utils/i18n'), 'getObjectForCurrentLanguage').mockReturnValue(mockIssuer.display[0]);
        render(
            <Provider store={reduxStore}>
                <Router>
                    <Issuer index={1} issuer={mockIssuer} />
                </Router>
            </Provider>
        );
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("Name");
    });

    test('check if onClick function is called', () => {
        const mockIssuer = getMockIssuer();
        jest.spyOn(require('../../../utils/i18n'), 'getObjectForCurrentLanguage').mockReturnValue(mockIssuer.display[0]);
        render(
            <Provider store={reduxStore}>
                <Router>
                    <Issuer index={1} issuer={mockIssuer} />
                </Router>
            </Provider>
        );
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        fireEvent.click(itemBoxElement);
        expect(window.location.pathname).toBe('/issuers/test-issuer');
    });
});
