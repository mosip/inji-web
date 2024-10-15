import React from 'react';
import {  screen, fireEvent } from '@testing-library/react';
import { LandingPageWrapper, LandingPageWrapperProps } from '../../../components/Common/LandingPageWrapper';
import {  mockUseTranslation, renderWithProvider,mockUseNavigate} from '../../../test-utils/mockUtils';


// Mock useTranslation
mockUseTranslation();

//todo : extract the local method to mockUtils, which is added to bypass the routing problems
// mockUseNavigate();
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

describe("Testing the Layout of LandingPageWrapper", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const { asFragment } = renderWithProvider(<LandingPageWrapper {...defaultProps} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality LandingPageWrapper", () => {
    beforeEach(()=>{
        mockUseNavigate();
    })
    test('Check it navigates to home when the home button is clicked', () => {
        renderWithProvider(<LandingPageWrapper {...defaultProps} />);
        const homeButton = screen.getByTestId("DownloadResult-Home-Button");
        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/'); 
    });

    test('Check if it have the Title and the SubTitle', () => {
        renderWithProvider(<LandingPageWrapper {...defaultProps} />);
        expect(screen.getByTestId("DownloadResult-Title")).toHaveTextContent("Test Title");
        expect(screen.getByTestId("DownloadResult-SubTitle")).toHaveTextContent("Test SubTitle");
    });
});
