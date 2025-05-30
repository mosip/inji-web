import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {WalletCredential} from '../../../types/data';
import {VCCardView} from '../../../components/VC/VCCardView';

describe('VCCardView Component', () => {
    const mockCredential: WalletCredential = {
        credentialId: 'test-id-123',
        credentialTypeDisplayName: 'Health ID',
        issuerDisplayName: 'Test Issuer',
        credentialTypeLogo: 'test-logo.png',
        issuerLogo: "test-issuer-logo.png",
    };

    const mockOnClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    //TODO: Snapshot tests will be unskipped at last once UI is fully ready
    it.skip('should match snapshot', () => {
        const {container} = render(
            <VCCardView
                credential={mockCredential}
                onClick={mockOnClick}
            />
        );

        expect(container).toMatchSnapshot();
    });

    it('should render with correct credential information', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onClick={mockOnClick}
            />
        );

        const logo = screen.getByTestId('issuer-logo');
        const name = screen.getByTestId('credential-type-display-name');

        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'test-logo.png');
        expect(logo).toHaveAttribute('alt', 'Credential Type Logo');

        expect(name).toBeInTheDocument();
        expect(name).toHaveTextContent('Health ID');
    });

    it('should call onClick when clicked', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onClick={mockOnClick}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.click(card);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith(mockCredential);
    });

    it('should call onClick when pressing enter key', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onClick={mockOnClick}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.keyDown(card, {key: 'Enter'});

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith(mockCredential);
    });

    it('should have correct styling classes', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onClick={mockOnClick}
            />
        );

        const card = screen.getByRole('menuitem');
        expect(card).toHaveClass(
            'bg-iw-tileBackground',
            'grid',
            'grid-cols-[1fr_auto_2fr]',
            'gap-4',
            'items-center',
            'shadow',
            'hover:shadow-lg',
            'hover:scale-105',
            'hover:shadow-iw-selectedShadow',
            'p-4',
            'm-2',
            'rounded-md',
            'cursor-pointer'
        );

        const logo = screen.getByTestId('issuer-logo');
        expect(logo).toHaveClass('w-20', 'h-20');

        const name = screen.getByTestId('credential-type-display-name');
        expect(name).toHaveClass('text-sm', 'font-semibold', 'text-iw-title');
    });
});