import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { SearchCredential } from '../../../components/Credentials/SearchCredential';
import { reduxStore } from '../../../redux/reduxStore';
import { storeFilteredCredentials } from '../../../redux/reducers/credentialsReducer';

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

const mockCredentials = {
    credential_configurations_supported: {
        InsuranceCredential: {
            display: [{
                name: "Insurance Credential",
                language: "en",
                locale: "en",
                logo: {
                    url: "https://url.com",
                    alt_text: "alt text of the url"
                },
                title: "Title",
                description: "Description",
            }],
        },
        AnotherCredential: {
            display: [{
                name: "Another Credential",
                language: "en",
                locale: "en",
                logo: {
                    url: "https://url.com",
                    alt_text: "alt text of the url"
                },
                title: "Title",
                description: "Description",
            }],
        }
    }
};

describe("Test SearchCredential Component", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            credentials: {
                credentials: mockCredentials,
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

    const renderWithProvider = () => {
        render(
            <Provider store={reduxStore}>
                <SearchCredential />
            </Provider>
        );
    };

    test('renders search input and icons', () => {
        renderWithProvider();
        expect(screen.getByTestId('NavBar-Search-Container')).toBeInTheDocument();
        expect(screen.getByTestId('NavBar-Search-Icon')).toBeInTheDocument();
        expect(screen.getByTestId('NavBar-Search-Input')).toBeInTheDocument();
    });

    test('filters credentials based on search input', () => {
        renderWithProvider();
        const searchInput = screen.getByTestId('NavBar-Search-Input');
        fireEvent.change(searchInput, { target: { value: 'Insurance' } });

        const expectedAction = storeFilteredCredentials({
            ...mockCredentials,
            credential_configurations_supported: {
                InsuranceCredential: mockCredentials.credential_configurations_supported.InsuranceCredential
            }
        });

        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });

    test('clears search input when clear icon is clicked', () => {
        renderWithProvider();
        const searchInput = screen.getByTestId('NavBar-Search-Input');
        fireEvent.change(searchInput, { target: { value: 'Insurance' } });
        expect(searchInput).toHaveValue('Insurance');

        const clearIcon = screen.getByTestId('NavBar-Search-Clear-Icon');
        fireEvent.click(clearIcon);
        expect(searchInput).toHaveValue('');
    });
});
