import React from 'react';
import { render } from '@testing-library/react';
import { CircleSkeleton } from '../../../components/Dashboard/CircleSkeleton';

describe('CircleSkeleton', () => {
  it('renders with default size', () => {
    const { container } = render(<CircleSkeleton />);
    const div = container.firstChild as HTMLElement;

    expect(div).toHaveClass('rounded-full');
    expect(div).toHaveClass('bg-gray-300');
    expect(div).toHaveClass('animate-pulse');
    expect(div.className).toContain('w-20');
    expect(div.className).toContain('h-20');
  });

  it('renders with custom size', () => {
    const { container } = render(<CircleSkeleton size="w-12 h-12" />);
    const div = container.firstChild as HTMLElement;

    expect(div.className).toContain('w-12');
    expect(div.className).toContain('h-12');
  });

  it('applies additional className', () => {
    const { container } = render(<CircleSkeleton className="custom-class" />);
    const div = container.firstChild as HTMLElement;

    expect(div.className).toContain('custom-class');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<CircleSkeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
