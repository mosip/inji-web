import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import {ResponsiveIconButtonWithText} from '../../../../components/Common/Buttons/ResponsiveIconButtonWithText';

describe('ResponsiveIconButtonWithText Component', () => {
    const defaultProps = {
        testId: 'responsive-button',
        text: 'Download',
        icon: <div data-testid="test-icon">Icon</div>,
        onClick: jest.fn()
    };

    const renderButton = (props = {}) => {
        return render(
            <ResponsiveIconButtonWithText {...defaultProps} {...props} />
        );
    };

    it('matches snapshot with default props', () => {
        const {asFragment} = renderButton();

        expect(asFragment()).toMatchSnapshot();
    });

    it('calls onClick handler when button is clicked', () => {
        renderButton();

        const largeDeviceView = screen.getByTestId("non-small-device-view");
        const iconButton = within(largeDeviceView).getByTestId('btn-responsive-button');
        fireEvent.click(iconButton);

        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('should render text button when hovered on icon', () => {
        renderButton();

        const largeDeviceView = screen.getByTestId("non-small-device-view");
        const iconButton = within(largeDeviceView).getByTestId('btn-responsive-button');
        fireEvent.mouseEnter(iconButton);

        expect(screen.getByTestId('btn-responsive-button-hover-view')).toBeInTheDocument();
    });

    it('should render button for both small and large devices', () => {
        renderButton();

        expect(screen.getAllByTestId('btn-responsive-button')).toHaveLength(2);

        // Check small device view
        const smallDeviceView = screen.getByTestId("small-device-view");
        expect(smallDeviceView).toBeInTheDocument();
        expect(within(smallDeviceView).getByTestId('btn-responsive-button')).toBeInTheDocument();
        expect(within(smallDeviceView).getByRole("button", {name: /Download/i})).toBeInTheDocument();

        // Check large device view
        const largeDeviceView = screen.getByTestId("non-small-device-view");
        expect(largeDeviceView).toBeInTheDocument();
        expect(within(largeDeviceView).getByTestId('btn-responsive-button')).toBeInTheDocument();
    });
});