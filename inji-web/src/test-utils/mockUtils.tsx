import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { reduxStore } from '../redux/reduxStore';
import { useDispatch } from 'react-redux';

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

export const mockUseSearchcredentials = () =>{
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

export const mockUsegetObjectForCurrentLanguage = () =>{
    jest.mock('../utils/i18n', () => ({
        getObjectForCurrentLanguage: jest.fn(),
    }));
};

export const wrapUnderRouter = (children: React.ReactNode) => {
    return <Router>{children}</Router>;
};

export const mockUseDispatch = () =>{
    jest.mock('react-redux', () => ({
        ...jest.requireActual('react-redux'),
        useDispatch:jest.fn(),
    }));
};

export const mockUseSpinningLoader = () =>{
    jest.mock('../components/Common/SpinningLoader', () => ({
        SpinningLoader: () => <></>,
    }));
};
export const mockUseLanguageSelector = () =>{
    jest.mock('../components/Common/LanguageSelector', () => ({
        LanguageSelector: () => <></>,
    }));
};

interface RenderWithProviderOptions extends Omit<RenderOptions, 'queries'> {}

const renderWithProvider = (ui: ReactElement, options?: RenderWithProviderOptions) => {
    return render(
        <Provider store={reduxStore}>
            <Router>
                {ui}
            </Router>
        </Provider>,
        options
    );
};

export * from '@testing-library/react';
export { renderWithProvider };
