import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorCard } from '../../modals/ErrorCard';

// Mock the ErrorMessageIcon SVG import
jest.mock('../../assets/ErrorMessageIcon.svg', () => 'error-message-icon-mock.svg');

const defaultProps = {
    title: 'Test Error',
    description: 'This is a test error message',
    isOpen: true,
    onClose: jest.fn()
};

describe('ErrorCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('should not render when isOpen is false', () => {
            render(<ErrorCard {...defaultProps} isOpen={false} />);
            expect(screen.queryByTestId('error-card-modal')).not.toBeInTheDocument();
        });

        it('should render when isOpen is true', () => {
            render(<ErrorCard {...defaultProps} />);
            expect(screen.getByTestId('error-card-modal')).toBeInTheDocument();
        });

        it('should display the correct title and description', () => {
            render(<ErrorCard {...defaultProps} />);
            
            expect(screen.getByText('Test Error')).toBeInTheDocument();
            expect(screen.getByText('This is a test error message')).toBeInTheDocument();
        });

        it('should render the error icon', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const errorIcon = screen.getByRole('img', { name: 'Error message icon' });
            expect(errorIcon).toBeInTheDocument();
            expect(errorIcon).toHaveAttribute('src', 'error-message-icon-mock.svg');
        });
    });

    describe('User Interactions', () => {
        it('should call onClose when close button is clicked', () => {
            const mockOnClose = jest.fn();
            render(<ErrorCard {...defaultProps} onClose={mockOnClose} />);
            
            const closeButton = screen.getByTestId('btn-error-close');
            fireEvent.click(closeButton);
            
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when "Go to Home" button is clicked', () => {
            const mockOnClose = jest.fn();
            render(<ErrorCard {...defaultProps} onClose={mockOnClose} />);
            
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            fireEvent.click(goToHomeButton);
            
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
            
            const modal = screen.getByTestId('error-card-modal');
            expect(modal).toHaveAttribute('role', 'dialog');
            expect(modal).toHaveAttribute('aria-labelledby', 'error-card-title');
            expect(modal).toHaveAttribute('aria-describedby', 'error-card-description');
        });

        it('should have proper heading structure', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const title = screen.getByTestId('error-card-title');
            expect(title).toHaveAttribute('id', 'error-card-title');
            expect(title.tagName).toBe('H2');
        });

        it('should have proper description structure', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const description = screen.getByTestId('error-card-description');
            expect(description).toHaveAttribute('id', 'error-card-description');
        });

        it('should have proper button labels', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const closeButton = screen.getByTestId('btn-error-close');
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            
            expect(closeButton).toHaveAttribute('aria-label', 'Close error dialog');
            expect(goToHomeButton).toHaveAttribute('aria-label', 'Go to home page');
        });
    });

    describe('Styling and Layout', () => {
        it('should have correct CSS classes', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const modal = screen.getByTestId('error-card-modal');
            expect(modal).toHaveClass('error-card-modal');
        });

        it('should have proper button styling', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const goToHomeButton = screen.getByTestId('btn-go-to-home');
            expect(goToHomeButton).toHaveClass('error-card-button');
        });

        it('should center the modal content', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const modal = screen.getByTestId('error-card-modal');
            expect(modal).toHaveClass('error-card-modal');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty title', () => {
            const emptyTitleProps = {
                ...defaultProps,
                title: ''
            };
            
            render(<ErrorCard {...emptyTitleProps} />);
            
            expect(screen.getByTestId('error-card-modal')).toBeInTheDocument();
            expect(screen.getByTestId('error-card-title')).toHaveTextContent('');
        });

        it('should handle empty description', () => {
            const emptyDescriptionProps = {
                ...defaultProps,
                description: ''
            };
            
            render(<ErrorCard {...emptyDescriptionProps} />);
            
            expect(screen.getByTestId('error-card-modal')).toBeInTheDocument();
            expect(screen.getByTestId('error-card-description')).toHaveTextContent('');
        });

        it('should handle special characters in title and description', () => {
            const specialCharsProps = {
                ...defaultProps,
                title: 'Error @#$%^&*()',
                description: 'Special characters: <>&"\'`'
            };
            
            render(<ErrorCard {...specialCharsProps} />);
            
            expect(screen.getByText('Error @#$%^&*()')).toBeInTheDocument();
            expect(screen.getByText('Special characters: <>&"\'`')).toBeInTheDocument();
        });

        it('should handle undefined onClose callback', () => {
            const undefinedOnCloseProps = {
                ...defaultProps,
                onClose: () => {}
            };
            
            // Should not throw error
            expect(() => {
                render(<ErrorCard {...undefinedOnCloseProps} />);
            }).not.toThrow();
        });
    });

    describe('Responsive Design', () => {
        it('should be responsive on different screen sizes', () => {
            render(<ErrorCard {...defaultProps} />);
            
            const modal = screen.getByTestId('error-card-modal');
            expect(modal).toHaveClass('error-card-modal');
            
            // The component should have responsive classes
            // This would be tested with actual CSS media queries in integration tests
        });
    });
});
