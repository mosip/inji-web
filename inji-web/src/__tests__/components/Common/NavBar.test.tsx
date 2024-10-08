import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '../../../components/Common/NavBar';
import { NavBarProps } from '../../../types/components';

// Mock the SearchCredential component
jest.mock('../../../components/Credentials/SearchCredential', () => ({
    SearchCredential: () => <div data-testid="SearchCredential">Search</div>,
}));

describe("Test Navbar Container Presence", () => {
    const defaultProps: NavBarProps = {
        title: 'Test Title',
        link: '/test-link',
        search: true,
    };

    const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);

        return render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={ui} />
                    <Route path="/test-link" element={<div>Test Link Page</div>} />
                </Routes>
            </BrowserRouter>
        );
    };

    test('check the presence of the navbar container', () => {
        renderWithRouter(<NavBar {...defaultProps} />);
        const navbarElement = screen.getByTestId("NavBar-Outer-Container");
        expect(navbarElement).toBeInTheDocument();
    });

    test('check the presence of the inner navbar container', () => {
        renderWithRouter(<NavBar {...defaultProps} />);
        const navbarElement = screen.getByTestId("NavBar-Inner-Container");
        expect(navbarElement).toBeInTheDocument();
    });

    test('check the presence of the navbar back arrow', () => {
        renderWithRouter(<NavBar {...defaultProps} />);
        const navbarElement = screen.getByTestId("NavBar-Back-Arrow");
        expect(navbarElement).toBeInTheDocument();
    });

    test('check the presence of the navbar text', () => {
        renderWithRouter(<NavBar {...defaultProps} />);
        const navbarElement = screen.getByTestId("NavBar-Text");
        expect(navbarElement).toBeInTheDocument();
    });

    test('navigates to the link when back arrow is clicked', () => {
        renderWithRouter(<NavBar {...defaultProps} />);
        fireEvent.click(screen.getByTestId('NavBar-Back-Arrow'));
        expect(screen.getByText('Test Link Page')).toBeInTheDocument();
    });

    test('renders the SearchCredential component when search is true', () => {
        renderWithRouter(<NavBar {...defaultProps} />);
        expect(screen.getByTestId('SearchCredential')).toBeInTheDocument();
    });

    test('does not render the SearchCredential component when search is false', () => {
        renderWithRouter(<NavBar {...defaultProps} search={false} />);
        expect(screen.queryByTestId('SearchCredential')).not.toBeInTheDocument();
    });
});
