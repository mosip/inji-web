import React from 'react';
import { render } from '@testing-library/react';
import { InfoFieldSkeleton } from '../../../components/Common/InfoFieldSkeleton';

describe('InfoFieldSkeleton', () => {
  it('renders with default width and height', () => {
    const { container } = render(<InfoFieldSkeleton />);
    const div = container.firstChild as HTMLElement;

    expect(div).toHaveClass('bg-gray-300');
    expect(div).toHaveClass('rounded');
    expect(div).toHaveClass('animate-pulse');
    expect(div.className).toContain('w-full');
    expect(div.className).toContain('h-4');
  });

  it('renders with custom width and height', () => {
    const { container } = render(
      <InfoFieldSkeleton width="w-1/2" height="h-2" />
    );
    const div = container.firstChild as HTMLElement;

    expect(div.className).toContain('w-1/2');
    expect(div.className).toContain('h-2');
  });

  it('applies additional className', () => {
    const { container } = render(
      <InfoFieldSkeleton className="extra-class" />
    );
    const div = container.firstChild as HTMLElement;

    expect(div.className).toContain('extra-class');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<InfoFieldSkeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
