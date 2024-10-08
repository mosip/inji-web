import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LandingPageWrapper, LandingPageWrapperProps } from '../../../components/Common/LandingPageWrapper';

// Mock the i18n configuration
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const renderWithRouter = (props: LandingPageWrapperProps) => {
    render(
        <Router>
            <LandingPageWrapper {...props} />
        </Router>
    );
};

describe("Test LandingPageWrapper Component", () => {
    const defaultProps: LandingPageWrapperProps = {
        icon: <div data-testid="Test-Icon">Icon</div>,
        title: "Test Title",
        subTitle: "Test SubTitle",
        gotoHome: true,
    };

    test('renders the LandingPageWrapper component', () => {
        renderWithRouter(defaultProps);
        expect(screen.getByTestId("DownloadResult-Outer-Container")).toBeInTheDocument();
    });

    test('renders the icon, title, and subtitle', () => {
        renderWithRouter(defaultProps);
        expect(screen.getByTestId("Test-Icon")).toBeInTheDocument();
        expect(screen.getByTestId("DownloadResult-Title")).toHaveTextContent("Test Title");
        expect(screen.getByTestId("DownloadResult-SubTitle")).toHaveTextContent("Test SubTitle");
    });

    test('renders the home button when gotoHome is true', () => {
        renderWithRouter(defaultProps);
        expect(screen.getByTestId("DownloadResult-Home-Button")).toBeInTheDocument();
    });

    test('does not render the home button when gotoHome is false', () => {
        renderWithRouter({ ...defaultProps, gotoHome: false });
        expect(screen.queryByTestId("DownloadResult-Home-Button")).not.toBeInTheDocument();
    });

    test('navigates to home when the home button is clicked', () => {
        renderWithRouter(defaultProps);
        const homeButton = screen.getByTestId("DownloadResult-Home-Button");
        fireEvent.click(homeButton);
        // You can add more assertions here to check if the navigation happened correctly
    });
});
