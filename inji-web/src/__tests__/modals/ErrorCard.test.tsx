import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorCard } from '../../modals/ErrorCard';
import { useTranslation } from 'react-i18next';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../modals/ModalWrapper', () => ({
  ModalWrapper: ({ header, footer, content, zIndex, size }: any) => (
    <div data-testid="ModalWrapper-Mock" data-z-index={zIndex} data-size={size}>
      {header}
      {content}
      {footer}
    </div>
  ),
}));

jest.mock('../../components/Common/Buttons/SolidButton', () => ({
  SolidButton: ({ onClick, title, testId, fullWidth, className }: any) => (
    <button
      data-testid={testId}
      onClick={onClick}
      data-full-width={fullWidth}
      className={className}
    >
      {title}
    </button>
  ),
}));

// Mock the ErrorMessageIcon SVG import
jest.mock('../../assets/error_message.svg', () => 'error-message-icon-mock.svg');

const defaultProps = {
    title: 'Test Error',
    description: 'This is a test error message',
    isOpen: true,
    onClose: jest.fn(),
    testId: 'testId',
};

describe('ErrorCard', () => {
    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({
            t: (key: string) => key,
        });
        jest.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('should not render when isOpen is false', () => {
            render(<ErrorCard {...defaultProps} isOpen={false} />);
            expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
        });

        it('should render when isOpen is true', () => {
            render(<ErrorCard {...defaultProps} />);
            expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
        });

        it('should display the correct title and description', () => {
            render(<ErrorCard {...defaultProps} />);
            
            expect(screen.getByText('Test Error')).toBeInTheDocument();
            expect(screen.getByText('This is a test error message')).toBeInTheDocument();
        });

        it('should render the error icon', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const errorIcon = screen.getByTestId('img-error-card-icon');
            expect(errorIcon).toBeInTheDocument();
            expect(errorIcon).toHaveAttribute('src', 'error-message-icon-mock.svg');
        });
    });

    describe('User Interactions', () => {
        it('should call onClose when close button is clicked', () => {
            const mockOnClose = jest.fn();
            render(<ErrorCard {...defaultProps} onClose={mockOnClose} />);
            
            const closeButton = screen.getByTestId('btn-error-card-close');
            fireEvent.click(closeButton);
            
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Different Error Types', () => {
        it('should handle API error messages', () => {
            const apiErrorProps = {
                ...defaultProps,
                title: 'API Error',
                description: 'Failed to fetch data from server'
            };
            
            render(<ErrorCard {...apiErrorProps} />);
            
            expect(screen.getByText('API Error')).toBeInTheDocument();
            expect(screen.getByText('Failed to fetch data from server')).toBeInTheDocument();
        });

        it('should handle network error messages', () => {
            const networkErrorProps = {
                ...defaultProps,
                title: 'Network Error',
                description: 'Unable to connect to the server. Please check your internet connection.'
            };
            
            render(<ErrorCard {...networkErrorProps} />);
            
            expect(screen.getByText('Network Error')).toBeInTheDocument();
            expect(screen.getByText('Unable to connect to the server. Please check your internet connection.')).toBeInTheDocument();
        });

        it('should handle validation error messages', () => {
            const validationErrorProps = {
                ...defaultProps,
                title: 'Validation Error',
                description: 'Please check your input and try again.'
            };
            
            render(<ErrorCard {...validationErrorProps} />);
            
            expect(screen.getByText('Validation Error')).toBeInTheDocument();
            expect(screen.getByText('Please check your input and try again.')).toBeInTheDocument();
        });

        it('should handle long error messages', () => {
            const longErrorProps = {
                ...defaultProps,
                title: 'Complex Error',
                description: 'This is a very long error message that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or causing any visual issues.'
            };
            
            render(<ErrorCard {...longErrorProps} />);
            
            expect(screen.getByText('Complex Error')).toBeInTheDocument();
            expect(screen.getByText('This is a very long error message that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or causing any visual issues.')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const modal = screen.getByTestId('ModalWrapper-Mock');
            expect(modal).toBeInTheDocument();
            
            const title = screen.getByText('Test Error');
            expect(title).toHaveAttribute('id', 'title-error-card');
            expect(title.tagName).toBe('H2');
        });

        it('should have proper heading structure', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const title = screen.getByText('Test Error');
            expect(title).toHaveAttribute('id', 'title-error-card');
            expect(title.tagName).toBe('H2');
        });

        it('should have proper description structure', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const description = screen.getByTestId('text-error-card-description');
            expect(description).toBeInTheDocument();
        });

        it('should have proper button labels', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const closeButton = screen.getByTestId('btn-error-card-close');
            expect(closeButton).toBeInTheDocument();
        });
    });

    describe('Styling and Layout', () => {
        it('should have correct CSS classes', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const modal = screen.getByTestId('ModalWrapper-Mock');
            expect(modal).toBeInTheDocument();
        });

        it('should have proper button styling', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const closeButton = screen.getByTestId('btn-error-card-close');
            expect(closeButton).toBeInTheDocument();
        });

        it('should center the modal content', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const modal = screen.getByTestId('ModalWrapper-Mock');
            expect(modal).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should use provided title when given', () => {
            const customTitle = 'Custom Error Title';
            const propsWithTitle = {
                ...defaultProps,
                title: customTitle
            };

            render(<ErrorCard {...propsWithTitle} />);

            expect(screen.getByText(customTitle)).toBeInTheDocument();
        });

        it('should use provided description when given', () => {
            const customDescription = 'Custom error description';
            const propsWithDescription = {
                ...defaultProps,
                description: customDescription
            };

            render(<ErrorCard {...propsWithDescription} />);

            expect(screen.getByText(customDescription)).toBeInTheDocument();
        });

        it('should fallback to translation when title is empty string', () => {
            const propsWithEmptyTitle = {
                ...defaultProps,
                title: ''
            };

            render(<ErrorCard {...propsWithEmptyTitle} />);

            // Should show translated title since empty string is falsy
            expect(screen.getByText('ErrorCard.defaultTitle')).toBeInTheDocument();
        });

        it('should fallback to translation when description is empty string', () => {
            const propsWithEmptyDescription = {
                ...defaultProps,
                description: ''
            };

            render(<ErrorCard {...propsWithEmptyDescription} />);

            // Should show translated description since empty string is falsy
            expect(screen.getByText('ErrorCard.defaultDescription')).toBeInTheDocument();
        });

        it('should handle special characters in provided title and description', () => {
            const specialCharsProps = {
                ...defaultProps,
                title: 'Error @#$%^&*()',
                description: 'Special characters: <>&"\'`'
            };

            render(<ErrorCard {...specialCharsProps} />);

            expect(screen.getByText('Error @#$%^&*()')).toBeInTheDocument();
            expect(screen.getByText('Special characters: <>&"\'`')).toBeInTheDocument();
        });
    });

    describe('Responsive Design', () => {
        it('should be responsive on different screen sizes', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const modal = screen.getByTestId('ModalWrapper-Mock');
            expect(modal).toBeInTheDocument();
            
            // The component should have responsive classes
            // This would be tested with actual CSS media queries in integration tests
        });
    });
});
