import React from 'react';

export interface ClickableProps {
    onClick: () => void;
    children: React.ReactNode;
    testId: string;
    className: string;
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
            onClick();
        }
    };

    return (
        <div
            role="menuitem"
            tabIndex={0}
            className={className}
            onClick={onClick}
            onKeyDown={handleKeyPress}
            data-testid={testId}
        >
            {children}
        </div>
    );
};
