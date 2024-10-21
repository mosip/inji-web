import React from 'react';
import { waitFor } from '@testing-library/react';
import { CredentialsPage } from '../../pages/CredentialsPage';
import { mockUseTranslation, mockUseFetch, renderWithRouter, mockUseParams } from '../../test-utils/mockUtils';

mockUseTranslation();
mockUseFetch();
mockUseParams();
//todo : extract the local method to mockUtils, which is added to bypass the routing problems
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Testing the Layout of CredentialsPage', () => {
  test('Check if the layout is matching with the snapshots', async () => {
    const { asFragment } = renderWithRouter(<CredentialsPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of CredentialsPage', () => {
  test('Check if it displays error message if state is ERROR', async () => {
    renderWithRouter(<CredentialsPage />);
    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('The service is currently unavailable now. Please try again later.');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
