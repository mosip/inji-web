export type DropdownItem = {
    label: string;
    onClick: () => void;
    textColor: string;
    key: string;
};

export type SidebarItemType = {
    icon: React.ReactNode;
    text: string;
    path: string;
    key: string;
};

export type SidebarItemProps = {
    icon: React.ReactNode;
    text: string;
    path: string;
    isActive: boolean;
    isCollapsed: boolean;
};

export type SearchCredentialProps = {
    issuerContainerBorderRadius?: string;
}

export type FAQPageProps = {
    backUrl?: string;
    withHome?: boolean;
};

export type CredentialTypesPageProps = {
    backUrl?: string;
};