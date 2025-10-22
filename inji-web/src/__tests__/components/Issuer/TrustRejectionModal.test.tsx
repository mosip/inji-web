import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockUseTranslation } from '../../../test-utils/mockUtils';


mockUseTranslation();

jest.mock('../../../modals/ModalWrapper', () => ({
    ModalWrapper: ({ content }: any) => (
        <div data-testid="ModalWrapper-Mock">{content}</div>
    ),
}));


jest.mock('../../../components/Common/Buttons/SolidButton', () => ({
    SolidButton: ({ onClick, title, testId }: any) => (
        <button data-testid={testId} onClick={onClick}>
            {title}
        </button>
    ),
}));


jest.mock('../../../components/Common/Buttons/BorderedButton', () => ({
    BorderedButton: ({ onClick, title, testId }: any) => (
        <button data-testid={testId} onClick={onClick}>
            {title}
        </button>
    ),
}));


import { TrustRejectionModal } from '../../../components/Issuers/TrustRejectionModal';

describe('TrustRejectionModal', () => {
    const mockOnConfirm = jest.fn();
    const mockOnClose = jest.fn();

    const defaultProps = {
        isOpen: true,
        onConfirm: mockOnConfirm,
        onClose: mockOnClose,
        testId: 'testId',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render when isOpen is false', () => {
        render(<TrustRejectionModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
    });

    it('renders modal content when open', () => {
        render(<TrustRejectionModal {...defaultProps} />);

        expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to cancel?')).toBeInTheDocument();
        expect(
            screen.getByText('If you cancel this, your request will not be processed and may be lost.')
        ).toBeInTheDocument();
        expect(screen.getByText('Yes, Cancel')).toBeInTheDocument();
        expect(screen.getByText('Go back')).toBeInTheDocument();
    });


    it('calls onConfirm when confirm button clicked', () => {
        render(<TrustRejectionModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-confirm-cancel'));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when go back clicked', () => {
        render(<TrustRejectionModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-go-back'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles default close handler when no onClose provided', () => {
        render(<TrustRejectionModal isOpen={true} onConfirm={mockOnConfirm} />);
        fireEvent.click(screen.getByTestId('btn-go-back'));
        expect(mockOnConfirm).not.toHaveBeenCalled(); 
    });
});