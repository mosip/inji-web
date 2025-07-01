import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {SearchIssuer} from '../../../components/Issuers/SearchIssuer';
import {reduxStore} from '../../../redux/reduxStore';
import {storeFilteredIssuers} from '../../../redux/reducers/issuersReducer';
import {mockUseTranslation, renderWithProvider} from '../../../test-utils/mockUtils';

mockUseTranslation();

describe("Testing the layout of SearchIssuer", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = renderWithProvider(
            <SearchIssuer/>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('Testing the Functionality of SearchIssuer', () => {
    beforeEach(() => {
        reduxStore.dispatch = jest.fn();
    });

    test('Check if it filters issuers based on search text', () => {
        renderWithProvider(
            <SearchIssuer/>
        );

        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, {target: {value: 'Issuer 1'}});

        expect(reduxStore.dispatch).toHaveBeenCalledWith(storeFilteredIssuers([]));
    });

    test('Check if it clears search text when clear icon is clicked', () => {
        renderWithProvider(
            <SearchIssuer/>
        );

        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, {target: {value: 'Issuer 1'}});
        expect(input).toHaveValue('Issuer 1');

        const clearIcon = screen.getByTestId('Search-Issuer-Clear-Icon');
        fireEvent.click(clearIcon);
        expect(input).toHaveValue('');
        expect(reduxStore.dispatch).toHaveBeenCalledWith(storeFilteredIssuers([]));
    });
    afterEach(() => {
        jest.clearAllMocks();
    })
});
