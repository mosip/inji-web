import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InfoTooltip } from '../../../../components/Common/ToolTip/InfoTooltip';

jest.mock('../../../../assets/infoIconWhite.svg', () => 'mocked-info-icon-path');

describe('InfoTooltip Component', () => {
    const defaultProps = {
        infoButtonText: 'Info',
        tooltipText: 'This is a helpful tooltip message',
        className: '',
        testId: ''
    };

    const renderInfoTooltip = (props = {}) => {
        return render(<InfoTooltip {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial rendering', () => {
        it('should match snapshot with default props', () => {
            const { asFragment } = renderInfoTooltip();
            expect(asFragment()).toMatchSnapshot();
        });

        it('should match snapshot with custom props', () => {
            const { asFragment } = renderInfoTooltip({
                infoButtonText: 'Custom Info',
                tooltipText: 'Custom tooltip text',
                className: 'custom-class',
                testId: 'custom-test-id'
            });
            expect(asFragment()).toMatchSnapshot();
        });

        it('should render the button with correct text', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            expect(button).toBeInTheDocument();
            expect(screen.getByTestId('text-info-button-label')).toHaveTextContent('Info');
        });

        it('should render the info icon', () => {
            renderInfoTooltip();
            const icon = screen.getByTestId('text-info-icon');
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveAttribute('src', 'mocked-info-icon-path');
            expect(icon).toHaveAttribute('alt', 'Information icon');
            expect(icon).toHaveAttribute('aria-hidden', 'true');
        });

        it('should not render tooltip initially', () => {
            renderInfoTooltip();
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
            expect(screen.queryByTestId('text-tooltip-message')).not.toBeInTheDocument();
        });

        it('should apply custom className to wrapper', () => {
            renderInfoTooltip({ className: 'custom-wrapper-class', testId: 'custom-test-id' });
            const wrapper = screen.getByTestId('custom-test-id');
            expect(wrapper).toHaveClass('custom-wrapper-class');
        });

        it('should apply custom testId to wrapper', () => {
            renderInfoTooltip({ testId: 'custom-test-id' });
            expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
        });
    });

    describe('Tooltip toggle functionality', () => {
        it('should show tooltip when button is clicked', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            expect(screen.getByTestId('text-tooltip-message')).toHaveTextContent('This is a helpful tooltip message');
        });

        it('should hide tooltip when button is clicked again', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.click(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });

        it('should display correct tooltip text', () => {
            renderInfoTooltip({ tooltipText: 'Custom tooltip message' });
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            
            expect(screen.getByTestId('text-tooltip-message')).toHaveTextContent('Custom tooltip message');
        });
    });

    describe('Mouse interactions', () => {
        it('should show tooltip on mouse enter', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.mouseEnter(button);
            
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
        });

        it('should hide tooltip on mouse leave', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.mouseEnter(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.mouseLeave(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });

        it('should toggle tooltip on click after mouse enter', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.mouseEnter(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.click(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
            
            fireEvent.click(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
        });
    });

    describe('Focus and blur interactions', () => {
        it('should show tooltip on focus', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.focus(button);
            
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
        });

        it('should hide tooltip on blur', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.focus(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.blur(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });
    });

    describe('Keyboard interactions', () => {
        it('should toggle tooltip on Enter key press', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.keyDown(button, { key: 'Enter' });
            
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.keyDown(button, { key: 'Enter' });
            
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });

        it('should toggle tooltip on Space key press', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.keyDown(button, { key: ' ' });
            
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.keyDown(button, { key: ' ' });
            
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });

        it('should toggle tooltip on Escape key press', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.keyDown(button, { key: 'Escape' });
            
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });

        it('should toggle tooltip and handle events on Enter, Space, or Escape key', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            ['Enter', ' ', 'Escape'].forEach((key) => {
                // Reset tooltip state
                if (screen.queryByTestId('text-tooltip-content')) {
                    fireEvent.keyDown(button, { key });
                }
                
                fireEvent.keyDown(button, { key });
                
                // The component's onKeyDown handler should toggle the tooltip
                expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            });
        });

        it('should not toggle tooltip on other key presses', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.keyDown(button, { key: 'Tab' });
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
            
            fireEvent.keyDown(button, { key: 'a' });
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should set aria-describedby when tooltip is visible', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            expect(button).not.toHaveAttribute('aria-describedby');
            
            fireEvent.click(button);
            
            const tooltip = screen.getByTestId('text-tooltip-content');
            const tooltipId = tooltip.getAttribute('id');
            expect(button).toHaveAttribute('aria-describedby', tooltipId);
        });

        it('should remove aria-describedby when tooltip is hidden', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            expect(button).toHaveAttribute('aria-describedby');
            
            fireEvent.click(button);
            expect(button).not.toHaveAttribute('aria-describedby');
        });

        it('should have role="tooltip" on tooltip container', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            
            const tooltip = screen.getByTestId('text-tooltip-content');
            expect(tooltip).toHaveAttribute('role', 'tooltip');
        });

        it('should have unique ID for tooltip', () => {
            const { unmount } = renderInfoTooltip();
            const button1 = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button1);
            const tooltipId1 = screen.getByTestId('text-tooltip-content').getAttribute('id');
            
            unmount();
            renderInfoTooltip();
            const button2 = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button2);
            const tooltipId2 = screen.getByTestId('text-tooltip-content').getAttribute('id');
            
            expect(tooltipId1).not.toBe(tooltipId2);
            expect(tooltipId1).toMatch(/^tooltip-/);
            expect(tooltipId2).toMatch(/^tooltip-/);
        });
    });

    describe('Tooltip content structure', () => {
        it('should render tooltip triangle wrapper with SVG', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            
            const tooltip = screen.getByTestId('text-tooltip-content');
            const svg = tooltip.querySelector('svg');
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
            
            const polygon = svg?.querySelector('polygon');
            expect(polygon).toBeInTheDocument();
            expect(polygon).toHaveAttribute('points', '0,0 10,20 20,0');
        });

        it('should render tooltip message in paragraph', () => {
            renderInfoTooltip({ tooltipText: 'Test message' });
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            
            const message = screen.getByTestId('text-tooltip-message');
            expect(message).toBeInTheDocument();
            expect(message.tagName).toBe('P');
            expect(message).toHaveTextContent('Test message');
        });
    });

    describe('Props handling', () => {
        it('should use default empty string for className when not provided', () => {
            renderInfoTooltip();
            const wrapper = screen.getByTestId('btn-info-tooltip-trigger-button').closest('div');
            expect(wrapper).toBeInTheDocument();
        });

        it('should use default empty string for testId when not provided', () => {
            renderInfoTooltip({ testId: undefined as unknown as string });
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            expect(button).toBeInTheDocument();
        });

        it('should render with different infoButtonText', () => {
            renderInfoTooltip({ infoButtonText: 'Help' });
            expect(screen.getByTestId('text-info-button-label')).toHaveTextContent('Help');
        });

        it('should render with different tooltipText', () => {
            renderInfoTooltip({ tooltipText: 'Different help text' });
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.click(button);
            
            expect(screen.getByTestId('text-tooltip-message')).toHaveTextContent('Different help text');
        });
    });

    describe('Complex interactions', () => {
        it('should handle rapid toggling', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            // Click 1: false -> true
            fireEvent.click(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            // Click 2: true -> false
            fireEvent.click(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
            
            // Click 3: false -> true
            fireEvent.click(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            // Click 4: true -> false
            fireEvent.click(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });

        it('should handle mouse enter followed by click', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.mouseEnter(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.click(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
        });

        it('should handle focus followed by blur followed by click', () => {
            renderInfoTooltip();
            const button = screen.getByTestId('btn-info-tooltip-trigger-button');
            
            fireEvent.focus(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
            
            fireEvent.blur(button);
            expect(screen.queryByTestId('text-tooltip-content')).not.toBeInTheDocument();
            
            fireEvent.click(button);
            expect(screen.getByTestId('text-tooltip-content')).toBeInTheDocument();
        });
    });
});

