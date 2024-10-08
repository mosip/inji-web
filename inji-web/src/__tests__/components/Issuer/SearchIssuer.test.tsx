import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { SearchIssuer } from '../../../components/Issuers/SearchIssuer';
import { reduxStore } from '../../../redux/reduxStore';
import { storeFilteredIssuers } from '../../../redux/reducers/issuersReducer';
import { RequestStatus } from '../../../hooks/useFetch';

// Mock the i18n configuration
jest.mock('../../../utils/i18n', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    getObjectForCurrentLanguage: jest.fn((displayArray: any, language: string) => displayArray),
}));

describe('SearchIssuer', () => {
    beforeEach(() => {
        reduxStore.dispatch = jest.fn();
    });

    const renderWithProvider = () => {
        render(
            <Provider store={reduxStore}>
                <SearchIssuer state={RequestStatus.DONE} fetchRequest={jest.fn()} />
            </Provider>
        );
    };

    test('renders SearchIssuer component', () => {
        renderWithProvider();

        expect(screen.getByTestId('Search-Issuer-Container')).toBeInTheDocument();
        expect(screen.getByTestId('Search-Issuer-Search-Icon')).toBeInTheDocument();
        expect(screen.getByTestId('Search-Issuer-Input')).toBeInTheDocument();
    });

    test('filters issuers based on search text', () => {
        renderWithProvider();

        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: 'Issuer 1' } });

        expect(reduxStore.dispatch).toHaveBeenCalledWith(storeFilteredIssuers([]));
    });

    test('clears search text when clear icon is clicked', () => {
        renderWithProvider();

        const input = screen.getByTestId('Search-Issuer-Input');
        fireEvent.change(input, { target: { value: 'Issuer 1' } });
        expect(input).toHaveValue('Issuer 1');

        const clearIcon = screen.getByTestId('Search-Issuer-Clear-Icon');
        fireEvent.click(clearIcon);
        expect(input).toHaveValue('');
        expect(reduxStore.dispatch).toHaveBeenCalledWith(storeFilteredIssuers([]));
    });
});
