import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { HomePage } from '../../pages/HomePage';
import { reduxStore } from '../../redux/reduxStore';
import { storeIssuers } from '../../redux/reducers/issuersReducer';
import { renderWithRouter, mockusei18n,mockUseFetch,mockUseToast } from '../../test-utils/mockUtils';
import { mockIssuerObject } from '../../test-utils/mockObjects';

mockusei18n();
const mockUseFetchHook = jest.fn();
mockUseFetch();
mockUseToast();

//todo : extract the local method to mockUtils, which is added to bypass the routing problems
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Testing the Layout of HomePage', () => {
  test('Check if the layout is matching with the snapshots', () => {
    mockUseFetchHook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    const { asFragment } = renderWithRouter(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of HomePage', () => {
  beforeEach(() => {
    mockusei18n();
    reduxStore.dispatch(storeIssuers([mockIssuerObject]));
  });

  test('Check if IntroBox and SearchIssuer components are rendered', () => {
    mockUseFetchHook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    const { asFragment } = renderWithRouter(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Check if it displays error message if state is ERROR', async () => {
    mockUseFetchHook.mockReturnValue({ state: 'ERROR', fetchRequest: jest.fn() });
    renderWithRouter(<HomePage />);
    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('The service is currently unavailable now. Please try again later.');
    });
  });

  test('Check if search input filters issuers correctly', async () => {
    mockUseFetchHook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    renderWithRouter(<HomePage />);
    const searchInput = screen.getByTestId('Search-Issuer-Input');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    await waitFor(() => {
      expect(searchInput).toHaveValue('Test');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
