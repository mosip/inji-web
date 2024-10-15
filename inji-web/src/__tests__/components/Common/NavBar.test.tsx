import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '../../../components/Common/NavBar';
import { NavBarProps } from '../../../types/components';
import { mockUseSearchcredentials } from '../../../test-utils/mockUtils';
import { Provider } from 'react-redux';
import { reduxStore } from '../../../redux/reduxStore';

mockUseSearchcredentials();
const defaultProps: NavBarProps = {
    title: 'Test Title',
    link: '/test-link',
    search: true,
};
// todo : extract the local method to mockUtils, which is added to bypass the routing problems
const renderWithProvider = (ui: React.ReactElement, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
        <BrowserRouter>
            <Provider store = {reduxStore}>
            <Routes>
                <Route path="*" element={ui} />
                <Route path="/test-link" element={<div>Test Link Page</div>} />
            </Routes>
            </Provider>
        </BrowserRouter>
    );
};

describe("Testing the Layout of NavBar", () => {
    test('Check the presence of the navbar container', () => {
        const{asFragment} = renderWithProvider(<NavBar {...defaultProps}  />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality of NavBar", () => {
    test('Check navigates to the link when back arrow is clicked', () => {
        renderWithProvider(<NavBar {...defaultProps} />);
        fireEvent.click(screen.getByTestId('NavBar-Back-Arrow'));
        expect(screen.getByText('Test Link Page')).toBeInTheDocument();
    });
    

});
