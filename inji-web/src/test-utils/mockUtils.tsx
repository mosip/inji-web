import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { reduxStore } from '../redux/reduxStore';

export const mockUseTranslation = () => {
    jest.mock('react-i18next', () => ({
        useTranslation: () => ({
            t: (key: string) => key,
        }),
    }));
};

export const mockUseNavigate = () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: mockNavigate,
    }));
};

export const mockUseSearchCredentials = () => {
    jest.mock('../components/Credentials/SearchCredential', () => ({
        SearchCredential: () => <></>,
    }));
};

export const mockUseSelector = () => {
    jest.mock('react-redux', () => ({
        ...jest.requireActual('react-redux'),
        useSelector: jest.fn(),
    }));
};

export const setMockUseSelectorState = (state: any) => {
    const useSelectorMock = require('react-redux').useSelector;
    useSelectorMock.mockImplementation((selector: any) => selector(state));
};

export const mockUseGetObjectForCurrentLanguage = () => {
    jest.mock('../utils/i18n', () => ({
        getObjectForCurrentLanguage: jest.fn(),
    }));
};

export const wrapUnderRouter = (children: React.ReactNode) => {
    return <Router>{children}</Router>;
};

export const mockUseToast = () => {
    jest.mock('react-toastify', () => ({
        toast: jest.fn(),
        ToastContainer: jest.requireActual('react-toastify').ToastContainer,
    }));
};

export const mockUseDispatch = () => {
    jest.mock('react-redux', () => ({
        ...jest.requireActual('react-redux'),
        useDispatch: jest.fn(),
    }));
};

export const mockUseSpinningLoader = () => {
    jest.mock('../components/Common/SpinningLoader', () => ({
        SpinningLoader: () => <></>,
    }));
};

export const mockUseLanguageSelector = () => {
    jest.mock('../components/Common/LanguageSelector', () => ({
        LanguageSelector: () => <></>,
    }));
};

interface RenderWithProviderOptions extends Omit<RenderOptions, 'queries'> {}

export const renderWithProvider = (element: ReactElement, options?: RenderWithProviderOptions) => {
    return render(
        <Provider store={reduxStore}>
            <Router>
                {element}
            </Router>
        </Provider>,
        options
    );
};

