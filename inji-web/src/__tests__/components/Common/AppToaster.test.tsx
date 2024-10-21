import React from 'react';
import { AppToaster } from '../../../components/Common/AppToaster';
import { reduxStore } from '../../../redux/reduxStore'; // Assuming the store is named reduxStore
import { renderWithProvider } from '../../../test-utils/mockUtils';
import { toast } from 'react-toastify';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
    initReactI18next: {
      type: '3rdParty',
      init: jest.fn(),
    },
  }));

// Mock the toast function
jest.mock('react-toastify', () => ({
  toast: jest.fn(),
  ToastContainer: jest.requireActual('react-toastify').ToastContainer,
}));
 
describe('Testing the Layout of AppToaster', () => {
  test('Check if the layout is matching with the snapshots for English language', () => {
    reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
    const { asFragment } = renderWithProvider(<AppToaster />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Check if the layout is matching with the snapshots for Arabic language', () => {
    reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });
    const { asFragment } = renderWithProvider(<AppToaster />);
    expect(asFragment()).toMatchSnapshot();
  });
});
 
describe('Testing the Functionality of AppToaster', () => {
  test('Check if toast is called with the correct message for English language', () => {
    reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
    renderWithProvider(<AppToaster />);
    toast("AppToaster test message");
    expect(toast).toHaveBeenCalledWith("AppToaster test message");
  });

  test('Check if toast is called with the correct message for Arabic language', () => {
    reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });
    renderWithProvider(<AppToaster />);
    toast("AppToaster test message");
    expect(toast).toHaveBeenCalledWith("AppToaster test message");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

