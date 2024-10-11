import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { SearchCredential } from '../../../components/Credentials/SearchCredential';
import { storeFilteredCredentials } from '../../../redux/reducers/credentialsReducer';
import { mockSearchCredential } from '../../../test-utils/mockObjects';
import { renderWithProvider } from '../../../test-utils/mockUtils';

// Mock the useSelector and useDispatch hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

// Mock the i18n configuration
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    initReactI18next: {
        type: '3rdParty',
        init: jest.fn(),
    },
}));
describe("Test SearchCredential Layout", () => {
    beforeEach(() => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            credentials: {
                credentials: mockSearchCredential,
            },
            common: {
                language: 'en',
            },
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('checks whether it renders search input and icons', () => {
        const {asFragment} = renderWithProvider(<SearchCredential />)
        expect(asFragment()).toMatchSnapshot();
        // expect(screen.getByTestId('NavBar-Search-Container')).toBeInTheDocument();
        // expect(screen.getByTestId('NavBar-Search-Icon')).toBeInTheDocument();
        // expect(screen.getByTestId('NavBar-Search-Input')).toBeInTheDocument();
    });
});

describe("Test SearchCredential Functionality", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            credentials: {
                credentials: mockSearchCredential,
            },
            common: {
                language: 'en',
            },
        }));

        const useDispatchMock = require('react-redux').useDispatch;
        useDispatchMock.mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('checks whether it filters credentials based on search input', () => {
        renderWithProvider(<SearchCredential />);
        const searchInput = screen.getByTestId('NavBar-Search-Input');
        fireEvent.change(searchInput, { target: { value: 'Insurance' } });

        const expectedAction = storeFilteredCredentials({
            ...mockSearchCredential,
            credential_configurations_supported: {
                InsuranceCredential: mockSearchCredential.credential_configurations_supported.InsuranceCredential
            }
        });

        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });

    test('checks whether it clears search input when clear icon is clicked', () => {
        renderWithProvider(<SearchCredential />);
        const searchInput = screen.getByTestId('NavBar-Search-Input');
        fireEvent.change(searchInput, { target: { value: 'Insurance' } });
        expect(searchInput).toHaveValue('Insurance');

        const clearIcon = screen.getByTestId('NavBar-Search-Clear-Icon');
        fireEvent.click(clearIcon);
        expect(searchInput).toHaveValue('');
    });
});
