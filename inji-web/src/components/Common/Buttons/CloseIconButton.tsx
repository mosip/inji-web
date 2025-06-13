import React from 'react';
import BackArrowIcon from '../../../assets/CloseIcon.svg';

interface CloseIconButtonProps {
    onClick: () => void;
    btnClassName?: string;
    iconClassName?: string;
    btnTestId?: string;
    iconTestId?: string;
    alt?: string;
}

export const CloseIconButton: React.FC<CloseIconButtonProps> = ({
    onClick,
    btnClassName = '',
    iconClassName = '',
    btnTestId = 'btn-close-container',
    iconTestId = 'icon-close',
    alt = "Close"
}) => {
    return (
        <button
            type="button"
            onClick={(e)=>{
                e.stopPropagation()
                onClick()
            }}
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
