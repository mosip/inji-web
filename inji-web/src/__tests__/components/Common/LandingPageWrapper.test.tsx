import React from 'react';
import {mockNavigateFn} from '../../../test-utils/mockRouter';
import {  screen, fireEvent } from '@testing-library/react';
import { LandingPageWrapper } from '../../../components/Common/LandingPageWrapper';
import { mockUseTranslation, renderWithProvider} from '../../../test-utils/mockUtils';
import { mockLandingPageWrapperProps } from '../../../test-utils/mockObjects';

// Mock useTranslation
mockUseTranslation();

describe("Testing the Layout of LandingPageWrapper", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const { asFragment } = renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality LandingPageWrapper", () => {
    beforeEach(()=>{
        jest.clearAllMocks();
        mockNavigateFn.mockReset();
    })
    test('Check it navigates to home when the home button is clicked', () => {
        renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);
        const homeButton = screen.getByTestId("DownloadResult-Home-Button");
        fireEvent.click(homeButton);
        expect(mockNavigateFn).toHaveBeenCalledWith('/'); 
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
