import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '../../../components/Common/NavBar';
import { NavBarProps } from '../../../types/components';

// Mock the SearchCredential component
jest.mock('../../../components/Credentials/SearchCredential', () => ({
    SearchCredential: () => <div data-testid="SearchCredential">Search</div>,
}));

const defaultProps: NavBarProps = {
    title: 'Test Title',
    link: '/test-link',
    search: true,
};

const renderWithProvider = (ui: React.ReactElement, { route = '/' } = {}) => {
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

describe("NavBar Component Layout Tests", () => {
    test('check the presence of the navbar container', () => {
        const{asFragment} = renderWithProvider(<NavBar {...defaultProps} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("NavBar Component Functionality Tests", () => {
    test('check navigates to the link when back arrow is clicked', () => {
        renderWithProvider(<NavBar {...defaultProps} />);
        fireEvent.click(screen.getByTestId('NavBar-Back-Arrow'));
        expect(screen.getByText('Test Link Page')).toBeInTheDocument();
    });
});
