import React, {useEffect, useRef, useState} from "react";
import {MenuItem} from "./MenuItem";
import {RxDotsHorizontal} from "react-icons/rx";
import {MenuItemType} from "../../../types/data";

interface EllipsisMenuProps {
    menuItems: MenuItemType[];
    testId: string;
}

export const EllipsisMenu: React.FC<EllipsisMenuProps> = ({menuItems, testId}) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left">
            <button
                ref={buttonRef}
                onClick={(event) => {
                    event.stopPropagation()
                    setIsOpen((prev) => !prev)
                }}
                data-testid="icon-three-dots-menu"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
                <RxDotsHorizontal size={20} color={"#707070"}/>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    data-testid={`menu-${testId}`}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50"
                >
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            label={item.label}
                            onClick={() => {
                                item.onClick();
                                setIsOpen(false); // auto close on click
                            }}
                            testId={item.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
