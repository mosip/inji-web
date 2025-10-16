import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoTooltipTrigger } from '../../../components/Common/ToolTip/InfoTooltipTrigger';

jest.mock('../../../assets/infoIconWhite.svg', () => 'infoIconWhite.svg');

describe('InfoTooltipTrigger', () => {
  const defaultProps = {
    infoButtonText: 'Why Trust This?',
    tooltipText: 'This tooltip provides crucial information.',
    testId: 'test-info-tooltip',
  };

  const queryTooltip = () => screen.queryByTestId('text-tooltip-content');
  const getTriggerButton = () => screen.getByTestId('btn-info-tooltip-trigger-button');

  const renderComponent = (props = defaultProps) => {
    return render(<InfoTooltipTrigger {...props} />);
  };

  test('should render the trigger button and hide the tooltip initially', () => {
    renderComponent();

    const wrapper = screen.getByTestId(defaultProps.testId);
    expect(wrapper).toBeInTheDocument();

    const button = getTriggerButton();
    expect(button).toBeInTheDocument();
    expect(screen.getByText(defaultProps.infoButtonText)).toBeInTheDocument();
    expect(screen.getByAltText('Information icon')).toBeInTheDocument();

    expect(queryTooltip()).not.toBeInTheDocument();
  });

  test('should show the tooltip when the button is clicked and hide it on a second click', () => {
    renderComponent();
    const button = getTriggerButton();

    fireEvent.click(button);
    
    const tooltip = screen.getByTestId('text-tooltip-content');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText(defaultProps.tooltipText)).toBeVisible();
    
    fireEvent.click(button);
    expect(queryTooltip()).not.toBeInTheDocument();
  });

  test('should show the tooltip on mouseEnter and hide it on mouseLeave', () => {
    renderComponent();
    const button = getTriggerButton();

    fireEvent.mouseEnter(button);
    let tooltip = screen.getByTestId('text-tooltip-content');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText(defaultProps.tooltipText)).toBeVisible();

    fireEvent.mouseLeave(button);
    expect(queryTooltip()).not.toBeInTheDocument();
  });
  
  test('mouseLeave hides the tooltip even after a click to prevent sticky tooltips on accidental mouse out', () => {
    renderComponent();
    const button = getTriggerButton();

    fireEvent.mouseEnter(button);
    expect(queryTooltip()).toBeInTheDocument();

    fireEvent.click(button); 

    fireEvent.mouseLeave(button);
    
    expect(queryTooltip()).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(queryTooltip()).toBeInTheDocument();
    
    fireEvent.mouseEnter(button);
    expect(queryTooltip()).toBeInTheDocument();
  });

  test('should match the snapshot when the tooltip is visible', () => {
    const { asFragment } = renderComponent();
    
    fireEvent.click(getTriggerButton());

    expect(asFragment()).toMatchSnapshot();
  });
});