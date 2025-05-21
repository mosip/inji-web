import React from 'react';
import { RedirectionPage } from '../../pages/RedirectionPage';
import { getActiveSession} from '../../utils/sessions';
import { downloadCredentialPDF, getErrorObject } from '../../utils/misc';
import { renderWithRouter,mockusei18n,mockUseFetch} from '../../test-utils/mockUtils';
import {useCookies} from "react-cookie";
// Mocking cookies properly, due to which existing tests were failing.
jest.mock("react-cookie", () => {
  return {
      ...jest.requireActual("react-cookie"),
      useCookies: jest.fn().mockReturnValue([{},jest.fn()])
  };
});

//todo : extract the local method to mockUtils, which is added to bypass the routing problems
// Mock the utility functions
jest.mock('../../utils/sessions', () => ({
  getActiveSession: jest.fn(),
  removeActiveSession: jest.fn(),
}));
jest.mock('../../utils/misc', () => ({
  downloadCredentialPDF: jest.fn(),
  getErrorObject: jest.fn(),
  getTokenRequestBody: jest.fn(),
}));
const mockUseFetchhook = jest.fn();
describe('Testing the Layout of RedirectionPage', () => {
  mockusei18n();
  mockUseFetch();
  test('Check if the layout is matching with the snapshots', () => {
    (useCookies as jest.Mock).mockReturnValue([
      {"XSRF-TOKEN": "test-xsrf-token"},
      jest.fn()
  ]);
    mockUseFetchhook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    (getActiveSession as jest.Mock).mockReturnValue({ selectedIssuer: { issuer_id: 'issuer1', display: [{ name: 'Test Issuer' }] } });
    const { asFragment } = renderWithRouter(<RedirectionPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of RedirectionPage', () => {
  beforeEach(() => {
    mockusei18n();
    mockUseFetch();
    jest.clearAllMocks();
    (getActiveSession as jest.Mock).mockReturnValue({ selectedIssuer: { issuer_id: 'issuer1', display: [{ name: 'Test Issuer' }] } });
  });

  test('Check if NavBar component is rendered', () => {
    (useCookies as jest.Mock).mockReturnValue([
      {"XSRF-TOKEN": "test-xsrf-token"},
      jest.fn()
  ]);
    mockUseFetchhook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    const{asFragment} =  renderWithRouter(<RedirectionPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Check if it displays error message if state is ERROR', async () => {
    (useCookies as jest.Mock).mockReturnValue([
      {"XSRF-TOKEN": "test-xsrf-token"},
      jest.fn()
  ]);
    mockUseFetchhook.mockReturnValue({ state: 'ERROR', fetchRequest: jest.fn(), error: true, response: {} });
    (getErrorObject as jest.Mock).mockReturnValue({ code: 'error.generic.title', message: 'error.generic.subTitle' });
    const{asFragment} =  renderWithRouter(<RedirectionPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Check if DownloadResult component shows loading state', () => {
    (useCookies as jest.Mock).mockReturnValue([
      {"XSRF-TOKEN": "test-xsrf-token"},
      jest.fn()
  ]);
    mockUseFetchhook.mockReturnValue({ state: 'LOADING', fetchRequest: jest.fn() });
    const{asFragment} = renderWithRouter(<RedirectionPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Check if DownloadResult component shows success state', async () => {
    (useCookies as jest.Mock).mockReturnValue([
      {"XSRF-TOKEN": "test-xsrf-token"},
      jest.fn()
  ]);
    mockUseFetchhook.mockReturnValue({ state: 'DONE', fetchRequest: jest.fn() });
    (downloadCredentialPDF as jest.Mock).mockResolvedValueOnce(true);
    const{asFragment} = renderWithRouter(<RedirectionPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
