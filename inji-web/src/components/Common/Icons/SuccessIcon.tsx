import React from 'react';
import SuccessMessageIcon from '../../../assets/SuccessMessageIcon.svg';

interface SuccessIconProps {
    className?: string;
    altText?: string;
}

export const SuccessIcon: React.FC<SuccessIconProps> = ({
                                                            className = "w-24 h-24 sm:w-[108px] sm:h-[108px]",
                                                            altText = "Success"
                                                        }) => {
    return (
        <img
            src={SuccessMessageIcon}
            alt={altText}
            className={className}
        />
    );
};