import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { HomePage } from '../../pages/HomePage';
import { reduxStore } from '../../redux/reduxStore';
import { storeIssuers } from '../../redux/reducers/issuersReducer';
import { renderWithRouter, mockusei18n,mockUseFetch,mockUseToast } from '../../test-utils/mockUtils';

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
  test('check if the layout is matching with the snapshots', () => {
    mockUseFetchHook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    const { asFragment } = renderWithRouter(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of HomePage', () => {
  beforeEach(() => {
    mockusei18n();
    reduxStore.dispatch(storeIssuers([
      {
        name: 'Test Issuer',
        desc: 'Description',
        protocol: 'OpenId4VCI',
        credential_issuer: 'issuer1',
        authorization_endpoint: 'https://auth.endpoint',
        credentials_endpoint: 'https://credentials.endpoint',
        display: [{ name: 'Test Issuer', language: 'en', locale: 'en-US', logo: { url: '', alt_text: '' }, title: 'Title', description: 'Description' }],
        client_id: 'client1',
        redirect_uri: 'https://redirect.uri',
        token_endpoint: 'https://token.endpoint',
        proxy_token_endpoint: 'https://proxy.token.endpoint',
        client_alias: 'alias1',
        ovp_qr_enabled: true,
        scopes_supported: ['scope1', 'scope2']
      }
    ]));
  });

  test('Check if IntroBox and SearchIssuer components are rendered', () => {
    mockUseFetchHook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    const { asFragment } = renderWithRouter(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('check if it displays error message if state is ERROR', async () => {
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
