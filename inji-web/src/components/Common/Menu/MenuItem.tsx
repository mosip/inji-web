import React from "react";

interface MenuItemProps {
    label: string;
    onClick: () => void;
    testId: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({label, onClick, testId}) => {
    return (
        <button
            onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onClick()
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 border-b border-[#EBF0FB] hover:bg-[#F2F6FF] last:border-b-0"
            data-testid={`menu-item-${testId}`}
            role="menuitem"
        >
            <span data-testid={`label-${testId}`} className="block">{label}</span>
        </button>
    );
};
