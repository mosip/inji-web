import { Location } from "react-router-dom";

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

export type InfoFieldProps = {
    label?: string;
    value?: string;
};

export type CollapseButtonProps = {
    isCollapsed: boolean;
    onClick: () => void;
    className?: string;
};

export type FooterProps = {
    footerRef: React.RefObject<HTMLDivElement>;
};

export type HeaderProps = {
    headerRef: React.RefObject<HTMLDivElement>;
};

export type DashboardHeaderProps = {
    headerRef: React.RefObject<HTMLDivElement>;
    headerHeight: number;
};

export type SideBarSvgIconProps = {
    outline: string;
    navUrl: string;
    location: Location;
}

export type User = {
    displayName: string;
    profilePictureUrl: string;
    email:string;
};

export type ErrorType = {
    errorCode: string;
    errorMessage: string;
};

export type UserContextType = {
    user: User | null;
    walletId: string | null;
    error: ErrorType | null;
    fetchUserProfile: () => Promise<{user: User; walletId: string}>;
    saveUser: (user: User) => void;
    removeUser: () => void;
    isLoading: boolean;
};
