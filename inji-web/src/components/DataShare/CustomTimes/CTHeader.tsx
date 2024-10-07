import React from "react";

export const CTHeader:React.FC<CTHeaderType> = (props) => {
    return <div className="flex items-start justify-between p-5 rounded-t text-center" data-testid={"CTHeader-Outer-Container"}>
        <div className="text-lg font-semibold"  data-testid={"CTHeader-Title-Content"}>{props.title} </div>
    </div>;
}

export type CTHeaderType = {
    title: string;
}
