import React from "react";
import {renderGradientText} from "../../../utils/builder";

export const PlainButton:React.FC<PlainButtonProps> = (props) => {
    const isGradient = !props.disableGradient;

    return <div className={props.fullWidth ? "w-full" : "w-4/5"}>
        <div className={"rounded-lg text-center cursor-pointer"} onClick={props.onClick}>
            <div className={`py-2 px-2 font-bold bg-white ${
                    isGradient
                        ? "hover:bg-none hover:bg-[#FFF2F2] hover:text-[#E64E4E]"
                        : ""
                }`}>
                <button
                    data-testid={props.testId}
                    className="font-bold">
                    {props.disableGradient ? props.title : renderGradientText(props.title)}
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
    disableGradient?: boolean; 
    className?: string; 
}
