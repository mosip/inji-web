import React from "react";
import {renderGradientText} from "../../../utils/builder";

export const PlainButton:React.FC<PlainButtonProps> = (props) => {
    return <div className={props.fullWidth ? "w-full" : ""}>
        <div className={"rounded-lg text-center cursor-pointer shadow hover:shadow-lg p-0.5"} onClick={props.onClick}>
            <div className="py-2 px-4 rounded-lg bg-white">
                <button
                    data-testid={props.testId}
                    className="text-iw-tertiary font-bold rounded-lg">
                    {renderGradientText(props.title)}
                </button>
            </div>
        </div>
    </div>
}

export type PlainButtonProps = {
    fullWidth?: boolean | false;
    testId: string;
    onClick: ()=> void;
    title: string;
}
