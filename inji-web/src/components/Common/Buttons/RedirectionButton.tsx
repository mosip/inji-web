import React from "react";
import ArrowNarrowLeftIcon from "../../../assets/ArrowNarrowLeft.svg";

interface RedirectionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    testId?: string;
}

export const RedirectionButton: React.FC<RedirectionButtonProps> = ({
                                                                        onClick,
                                                                        children,
                                                                        testId
                                                                    }) => {
    return (
        <button
            id={testId}
            onClick={onClick}
            style={{
                backgroundColor: "var(--iw-color-paleViolet)",
                color: "var(--iw-color-deepVioletIndigo)",
                borderColor: "var(--iw-color-deepVioletIndigo)",
            }}
            className="w-full sm:w-[425px] h-[63px] rounded border-2 font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
            <img
                src={ArrowNarrowLeftIcon}
                alt="Back"
                className="w-6 h-6"
            />
            <span className="text-center">{children}</span>
        </button>
    );
};
