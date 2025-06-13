import React from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { Clickable } from '../../../components/Common/Clickable';

describe('Clickable Component', () => {
  const mockOnClick = jest.fn();
  const testId = 'test-clickable';
  const childText = 'Click me';
  const customClass = 'custom-class';

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders with correct content and attributes', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(childText);
    expect(element).toHaveAttribute('role', 'menuitem');
    expect(element).toHaveAttribute('tabIndex', '0');
  });

  test('applies the provided className', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    expect(element).toHaveClass(customClass);
  });

  test('uses empty string as default className when not provided', () => {
    // Explicitly making className undefined to test the default value
    render(
      <Clickable
        onClick={mockOnClick}
        testId={testId}
        className={undefined as unknown as string}
      >
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    expect(element).not.toHaveClass(); // Should have no classes
  });

  test('calls onClick when clicked', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    fireEvent.click(element);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick when Enter key is pressed', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    fireEvent.keyDown(element, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick when Space key is pressed', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    fireEvent.keyDown(element, { key: ' ' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('prevents default when Enter key is pressed', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    const event = createEvent.keyDown(element, { key: 'Enter' });
    fireEvent(element, event);

    expect(event.defaultPrevented).toBeTruthy();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('prevents default when Space key is pressed', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    const event = createEvent.keyDown(element, { key: ' ' });
    fireEvent(element, event);

    expect(event.defaultPrevented).toBeTruthy();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when other keys are pressed', () => {
    render(
      <Clickable onClick={mockOnClick} testId={testId} className={customClass}>
        {childText}
      </Clickable>
    );

    const element = screen.getByTestId(testId);
    fireEvent.keyDown(element, { key: 'Tab' });

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});