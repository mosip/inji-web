import React from 'react';
import {  screen, fireEvent } from '@testing-library/react';
import { LandingPageWrapper, LandingPageWrapperProps } from '../../../components/Common/LandingPageWrapper';
import {  mockUseTranslation, renderWithProvider } from '../../../test-utils/mockUtils';

// Mock useTranslation
mockUseTranslation();
// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const defaultProps: LandingPageWrapperProps = {
    icon: <div data-testid="Test-Icon">Icon</div>,
    title: "Test Title",
    subTitle: "Test SubTitle",
    gotoHome: true,
};

describe("LandingPageWrapper Component Layout Tests", () => {
    test('check the presence of LandingPageWrapper component', () => {
        const { asFragment } = renderWithProvider(<LandingPageWrapper {...defaultProps} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("LandingPageWrapper Component Functionality Tests", () => {
    test('check it navigates to home when the home button is clicked', () => {
        renderWithProvider(<LandingPageWrapper {...defaultProps} />);
        const homeButton = screen.getByTestId("DownloadResult-Home-Button");
        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/'); // Assuming '/' is the home route
    });

    test('check', () => {
        renderWithProvider(<LandingPageWrapper {...defaultProps} />);
        expect(screen.getByTestId("DownloadResult-Title")).toHaveTextContent("Test Title");
        expect(screen.getByTestId("DownloadResult-SubTitle")).toHaveTextContent("Test SubTitle");
    });
});
