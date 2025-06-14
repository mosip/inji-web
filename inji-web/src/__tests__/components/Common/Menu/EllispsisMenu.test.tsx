import React from 'react';
import { render, screen } from '@testing-library/react';
import { EllipsisMenu } from "../../../../components/Common/Menu/EllipsisMenu";
import { MenuItemType } from "../../../../types/data";

jest.mock('../../../../components/Common/Menu/Menu', () => ({
  Menu: ({ testId, menuItems, triggerComponent }: any) => (
    <div data-testid={`mock-menu-${testId}`}>
      <div data-testid="trigger-wrapper">
        {triggerComponent}
      </div>
    </div>
  )
}));

describe('EllipsisMenu', () => {
  const mockMenuItems: MenuItemType[] = [
    { id: 'view', label: 'View', onClick: jest.fn() }
  ];

  it('should render with three-dots icon', () => {
    render(<EllipsisMenu testId="test-menu" menuItems={mockMenuItems} />);

    const icon = screen.getByTestId('icon-three-dots-menu');
    expect(icon).toBeInTheDocument();
  });

  it('should pass trigger component to Menu', () => {
    render(<EllipsisMenu testId="test-menu" menuItems={mockMenuItems} />);

    const triggerWrapper = screen.getByTestId('trigger-wrapper');
    const icon = screen.getByTestId('icon-three-dots-menu');

    expect(triggerWrapper).toContainElement(icon);
  });
});