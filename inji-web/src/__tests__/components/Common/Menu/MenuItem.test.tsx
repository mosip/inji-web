import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {MenuItem} from '../../../../components/Common/Menu/MenuItem';
import {Clickable} from "../../../../components/Common/Clickable";

describe('MenuItem Component', () => {
  const mockOnClick = jest.fn();
  const label = 'Test Item';
  const testId = 'test-menu';

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MenuItem label={label} onClick={mockOnClick} testId={testId} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with the correct label', () => {
    render(<MenuItem label={label} onClick={mockOnClick} testId={testId} />);

    const menuItem = screen.getByTestId("menu-item-test-menu");
    expect(menuItem).toHaveTextContent(label);
    expect(screen.getByTestId(`label-${testId}`)).toHaveTextContent(label);
  });

  it('renders with the correct role', () => {
    render(<MenuItem label={label} onClick={mockOnClick} testId={testId} />);

    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<MenuItem label={label} onClick={mockOnClick} testId={testId} />);

    const menuItem = screen.getByTestId("menu-item-test-menu");
    fireEvent.click(menuItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('stops event propagation when clicked', () => {
    const mockContainerClick = jest.fn();

    render(
      <Clickable onClick={mockContainerClick} testId={`${testId}-wrapper`}>
        <MenuItem label={label} onClick={mockOnClick} testId={testId} />
      </Clickable>
    );

    const menuItem = screen.getByTestId("menu-item-test-menu");
    fireEvent.click(menuItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockContainerClick).not.toHaveBeenCalled();
  });

  it('renders without testId when not provided', () => {
    render(<MenuItem label={label} onClick={mockOnClick} testId={"delete"}/>);

    const menuItem = screen.getByRole('menuitem');

    expect(menuItem).toHaveAttribute('data-testid', 'menu-item-delete');
  });
});