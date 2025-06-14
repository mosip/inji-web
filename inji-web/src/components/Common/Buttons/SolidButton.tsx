import React from "react";

export const SolidButton: React.FC<SolidButtonProps> = (props) => {
    return <div className={props.fullWidth ? "w-full" : ""}>
        <div
            className={`w-full bg-iw-primary text-center cursor-pointer items-center text-iw-text font-bold text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg mr-1 ${props.disabled ? 'bg-gray-400 cursor-not-allowed' : ' bg-gradient-to-r from-iw-primary to-iw-secondary'} ${props.className || ''}`}
            onClick={!props.disabled ? props.onClick : undefined}>
            <button
                data-testid={props.testId}
                className="text-white font-bold rounded-lg"
                disabled={props.disabled}>
                <div className={"flex items-center justify-center gap-1.5"}>
                    {props.icon && <span>{props.icon}</span>}
                    <span>{props.title}</span>
                </div>
            </button>
        </div>
    </div>
}

export type SolidButtonProps = {
    fullWidth?: boolean | false;
    testId: string;
    onClick: () => void;
    title: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
}
