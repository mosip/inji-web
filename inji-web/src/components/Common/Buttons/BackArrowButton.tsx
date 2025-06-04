import React from 'react';
import BackArrowIcon from '../../../assets/BackArrowIcon.svg';

interface BackArrowButtonProps {
    onClick: () => void;
    btnClassName?: string;
    iconClassName?: string;
    btnTestId?: string;
    iconTestId?: string;
    alt?: string;
}

export const BackArrowButton: React.FC<BackArrowButtonProps> = ({
    onClick,
    btnClassName = '',
    iconClassName = '',
    btnTestId = 'btn-back-arrow-container',
    iconTestId = 'icon-back-arrow',
    alt = 'Back Arrow'
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            data-testid={btnTestId}
            className={btnClassName}
        >
            <img
                data-testid={iconTestId}
                src={BackArrowIcon}
                alt={alt}
                className={iconClassName}
            />
        </button>
    );
};
