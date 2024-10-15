import React from 'react';
import { AppToaster } from '../../../components/Common/AppToaster';
import { reduxStore } from '../../../redux/reduxStore'; // Assuming the store is named reduxStore
import { renderWithProvider } from '../../../test-utils/mockUtils';
import { toast } from 'react-toastify';

// todo : extract the local method to mockUtils,where added because of mock is not being properly mocked which leads to match error
jest.mock('react-toastify', () => ({
    toast: jest.fn(),
    ToastContainer: jest.requireActual('react-toastify').ToastContainer,
}));

describe('Testing the Layout of AppToaster', () => {
    test('Check if the layout is matching with the snapshots for English language', () => {
        const { asFragment } = renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if the layout is matching with the snapshots for Arabic language', () => {
        const { asFragment } = renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('Testing the Functionality of AppToaster', () => {
    test('Check if toast is called with the correct message for English language', () => {
        renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
        expect(toast).toHaveBeenCalledWith("AppToaster test message");
    });

    test('Check if toast is called with the correct message for Arabic language', () => {
        renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });
        expect(toast).toHaveBeenCalledWith("AppToaster test message");
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })
});
