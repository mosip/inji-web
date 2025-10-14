import React from "react";
import {renderGradientText} from "../../../utils/builder";

const GRADIENT_BORDER_CLASSES = 
    "relative p-[2px] rounded-lg overflow-hidden bg-gradient-to-r from-[#FF5300] to-[#5B03AD]";

type SecondaryBorderedButtonProps = {
    onClick: (() => void) | undefined;
    title: string;
    testId: string;
    fullWidth?: boolean;
    className?: string;
    disabled?: boolean;
};

export const SecondaryBorderedButton: React.FC<SecondaryBorderedButtonProps> = ({
    onClick,
    title,
    testId,
    fullWidth,
    className = '',
    disabled = false
}) => {
    return (
        // --- FIX APPLIED HERE ---
        // Apply fullWidth logic AND the GRADIENT_BORDER_CLASSES to the outer div
        <div 
            className={`${fullWidth ? "w-full" : "w-auto"} ${GRADIENT_BORDER_CLASSES}`}
        >
            <button
                type="button"
                data-testid={`btn-${testId}`}
                onClick={onClick}
                disabled={disabled}
                // The inner button must also fill the space to push the gradient to the edges
                className={`
                    block h-full w-full 
                    bg-white py-2.5 px-4 rounded-lg
                    font-medium transition-all duration-200 
                    hover:bg-gray-50 
                    ${className}
                `}
            >
                {(renderGradientText(title))}
            </button>
        </div>
        // --- END FIX ---
    );
};