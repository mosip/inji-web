import React from 'react';
import {  screen } from '@testing-library/react';
import { AppToaster } from '../../../components/Common/AppToaster';
import { reduxStore } from '../../../redux/reduxStore'; // Assuming the store is named reduxStore
import { renderWithProvider } from '../../../test-utils/mockUtils';

describe('AppToaster Layout Tests', () => {
    test('renders correctly with English language', () => {
        const { asFragment } = renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
        expect(asFragment()).toMatchSnapshot();
    });

    test('renders correctly with Arabic language', () => {
        const { asFragment } = renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('AppToaster Behavioral and Functionality Tests', () => {
    test('checks if renders correctly with English language', () => {
        renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
        const customToast = screen.getByTestId('AppToaster-custom-toast');
        expect(customToast).toHaveTextContent('AppToaster test message');
    });

    test('check if renders correctly with Arabic language', () => {
        renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });
        const customToast = screen.getByTestId('AppToaster-custom-toast');
        expect(customToast).toHaveTextContent('AppToaster test message');
    });
});
