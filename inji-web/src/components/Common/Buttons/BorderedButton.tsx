import React from "react";
import {renderGradientText} from "../../../utils/builder";

export const BorderedButton:React.FC<BorderedButtonProps> = (props) => {
  return <div className={props.fullWidth ? "w-full" : ""}>
    <div className={"bg-gradient-to-r rounded-lg text-center cursor-pointer shadow hover:shadow-lg from-iw-primary to-iw-secondary p-0.5"} onClick={props.onClick}>
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

export type BorderedButtonProps = {
    fullWidth?: boolean | false;
    testId: string;
    onClick: ()=> void;
    title: string;
}
