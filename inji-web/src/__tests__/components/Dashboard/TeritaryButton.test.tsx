import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeritaryButton } from '../../../pages/Dashboard/TeritaryButton';

describe('TeritaryButton', () => {
  const mockOnClick = jest.fn();

  const defaultProps = {
    title: 'Click Me',
    onClick: mockOnClick,
    testId: 'sample',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with correct title and test id', () => {
    render(<TeritaryButton {...defaultProps} />);

    const button = screen.getByTestId('btn-sample');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');
    expect(button).toHaveClass('text-iw-secondary');
  });

  it('calls onClick when clicked', () => {
    render(<TeritaryButton {...defaultProps} />);

    fireEvent.click(screen.getByTestId('btn-sample'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies responsive and hover styles correctly', () => {
    render(<TeritaryButton {...defaultProps} />);

    const button = screen.getByTestId('btn-sample');

    expect(button).toHaveClass('text-xs', 'sm:text-sm', 'hover:underline');
  });
});
