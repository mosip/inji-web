import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BackArrowButton} from '../../../../components/Common/Buttons/BackArrowButton';

jest.mock(
    '../../../../assets/BackArrowIcon.svg',
    () => 'mocked-back-arrow-path'
);

describe('BackArrowButton Component', () => {
    const mockOnClick = jest.fn();

    const defaultProps = {
        onClick: mockOnClick,
        testId: 'btn-back-arrow',
        alt: 'Back Arrow'
    };

    const renderBackArrowButton = (props = {}) => {
        return render(<BackArrowButton {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    test('matches snapshot with default props', () => {
        const {asFragment} = renderBackArrowButton();
        
        expect(asFragment()).toMatchSnapshot();
    });

    test('matches snapshot with custom props', () => {
        const {asFragment} = renderBackArrowButton({
            className: 'custom-class',
            testId: 'custom-back-button',
            alt: 'Custom Alt Text'
        });
        
        expect(asFragment()).toMatchSnapshot();
    });

    test('renders with default test ID', () => {
        renderBackArrowButton();
        
        expect(screen.getByTestId(defaultProps.testId)).toBeInTheDocument();
    });

    test('renders with custom test ID', () => {
        const customTestId = 'my-unique-button';
        
        renderBackArrowButton({testId: customTestId});
        
        expect(screen.getByTestId(customTestId)).toBeInTheDocument();
    });

    test('sets default alt text', () => {
        renderBackArrowButton();
        
        expect(screen.getByTestId(defaultProps.testId)).toHaveAttribute(
            'alt',
            defaultProps.alt
        );
    });

    test('sets custom alt text when provided', () => {
        const customAltText = 'Go Back Now';
        
        renderBackArrowButton({alt: customAltText});
        
        expect(screen.getByTestId(defaultProps.testId)).toHaveAttribute(
            'alt',
            customAltText
        );
    });

    test('uses correct image source', () => {
        renderBackArrowButton();
        
        expect(screen.getByTestId(defaultProps.testId)).toHaveAttribute(
            'src',
            'mocked-back-arrow-path'
        );
    });

    test('calls onClick handler when clicked', () => {
        renderBackArrowButton();
        
        fireEvent.click(screen.getByTestId(defaultProps.testId));
        
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('applies default cursor-pointer class', () => {
        renderBackArrowButton();
        
        expect(screen.getByTestId(defaultProps.testId)).toHaveClass(
            'cursor-pointer'
        );
    });

    test('applies custom classes along with default class', () => {
        renderBackArrowButton({className: 'test-custom-class another-class'});
        
        const button = screen.getByTestId(defaultProps.testId);
        
        expect(button).toHaveClass(
            'cursor-pointer',
            'test-custom-class',
            'another-class'
        );
    });
});
