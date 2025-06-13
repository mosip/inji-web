import React from "react";
import {RxDotsHorizontal} from "react-icons/rx";
import {MenuItemType} from "../../../types/data";
import {Menu} from "./Menu";

interface EllipsisMenuProps {
    menuItems: MenuItemType[];
    testId: string;
}

export const EllipsisMenu = ({menuItems, testId}: EllipsisMenuProps) => {
    return (
        <Menu
            testId={testId}
            menuItems={menuItems}
            triggerComponent={
                <RxDotsHorizontal size={20} color={"#707070"} data-testid={"icon-three-dots-menu"}/>
            }
        />
    );
};