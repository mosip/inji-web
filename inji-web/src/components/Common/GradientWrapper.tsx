import React from "react";
import { generateRandomString } from "../../utils/misc";

export const GradientWrapper: React.FC<BackGroundImageProps> = ({children}) => {
    const uniqueId = `blue-gradient-${
        generateRandomString(7,'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
    }`;
    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, {style: { fill: `url(#${uniqueId})`,}});
        }
        return child;
    });

    return <React.Fragment>
        <svg width="0" height="0">
                <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="var(--iw-color-primary)" offset="0%" />
                    <stop stopColor="var(--iw-color-secondary)" offset="100%" />
                </linearGradient>
        </svg>
        {childrenWithProps}
    </React.Fragment>
};

export type BackGroundImageProps = {
    children: React.ReactNode;
}