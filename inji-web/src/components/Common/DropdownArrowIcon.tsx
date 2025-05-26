import React from 'react';
import {RiArrowUpSFill, RiArrowDownSFill} from 'react-icons/ri';
import { DropdownArrowIconProps } from '../../types/data';
import { GradientWrapper } from './GradientWrapper';

const DropdownArrowIcon: React.FC<DropdownArrowIconProps> = ({isOpen, size = 20, color = 'var(--iw-color-languageArrowIcon)'}) => {
    const ArrowIcon = isOpen ? RiArrowUpSFill : RiArrowDownSFill;

    return (
        <GradientWrapper>
            <ArrowIcon size={size} color={color} />
        </GradientWrapper>
    );
};

export default DropdownArrowIcon;
