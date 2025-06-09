import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EllipsisMenu } from '../../../../components/Common/Menu/EllipsisMenu';

describe('EllipsisMenu Component', () => {
    const mockMenuItems = [
        { label: 'Edit', onClick: jest.fn(), id: "edit" },
        { label: 'Delete', onClick: jest.fn(), id: "delete" }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    //TODO: Unskip this test when the feature is fully implemented to avoid snapshot mismatch
    it.skip('renders correctly and matches snapshot', () => {
        const { asFragment } = render(<EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders the ellipsis button', () => {
        render(<EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>);

        const button = screen.getByTestId('icon-three-dots-menu');

        expect(button).toBeInTheDocument();
    });

    it('does not show menu items when initially rendered', () => {
        render(<EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>);

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('shows menu items when button is clicked', () => {
        render(<EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>);

        const button = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(button);

        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();

        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems).toHaveLength(2);
        expect(menuItems[0]).toHaveTextContent('Edit');
        expect(menuItems[1]).toHaveTextContent('Delete');
    });

    it('calls the onClick handler and closes menu when a menu item is clicked', () => {
        render(<EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>);

        const button = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(button);

        const editMenuItem = screen.getByTestId('menu-item-edit');
        fireEvent.click(editMenuItem);

        expect(mockMenuItems[0].onClick).toHaveBeenCalledTimes(1);
        // Check if the menu is closed after clicking an item
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('toggles menu visibility when button is clicked multiple times', () => {
        render(<EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>);

        const button = screen.getByTestId('icon-three-dots-menu');

        // Initially not visible
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        // First click - show menu
        fireEvent.click(button);
        expect(screen.getByRole('menu')).toBeInTheDocument();
        // Second click - hide menu
        fireEvent.click(button);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('stops event propagation when clicking the button', () => {
        const mockContainerClick = jest.fn();

        render(
            <div onClick={mockContainerClick}>
            <EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>
        </div>
    );

        const button = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(button);

        expect(mockContainerClick).not.toHaveBeenCalled();
    });

    it('closes the menu when clicking outside', () => {
        render(
            <div>
                <div data-testid="outside-element">Outside</div>
                <EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>
        </div>
    );

        // Open the menu
        const button = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(button);
        // Menu should be visible
        expect(screen.getByRole('menu')).toBeInTheDocument();
        // Click outside the menu
        const outsideElement = screen.getByTestId('outside-element');
        fireEvent.mouseDown(outsideElement);

        // Menu should be closed
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('does not close the menu when clicking inside the menu', () => {
        render(<EllipsisMenu menuItems={mockMenuItems} testId={"test-view"}/>);
        // Open the menu
        const button = screen.getByTestId('icon-three-dots-menu');
        fireEvent.click(button);
        // Click on the menu container (not on a menu item)
        const menu = screen.getByRole('menu');
        fireEvent.mouseDown(menu);

        // Menu should still be visible
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });
});