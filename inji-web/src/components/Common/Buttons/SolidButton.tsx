import React from "react";

export const SolidButton:React.FC<SolidButtonProps> = (props) => {
    return <div className={props.fullWidth ? "w-full" : ""}>
        <div className={"w-full bg-iw-primary text-center cursor-pointer items-center text-iw-text ml-2 font-bold text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg mr-1 bg-gradient-to-r from-iw-primary to-iw-secondary"} onClick={props.onClick}>
            <button
                data-testid={props.testId}
                className="text-white font-bold rounded-lg">
                {props.title}
            </button>
        </div>
    </div>
}

export type SolidButtonProps = {
    fullWidth?: boolean | false;
    testId: string;
    onClick: ()=> void;
    title: string;
}
