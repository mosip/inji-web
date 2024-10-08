import React from "react";

export const CustomExpiryTimesHeader:React.FC<CTHeaderType> = (props) => {
    return <div className="flex items-start justify-between p-5 rounded-t text-center" data-testid={"CustomExpiryTimesHeader-Outer-Container"}>
        <div className="text-lg font-semibold"  data-testid={"CustomExpiryTimesHeader-Title-Content"}>{props.title} </div>
    </div>;
}

export type CTHeaderType = {
    title: string;
}
