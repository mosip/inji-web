import React from "react";
import {DSHeaderProps} from "../../types/components";

export const DataShareHeader:React.FC<DSHeaderProps> = (props) => {
    return <div className="flex items-start justify-between p-5 border-b border-solid rounded-t" data-testid={"DataShareHeader-Outer-Container"}>
        <div className="flex flex-col">
            <div className="text-lg font-semibold"  data-testid={"DataShareHeader-Header-Title"}> {props.title}</div>
            <div className="text-md text-iw-subTitle"  data-testid={"DataShareHeader-Header-SubTitle"}> {props.subTitle} </div>
        </div>
    </div>;
}

