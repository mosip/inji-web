import React, {useState} from 'react';
import {SolidButton} from "./SolidButton";

interface ResponsiveIconButtonWithTextProps {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    testId: string;
}

/**
 * On small screens:
 * [ICON] [TEXT]
 * On large screens:
 * [Separate TEXT Button on the left of it, visible on hover] [Gradient ICON BUTTON]
 */
export const ResponsiveIconButtonWithText: React.FC<ResponsiveIconButtonWithTextProps> = ({
                                                                                              icon,
                                                                                              text,
                                                                                              onClick,
                                                                                              testId
                                                                                          }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex items-center space-x-2 w-full"
        >
            {/* Small screens: icon + text */}
            <SolidButton className={"sm:hidden"} testId={"btn-download"} onClick={onClick} title={text} icon={icon}
                         fullWidth/>

            {/* Large screens: icon button + text as separate element */}
            <div className="hidden sm:flex items-center space-x-2">
                {isHovered && (
                    <SolidButton testId={"btn-download"} onClick={onClick} title={text}/>
                )}

                <div
                    className="rounded-xl bg-gradient-to-r from-iw-primary to-iw-secondary p-[2px] transition-all duration-200 ease-in-out">
                    <button
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl shadow border-none bg-[#FBF2EF] transition-all duration-200 ease-in-out ${isHovered ? "bg-gradient-to-r from-iw-primary to-iw-secondary " : ""}`}
                        aria-label="Gradient Icon Button"
                        onClick={onClick}
                        data-testid={`btn-${testId}-icon`}
                        onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                event.stopPropagation()
                                onClick();
                            }
                        }}
                    >
                        {icon}
                    </button>
                </div>

            </div>
        </div>
    );
};
