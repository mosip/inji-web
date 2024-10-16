import React from 'react';
import {  screen} from '@testing-library/react';
import { ErrorSheildIcon } from '../../../components/Common/ErrorSheildIcon';
import { renderWithProvider } from '../../../test-utils/mockUtils';

describe("Testing the Layout of ErrorSheildIcon", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const{asFragment} =  renderWithProvider(<ErrorSheildIcon />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality of ErrorSheildIcon", () => {
    test('Check for the icon size and color of ErrorShieldIcon Component', () => {
        renderWithProvider(<ErrorSheildIcon />);
        const iconElement = screen.getByTestId("DownloadResult-Error-ShieldIcon");
        expect(iconElement).toHaveStyle('color: var(--iw-color-shieldErrorIcon)');
    });
});
