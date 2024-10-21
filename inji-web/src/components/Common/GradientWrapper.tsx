import React from "react";

export const GradientWrapper:React.FC<BackGroundImageProps> = ({children}) => {

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, {style: { fill: 'url(#blue-gradient)'}});
        }
        return child;
    });

    return <React.Fragment>
        <svg width="0" height="0">
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="var(--iw-color-primary)" offset="0%" />
                <stop stopColor="var(--iw-color-secondary)" offset="100%" />
            </linearGradient>
        </svg>
        {childrenWithProps}
    </React.Fragment>
}

export type BackGroundImageProps = {
    children: React.ReactNode;
}
