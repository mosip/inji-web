import React from 'react';

interface CrossIconButtonProps {
    onClick: () => void;
    btnClassName?: string;
    iconClassName?: string;
    btnTestId?: string;
    iconTestId?: string;
}

export const CrossIconButton: React.FC<CrossIconButtonProps> = ({
                                                                    onClick,
                                                                    btnClassName = '',
                                                                    iconClassName = '',
                                                                    btnTestId = 'btn-close-icon-container',
                                                                    iconTestId = 'icon-close'
                                                                }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            data-testid={btnTestId}
            className={btnClassName}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className={iconClassName}
                data-testid={iconTestId}
            >
                <path
                    fill-rule="evenodd"
                    d="M6.2 6.2a1 1 0 011.4 0L12 10.6l4.4-4.4a1 1 0 111.4 1.4L13.4 12l4.4 4.4a1 1 0 01-1.4 1.4L12 13.4l-4.4 4.4a1 1 0 11-1.4-1.4L10.6 12 6.2 7.6a1 1 0 010-1.4z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>
    );
};
