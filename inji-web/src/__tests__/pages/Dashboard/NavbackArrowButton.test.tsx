import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavBackArrowButton } from '../../../pages/Dashboard/NavBackArrowButton';

describe('NavBackArrowButton', () => {
  it('renders the back arrow SVG with correct test id', () => {
    render(<NavBackArrowButton onBackClick={() => {}} />);
    const svgElement = screen.getByTestId('back-arrow-icon');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName.toLowerCase()).toBe('svg');
  });

  it('calls onBackClick handler when clicked', () => {
    const handleBackClick = jest.fn();
    render(<NavBackArrowButton onBackClick={handleBackClick} />);

    const svgElement = screen.getByTestId('back-arrow-icon');
    fireEvent.click(svgElement);

    expect(handleBackClick).toHaveBeenCalledTimes(1);
  });

  it('applies the expected classes', () => {
    render(<NavBackArrowButton onBackClick={() => {}} />);
    const svgElement = screen.getByTestId('back-arrow-icon');
    expect(svgElement).toHaveClass('mr-2 cursor-pointer');
  });
});
