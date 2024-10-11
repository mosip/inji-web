import React from 'react';
import {  screen} from '@testing-library/react';
import { ErrorSheildIcon } from '../../../components/Common/ErrorSheildIcon';
import { renderWithProvider } from '../../../test-utils/mockUtils';

describe("ErrorSheildIcon Layout Tests", () => {
    test('check if icon renders properly', () => {
        const{asFragment} =  renderWithProvider(<ErrorSheildIcon />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("ErrorSheildIcon Functionality Tests", () => {
    test('checks for the icon size and color of ErrorShieldIcon Component', () => {
        renderWithProvider(<ErrorSheildIcon />);
        const iconElement = screen.getByTestId("DownloadResult-Error-ShieldIcon");
        expect(iconElement).toHaveStyle('color: var(--iw-color-shieldErrorIcon)');
    });
});
