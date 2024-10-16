import React from 'react';
import {  screen, fireEvent } from '@testing-library/react';
import { LandingPageWrapper } from '../../../components/Common/LandingPageWrapper';
import {  mockUseTranslation, renderWithProvider,mockUseNavigate} from '../../../test-utils/mockUtils';
import { mockLandingPageWrapperProps } from '../../../test-utils/mockObjects';


// Mock useTranslation
mockUseTranslation();

//todo : extract the local method to mockUtils, which is added to bypass the routing problems
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe("Testing the Layout of LandingPageWrapper", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const { asFragment } = renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality LandingPageWrapper", () => {
    beforeEach(()=>{
        mockUseNavigate();
    })
    test('Check it navigates to home when the home button is clicked', () => {
        renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);
        const homeButton = screen.getByTestId("DownloadResult-Home-Button");
        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/'); 
    });

    test('Check if it have the Title and the SubTitle', () => {
        renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);
        expect(screen.getByTestId("DownloadResult-Title")).toHaveTextContent("Test Title");
        expect(screen.getByTestId("DownloadResult-SubTitle")).toHaveTextContent("Test SubTitle");
    });
    afterEach(()=>{
        jest.clearAllMocks();
    })
});
