import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { SearchCredential } from '../../../components/Credentials/SearchCredential';
import { storeFilteredCredentials } from '../../../redux/reducers/credentialsReducer';
import { mockSearchCredential } from '../../../test-utils/mockObjects';
import { renderWithProvider,mockUseTranslation } from '../../../test-utils/mockUtils';


mockUseTranslation();
// Mock the useSelector and useDispatch hooks
// todo : extract the local method to mockUtils
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));


describe("Testing the Layout of SearchCredential", () => {
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

    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = renderWithProvider(<SearchCredential />)
        expect(asFragment()).toMatchSnapshot();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe("Testing the Functionality of SearchCredential", () => {
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

    test('Check whether it filters credentials based on search input', () => {
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

    test('Check whether it clears search input when clear icon is clicked', () => {
        renderWithProvider(<SearchCredential />);
        const searchInput = screen.getByTestId('NavBar-Search-Input');
        fireEvent.change(searchInput, { target: { value: 'Insurance' } });
        expect(searchInput).toHaveValue('Insurance');

        const clearIcon = screen.getByTestId('NavBar-Search-Clear-Icon');
        fireEvent.click(clearIcon);
        expect(searchInput).toHaveValue('');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
