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

describe('Testing the Regex Validation and Helper Text of SearchIssuer', () => {
    beforeEach(() => {
        reduxStore.dispatch = jest.fn();
    });

    test('Shows default helper text when input is empty', () => {
        renderWithProvider(<SearchIssuer />);

        expect(screen.getByText("Search by issuer name using letters, numbers, hyphens (-), underscores (_) or brackets ( ) only.")).toBeInTheDocument;
    });

    test('Shows default helper text when input is valid', () => {
        renderWithProvider(<SearchIssuer />);
        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: 'AaZz09 _-()' } });

        expect(screen.queryByText("Search by issuer name using letters, numbers, hyphens (-), underscores (_) or brackets ( ) only.")).toBeInTheDocument();
        expect(screen.queryByText("Please enter a valid issuer name. Only letters, numbers, spaces, hyphens (-), underscores (_), and brackets ( ) are allowed. Special characters are not permitted.")).not.toBeInTheDocument();
    });

    test('Shows error helper text when input is invalid', () => {
        renderWithProvider(<SearchIssuer />);
        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: 'Issuer@#' } });

        expect(screen.queryByText("Please enter a valid issuer name. Only letters, numbers, spaces, hyphens (-), underscores (_), and brackets ( ) are allowed. Special characters are not permitted.")).toBeInTheDocument();
    });

    test('Shows error when input is only spaces', () => {
        renderWithProvider(<SearchIssuer />);
        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: '     ' } });

        expect(screen.queryByText(
            "Please enter a valid issuer name. Only letters, numbers, spaces, hyphens (-), underscores (_), and brackets ( ) are allowed. Special characters are not permitted."
        )).toBeInTheDocument();
    });

    test('Shows error when input has two underscores', () => {
        renderWithProvider(<SearchIssuer />);
        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: 'Issuer__Name' } });

        expect(screen.queryByText(
            "Please enter a valid issuer name. Only letters, numbers, spaces, hyphens (-), underscores (_), and brackets ( ) are allowed. Special characters are not permitted."
        )).toBeInTheDocument();
    });

    test('Shows error when input starts with underscore (_Issuer)', () => {
        renderWithProvider(<SearchIssuer />);
        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: '_Issuer' } });

        expect(screen.queryByText(
            "Please enter a valid issuer name. Only letters, numbers, spaces, hyphens (-), underscores (_), and brackets ( ) are allowed. Special characters are not permitted."
        )).toBeInTheDocument();
    });
});