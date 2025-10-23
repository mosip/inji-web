import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessMessageIcon from '../../../../assets/SuccessMessageIcon.svg';
import { SuccessIcon } from '../../../../components/Common/Icons/SuccessIcon';

describe('SuccessIcon', () => {
    it('renders the success icon with default props', () => {
        render(<SuccessIcon />);

        const img = screen.getByRole('img', { name: /success/i });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', SuccessMessageIcon);
        expect(img).toHaveClass('w-24 h-24 sm:w-[108px] sm:h-[108px]');
        expect(img).toHaveAttribute('alt', 'Success');
    });

    it('applies custom className and altText', () => {
        render(<SuccessIcon className="custom-class" altText="Custom Success" />);

        const img = screen.getByRole('img', { name: /custom success/i });
        expect(img).toHaveClass('custom-class');
        expect(img).toHaveAttribute('alt', 'Custom Success');
    });
});
