import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppToaster } from '../../../components/Common/AppToaster';
import { Provider } from 'react-redux';
import { reduxStore } from '../../../redux/reduxStore'; // Assuming the store is named reduxStore

describe('AppToaster', () => {
    const renderWithProvider = () => {
        render(
            <Provider store={reduxStore}>
                <AppToaster />
            </Provider>
        );
    };

    test('renders correctly with English language', () => {
        // Ensure the language is set to English
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });

        renderWithProvider();

        // Find the custom toast using getByTestId
        const customToast = screen.getByTestId('custom-toast');

        // Assert that the custom toast is rendered
        expect(customToast).toBeInTheDocument();
        expect(customToast).toHaveTextContent('Test message');

        // Check the position of the toast container
        const toastContainer = screen.getByTestId('toast-container');
        expect(toastContainer).toHaveClass('top-right');
    });

    test('renders correctly with Arabic language', () => {
        // Ensure the language is set to Arabic
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });

        renderWithProvider();

        // Find the custom toast using getByTestId
        const customToast = screen.getByTestId('custom-toast');

        // Assert that the custom toast is rendered
        expect(customToast).toBeInTheDocument();
        expect(customToast).toHaveTextContent('Test message');

        // Check the position of the toast container
        const toastContainer = screen.getByTestId('toast-container');
        expect(toastContainer).toHaveClass('top-right');
    });
});
