import React from 'react';
import {  screen, fireEvent } from '@testing-library/react';
import { SearchIssuer } from '../../../components/Issuers/SearchIssuer';
import { reduxStore } from '../../../redux/reduxStore';
import { storeFilteredIssuers } from '../../../redux/reducers/issuersReducer';
import { RequestStatus } from '../../../hooks/useFetch';
import { renderWithProvider } from '../../../test-utils/mockUtils';

jest.mock('../../../utils/i18n', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    getObjectForCurrentLanguage: jest.fn((displayArray: any, language: string) => displayArray),
}));

describe("Test layout SearchIssuer", () => {
    test('renders SearchIssuer component', () => {
        const { asFragment } = renderWithProvider(
            <SearchIssuer state={RequestStatus.DONE} fetchRequest={jest.fn()} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('Test SearchIssuer Functionality', () => {
    beforeEach(() => {
        reduxStore.dispatch = jest.fn();
    });

    test('filters issuers based on search text', () => {
        renderWithProvider(
            <SearchIssuer state={RequestStatus.DONE} fetchRequest={jest.fn()} />
        );

        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: 'Issuer 1' } });

        expect(reduxStore.dispatch).toHaveBeenCalledWith(storeFilteredIssuers([]));
    });

    test('clears search text when clear icon is clicked', () => {
        renderWithProvider(
            <SearchIssuer state={RequestStatus.DONE} fetchRequest={jest.fn()} />
        );

        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: 'Issuer 1' } });
        expect(input).toHaveValue('Issuer 1');

        const clearIcon = screen.getByTestId('Search-Issuer-Clear-Icon');
        fireEvent.click(clearIcon);
        expect(input).toHaveValue('');
        expect(reduxStore.dispatch).toHaveBeenCalledWith(storeFilteredIssuers([]));
    });
});
