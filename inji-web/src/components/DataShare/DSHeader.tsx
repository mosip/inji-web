import React from "react";

export const DSHeader:React.FC<DSHeaderType> = (props) => {
    return <div className="flex items-start justify-between p-5 border-b border-solid rounded-t" data-testid={"DSHeader-Outer-Container"}>
        <div className="flex flex-col">
            <div className="text-lg font-semibold"  data-testid={"DSHeader-Header-Title"}> {props.title}</div>
            <div className="text-md text-iw-subTitle"  data-testid={"DSHeader-Header-SubTitle"}> {props.subTitle} </div>
        </div>
    </div>;
}

export type DSHeaderType = {
    title: string;
    subTitle: string;
}
