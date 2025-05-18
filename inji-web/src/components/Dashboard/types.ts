export type DropdownItem = {
    label: string;
    onClick: () => void;
    textColor: string;
};

export type SidebarItemProps = {
    icon: React.ReactNode;
    text: string;
    path: string;
    isActive: boolean;
    isCollapsed: boolean;
};
