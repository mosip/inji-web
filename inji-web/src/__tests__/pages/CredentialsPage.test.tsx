import React from 'react';
import {waitFor} from '@testing-library/react';
import {CredentialsPage} from '../../pages/CredentialsPage';
import {mockUseParams, mockUseTranslation, renderWithRouter} from '../../test-utils/mockUtils';
import {mockApiResponse, mockUseApi} from "../../test-utils/setupUseApiMock";
import {RequestStatus} from "../../utils/constants";

mockUseTranslation();
mockUseParams();
//todo : extract the local method to mockUtils, which is added to bypass the routing problems
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("../../hooks/useApi.ts", () => {
  return {
    useApi: () => mockUseApi
  };
});

describe('Testing the Layout of CredentialsPage', () => {
  test('Check if the layout is matching with the snapshots', async () => {
    mockApiResponse({
      state: RequestStatus.ERROR,
      error: 'Service Unavailable',
    })
    const { asFragment } = renderWithRouter(<CredentialsPage />);

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of CredentialsPage', () => {
  test('Check if it displays error message if state is ERROR', async () => {
    mockApiResponse({
        state: RequestStatus.ERROR,
        error: 'Service Unavailable',
    })
    renderWithRouter(<CredentialsPage />);

    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('The service is currently unavailable now. Please try again later.');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
