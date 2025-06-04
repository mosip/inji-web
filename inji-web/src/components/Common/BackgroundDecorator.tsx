import React from 'react';

interface BackgroundDecoratorProps {
    circleCount?: number;
    topOffset?: number;
    baseRadius?: number;
    logoSrc: string;
    logoAlt?: string;
    testId?: string;
    logoTestId: string;
}

export const BackgroundDecorator: React.FC<BackgroundDecoratorProps> = ({
    circleCount = 6,
    topOffset = 155,
    baseRadius = 96,
    logoSrc,
    logoAlt = 'Logo',
    testId = 'background-decorator',
    logoTestId
}) => {
    return (
        <div
            className="overflow-hidden absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            data-testid={testId}
        >
            <div
                className={`absolute top-[${topOffset}px]`}
                style={{top: `${topOffset}px`}}
            >
                {[...Array(circleCount)].map((_, index) => {
                    const radius = baseRadius + index * baseRadius;
                    const opacity = 0.8 - index * 0.1;
                    return (
                        <div
                            key={index}
                            className="absolute rounded-full border overflow-hidden"
                            style={{
                                width: `${radius}px`,
                                height: `${radius}px`,
                                borderWidth: '1px',
                                borderColor: `rgba(228, 231, 236, ${opacity})`,
                                top: `calc(50% - ${radius / 2}px)`,
                                left: `calc(50% - ${radius / 2}px)`
                            }}
                            data-testid={`${testId}-circle-${index}`}
                        />
                    );
                })}

                <div
                    className="flex items-center justify-center"
                    data-testid={`${logoTestId}-container`}
                >
                    <img src={logoSrc} alt={logoAlt} data-testid={logoTestId} />
                </div>
            </div>
        </div>
    );
};
