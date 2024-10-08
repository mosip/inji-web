import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorSheildIcon } from '../../../components/Common/ErrorSheildIcon';

describe("Test ErrorSheildIcon Component", () => {
    test('renders the ErrorSheildIcon component', () => {
        render(<ErrorSheildIcon />);
        const iconElement = screen.getByTestId("DownloadResult-Error-ShieldIcon");
        expect(iconElement).toBeInTheDocument();
    });

    test('checks the icon size and color', () => {
        render(<ErrorSheildIcon />);
        const iconElement = screen.getByTestId("DownloadResult-Error-ShieldIcon");
        expect(iconElement).toHaveStyle('color: var(--iw-color-shieldErrorIcon)');
    });
});
