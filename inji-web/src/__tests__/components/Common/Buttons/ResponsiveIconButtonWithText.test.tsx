import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResponsiveIconButtonWithText } from '../../../../components/Common/Buttons/ResponsiveIconButtonWithText';

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
    const { asFragment } = renderButton();

    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onClick handler when button is clicked', () => {
    renderButton();

    fireEvent.click(screen.getByTestId('btn-responsive-button'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should render text button when hovered on icon', () => {
    renderButton();

    const iconButton = screen.getByTestId('btn-responsive-button-icon');
    fireEvent.mouseEnter(iconButton);

    // 1 mobile button + 1 text button which is visible on hover
    expect(screen.getAllByTestId('btn-responsive-button')).toHaveLength(2);
  });
});