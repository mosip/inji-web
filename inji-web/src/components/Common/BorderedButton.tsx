import React from "react";

export const BorderedButton:React.FC<BorderedButtonProps> = (props) => {
  return <div className={"bg-gradient-to-r rounded-lg from-iw-primary to-iw-secondary p-0.5"}>
            <div className="py-2 px-4 rounded-lg bg-white">
                <button
                    data-testid={props.testId}
                    onClick={props.onClick}
                    className="text-iw-tertiary font-bold rounded-lg">
                    {props.title}
                </button>
            </div>
    </div>
}

export type BorderedButtonProps = {
    testId: string;
    onClick: ()=> void;
    title: string;
}
