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
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: jest.fn(),
    }));
};

export const wrapUnderRouter = (children: React.ReactNode) => {
    return <Router>{children}</Router>;
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
