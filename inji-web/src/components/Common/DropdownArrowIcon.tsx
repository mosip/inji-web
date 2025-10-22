import React from 'react';
import {RiArrowUpSLine, RiArrowDownSLine} from 'react-icons/ri';

type DropdownArrowIconProps = {
    isOpen: boolean;
    size?: number;
    color?: string;
};

const DropdownArrowIcon: React.FC<DropdownArrowIconProps> = ({isOpen, size = 24, color = 'var(--iw-color-languageArrowIcon)'}) => {
    const ArrowIcon = isOpen ? RiArrowUpSLine : RiArrowDownSLine;

    return (
        <ArrowIcon size={size} color={color} />
    );
};

export default DropdownArrowIcon;
