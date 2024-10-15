import React from 'react';
import {  screen } from '@testing-library/react';
import { AppToaster } from '../../../components/Common/AppToaster';
import { reduxStore } from '../../../redux/reduxStore'; // Assuming the store is named reduxStore
import { renderWithProvider } from '../../../test-utils/mockUtils';

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
    test('Check if functionalities works properly with English language', () => {
        renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
        const customToast = screen.getByTestId('AppToaster-custom-toast');
        expect(customToast).toHaveTextContent('AppToaster test message');
    });

    test('Check if functionalities works properly with Arabic language', () => {
        renderWithProvider(<AppToaster />);
        reduxStore.dispatch({ type: 'SET_LANGUAGE', payload: 'ar' });
        const customToast = screen.getByTestId('AppToaster-custom-toast');
        expect(customToast).toHaveTextContent('AppToaster test message');
    });
});
