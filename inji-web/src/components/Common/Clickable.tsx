import React from 'react';

export interface ClickableProps {
    onClick: () => void;
    children: React.ReactNode;
    testId: string;
    className?: string;
}

export const Clickable: React.FC<ClickableProps> = ({
                                                        onClick,
                                                        children,
                                                        testId,
                                                        className = '',
                                                    }) => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation()
            onClick();
        }
    };

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        onClick()
    };


    return (
        <div
            role="menuitem"
            tabIndex={0}
            className={className}
            onClick={handleClick}
            onKeyDown={handleKeyPress}
            data-testid={testId}
        >
            {children}
        </div>
    );
};
