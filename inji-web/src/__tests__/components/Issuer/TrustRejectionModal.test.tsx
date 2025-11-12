import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockUseTranslation } from '../../../test-utils/mockUtils';
import { TrustRejectionModal } from '../../../components/Issuers/TrustRejectionModal';
import { rejectVerifierRequest } from '../../../utils/verifierUtils';

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

const mockFetchData = jest.fn();
jest.mock('../../../hooks/useApi', () => ({
    useApi: () => ({
        fetchData: mockFetchData,
    }),
}));

jest.mock('../../../utils/verifierUtils', () => ({
    rejectVerifierRequest: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));




describe('TrustRejectionModal', () => {
    const mockOnConfirm = jest.fn();
    const mockOnClose = jest.fn();
    const mockRejectVerifierRequest = rejectVerifierRequest as jest.MockedFunction<typeof rejectVerifierRequest>;

    const defaultProps = {
        isOpen: true,
        presentationId: 'test-presentation-id',
        onConfirm: mockOnConfirm,
        onClose: mockOnClose,
        testId: 'testId',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockRejectVerifierRequest.mockResolvedValue(undefined);
    });

    it('does not render when isOpen is false', () => {
        render(<TrustRejectionModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
    });

    it('renders modal content when open', () => {
        render(<TrustRejectionModal {...defaultProps} />);

        expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
        expect(screen.getByTestId('title-cancel-confirmation')).toBeInTheDocument();
        expect(screen.getByTestId('text-cancel-confirmation-description')).toBeInTheDocument();
        expect(screen.getByTestId('btn-confirm-cancel')).toBeInTheDocument();
        expect(screen.getByTestId('btn-go-back')).toBeInTheDocument();
    });


    it('calls rejectVerifierRequest utility when confirm button clicked', async () => {
        render(<TrustRejectionModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-confirm-cancel'));
        
        await waitFor(() => {
            expect(mockRejectVerifierRequest).toHaveBeenCalledTimes(1);
            expect(mockRejectVerifierRequest).toHaveBeenCalledWith({
                presentationId: 'test-presentation-id',
                fetchData: expect.any(Function),
                onSuccess: mockOnConfirm,
                navigate: mockNavigate
            });
        });
    });

    it('calls onClose when go back clicked', () => {
        render(<TrustRejectionModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-go-back'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles default close handler when no onClose provided', () => {
        render(<TrustRejectionModal isOpen={true} presentationId="test-id" onConfirm={mockOnConfirm} testId="test" />);
        fireEvent.click(screen.getByTestId('btn-go-back'));
        expect(mockOnConfirm).not.toHaveBeenCalled(); 
    });

    it('calls rejectVerifierRequest even when onConfirm is not provided', async () => {
        render(<TrustRejectionModal isOpen={true} presentationId="test-id" testId="test" />);
        fireEvent.click(screen.getByTestId('btn-confirm-cancel'));
        
        await waitFor(() => {
            expect(mockRejectVerifierRequest).toHaveBeenCalledTimes(1);
            expect(mockRejectVerifierRequest).toHaveBeenCalledWith({
                presentationId: 'test-id',
                fetchData: expect.any(Function),
                onSuccess: undefined,
                navigate: mockNavigate
            });
        });
    });
});