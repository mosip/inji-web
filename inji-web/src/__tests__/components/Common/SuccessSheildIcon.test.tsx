import React from 'react';
import { render, screen } from '@testing-library/react';
import { SuccessSheildIcon } from '../../../components/Common/SuccessSheildIcon';

describe("Test SuccessSheildIcon Component", () => {
    test('renders the SuccessSheildIcon component', () => {
        render(<SuccessSheildIcon />);
        const iconElement = screen.getByTestId("DownloadResult-Success-ShieldIcon");
        expect(iconElement).toBeInTheDocument();
    });

    test('checks the icon color', () => {
        render(<SuccessSheildIcon />);
        const iconElement = screen.getByTestId("DownloadResult-Success-ShieldIcon");
        expect(iconElement).toHaveAttribute('color', 'var(--iw-color-shieldSuccessIcon)');
    });
});
