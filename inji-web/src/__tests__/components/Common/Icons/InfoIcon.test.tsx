import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {InfoIcon} from '../../../../components/Common/Icons/InfoIcon';

jest.mock('../../../../assets/InfoIcon.svg', () => 'mocked-info-icon-path');

describe('InfoIcon Component', () => {
    const defaultProps = {
        testId: 'icon-info',
        alt: 'Info'
    };

    const renderInfoIcon = (props = {}) => {
        return render(<InfoIcon {...defaultProps} {...props} />);
    };

    it('matches snapshot with default props', () => {
        const {asFragment} = renderInfoIcon();

        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with custom props', () => {
        const {asFragment} = renderInfoIcon({
            className: 'custom-class mt-2',
            testId: 'custom-info-icon',
            alt: 'Custom Info Text'
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with default test ID', () => {
        renderInfoIcon();

        expect(screen.getByTestId(defaultProps.testId)).toBeInTheDocument();
    });

    it('renders with custom test ID', () => {
        const customTestId = 'my-info-icon-id';

        renderInfoIcon({testId: customTestId});

        expect(screen.getByTestId(customTestId)).toBeInTheDocument();
    });

    it('renders with custom className', () => {
        const customClass = 'test-custom-class';
        renderInfoIcon({className: customClass});
        
        const icon = screen.getByTestId(defaultProps.testId);
        
        expect(icon).toHaveClass(customClass);
    });

    it('renders without any class when no className is provided', () => {
        renderInfoIcon({className: ''});
        
        const icon = screen.getByTestId(defaultProps.testId);
        
        expect(icon.className).toBe('');
    });

    it('sets correct default alt text', () => {
        renderInfoIcon();
        
        const icon = screen.getByTestId(defaultProps.testId);
       
        expect(icon).toHaveAttribute('alt', defaultProps.alt);
    });

    it('sets custom alt text when provided', () => {
        const customAltText = 'Custom Info Text';
        renderInfoIcon({alt: customAltText});

        const icon = screen.getByTestId(defaultProps.testId);
        
        expect(icon).toHaveAttribute('alt', customAltText);
    });

    it('uses correct image source', () => {
        renderInfoIcon();

        const icon = screen.getByTestId(defaultProps.testId);

        expect(icon).toHaveAttribute('src', 'mocked-info-icon-path');
    });
});
