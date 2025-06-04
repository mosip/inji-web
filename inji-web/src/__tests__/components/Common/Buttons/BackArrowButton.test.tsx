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
        btnTestId: 'btn-back-arrow-container',
        iconTestId: 'icon-back-arrow',
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
            btnClassName: 'custom-btn-class',
            iconClassName: 'custom-icon-class',
            btnTestId: 'custom-btn-test-id',
            iconTestId: 'custom-icon-test-id',
            alt: 'Custom Alt Text'
        });

        expect(asFragment()).toMatchSnapshot();
    });

    test('renders button with provided btnTestId', () => {
        const customBtnTestId = 'test-btn-id';
        
        renderBackArrowButton({btnTestId: customBtnTestId});
        
        expect(screen.getByTestId(customBtnTestId)).toBeInTheDocument();
    });

    test('renders icon with provided iconTestId', () => {
        const customIconTestId = 'test-icon-id';
        
        renderBackArrowButton({iconTestId: customIconTestId});
        
        expect(screen.getByTestId(customIconTestId)).toBeInTheDocument();
    });

    test('renders with default test IDs when not provided', () => {
        renderBackArrowButton();
        
        expect(screen.getByTestId(defaultProps.btnTestId)).toBeInTheDocument();
        
        expect(screen.getByTestId(defaultProps.iconTestId)).toBeInTheDocument();
    });

    test('calls onClick handler when button is clicked', () => {
        renderBackArrowButton();
        
        fireEvent.click(screen.getByTestId(defaultProps.btnTestId));
        
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('applies custom button classes', () => {
        const customBtnClass = 'test-custom-class';
        renderBackArrowButton({btnClassName: customBtnClass});
        
        const button = screen.getByTestId(defaultProps.btnTestId);
        
        expect(button).toHaveClass(customBtnClass);
    });

    test('applies custom icon classes', () => {
        const customIconClass = 'test-icon-class';
        renderBackArrowButton({iconClassName: customIconClass});
        
        const img = screen.getByTestId(defaultProps.iconTestId);
        
        expect(img).toHaveClass(customIconClass);
    });

    test('renders the back arrow icon image with correct src', () => {
        renderBackArrowButton();
        const imgElement = screen.getByAltText(defaultProps.alt);
        
        expect(imgElement).toBeInTheDocument();
        
        expect(imgElement).toHaveAttribute('src', 'mocked-back-arrow-path');
    });

    test('applies default empty string as class when no className provided', () => {
        renderBackArrowButton();
        
        const button = screen.getByTestId(defaultProps.btnTestId);
        const img = screen.getByTestId(defaultProps.iconTestId);

        expect(button.className).toBe('');
        expect(img.className).toBe('');
    });

    test('sets custom alt text when provided', () => {
        const customAltText = 'Custom Alt Text Provided';
        renderBackArrowButton({alt: customAltText});
        
        const imgElement = screen.getByAltText(customAltText);
        
        expect(imgElement).toBeInTheDocument();
    });
});
