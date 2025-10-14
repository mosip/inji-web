import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockUseTranslation } from '../../test-utils/mockUtils';

// Mock the translation hook
mockUseTranslation();

// FIX: Correcting ALL mock paths to match the component's relative imports.

// 1. Mock ModalWrapper (Sibling path: "./ModalWrapper")
jest.mock('../../modals/ModalWrapper', () => ({
    ModalWrapper: ({ content }: any) => (
        <div data-testid="ModalWrapper-Mock">{content}</div>
    ),
}));

// 2. Mock SolidButton (Parent path: "../components/Common/Buttons/SolidButton")
jest.mock('../../components/Common/Buttons/SolidButton', () => ({
    SolidButton: ({ onClick, title, testId }: any) => (
        <button data-testid={testId} onClick={onClick}>
            {title}
        </button>
    ),
}));

// 3. Mock SecondaryBorderedButton (Parent path: "../components/Common/Buttons/SecondaryBorderedButton")
jest.mock('../../components/Common/Buttons/SecondaryBorderedButton', () => ({
    SecondaryBorderedButton: ({ onClick, title, testId }: any) => (
        <button data-testid={testId} onClick={onClick}>
            {title}
        </button>
    ),
}));

// Import the component AFTER its dependencies are mocked
import { CancelConfirmationModal } from '../../modals/CancelConfirmationModal';

describe('CancelConfirmationModal', () => {
    const mockOnConfirm = jest.fn();
    const mockOnClose = jest.fn();

    const defaultProps = {
        isOpen: true,
        onConfirm: mockOnConfirm,
        onClose: mockOnClose,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render when isOpen is false', () => {
        render(<CancelConfirmationModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
    });

    it('renders modal content when open', () => {
        render(<CancelConfirmationModal {...defaultProps} />);

        expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to cancel?')).toBeInTheDocument();
        expect(
            screen.getByText('If you cancel this, your request will not be processed and may be lost.')
        ).toBeInTheDocument();
        expect(screen.getByText('Yes, Cancel')).toBeInTheDocument();
        expect(screen.getByText('Go back')).toBeInTheDocument();
    });


    it('calls onConfirm when confirm button clicked', () => {
        render(<CancelConfirmationModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('confirm-button'));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when go back clicked', () => {
        render(<CancelConfirmationModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('go-back-button'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles default close handler when no onClose provided', () => {
        render(<CancelConfirmationModal isOpen={true} onConfirm={mockOnConfirm} />);
        fireEvent.click(screen.getByTestId('go-back-button'));
        expect(mockOnConfirm).not.toHaveBeenCalled(); // only ensures no crash
    });
});