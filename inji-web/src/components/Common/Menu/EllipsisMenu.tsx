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
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50"
                >
                    <div
                        className="absolute -top-[10px] right-[14px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-gray-200 z-[-1]"></div>
                    <div
                        className="absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-transparent border-b-white z-10"></div>
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            onClick={() => {
                                item.onClick();
                                setIsOpen(false); // auto close on click
                            }}
                            testId={item.id}
                            color={item.color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
