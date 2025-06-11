import React from "react";
import {renderGradientText} from "../../../utils/builder";

export const BorderedButton:React.FC<BorderedButtonProps> = (props) => {
  return <div className={props.fullWidth ? "w-full" : ""}>
    <div className={"bg-gradient-to-r rounded-lg text-center cursor-pointer shadow hover:shadow-lg from-iw-primary to-iw-secondary p-0.5"} onClick={props.onClick}>
            <div className={`py-1 px-2 rounded-lg bg-white justify-center center ${props.className}`}>
                <button
                    data-testid={props.testId}
                    className="text-iw-tertiary font-bold rounded-lg">
                    {props.title && renderGradientText(props.title)}
                </button>
            </div>
    </div>
  </div>
}

export type BorderedButtonProps = {
    fullWidth?: boolean | false;
    testId: string;
    onClick: (event: React.MouseEvent)=> void;
    title?: string;
    className?: string;
}
