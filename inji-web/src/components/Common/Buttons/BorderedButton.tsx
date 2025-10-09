import React from "react";
import {renderGradientText} from "../../../utils/builder";
import {BorderedButtonStyles} from "./BorderedButtonStyles.ts";

export const BorderedButton:React.FC<BorderedButtonProps> = (props) => {
  return <div className={props.fullWidth ? "w-full" : ""}>
    <div className={"bg-gradient-to-r text-center cursor-pointer from-iw-primary to-iw-secondary p-0.5"} onClick={props.onClick}>
            <div className={`hover:bg-none hover:bg-[#FFF2F2] hover:text-[#E64E4E] py-1 px-2 bg-white justify-center center ${props.className}`}>
                <button
                    data-testid={props.testId}
                    className={`${BorderedButtonStyles.baseStyles } ${props.disabled ? BorderedButtonStyles.disabledClasses : ""}`}>
                    {renderGradientText(props.title)}
                </button>
            </div>
    </div>
  </div>
}

export type BorderedButtonProps = {
    fullWidth?: boolean | false;
    testId: string;
    onClick: (event: React.MouseEvent)=> void;
    title: string;
    className?: string;
    disabled?: boolean;
}
