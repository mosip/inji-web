import React from "react";
import {DSDisclaimerProps} from "../../types/components";

export const DataShareDisclaimer:React.FC<DSDisclaimerProps> = (props) => {
    return <div className={"flex w-full p-2 rounded-lg border-2 border-iw-shieldLoadingShadow bg-iw-disclaimerBackGround my-8"} data-testid={"DataShareDisclaimer-Outer-Container"}>
        <div className={"px-4 text-center text-iw-disclaimerText text-xs"} data-testid={"DataShareDisclaimer-Content"}>{props.content}</div>
    </div>;
}

