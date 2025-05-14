import React from "react";
import {HeaderTileProps} from "../../types/components";

export const HeaderTile: React.FC<HeaderTileProps> = ({content, subContent}) => {
    return <React.Fragment>
        <div data-testid="HeaderTile-Text"
             className={"text-center font-bold text-iw-title mt-8 text-xl flex"}>{content}</div>
        <div data-testid="HeaderTile-Text-SubContent"
             className={"text-center text-iw-subTitle text-md mb-8 mt-2 flex"}>{subContent}</div>
    </React.Fragment>
}
