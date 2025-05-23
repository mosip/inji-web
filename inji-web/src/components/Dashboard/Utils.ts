import { Location } from "react-router-dom";

export const getIconColor = (path: string, location: Location) => {
    return location.pathname === path
        ? 'var(--iw-color-dashboardSideBarMenuIconActive)'
        : 'var(--iw-color-dashboardSideBarMenuIcon)';
};

export const getProfileInitials = (displayName: string | undefined) => {
    return displayName
        ? displayName
              .split(' ')
              .map((name) => name.charAt(0).toUpperCase())
              .join('')
        : 'U';
};