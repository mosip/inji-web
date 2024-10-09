import React from "react";
import {ItemBoxProps} from "../../types/components";

export const ItemBox: React.FC<ItemBoxProps> = (props) => {
    return <React.Fragment>
        <div key={props.index}
             data-testid={`ItemBox-Outer-Container-${props.index}`}
             className={`bg-iw-tileBackground w-48 h-48 flex flex-col shadow hover:shadow-lg hover:scale-110 hover:shadow-iw-selectedShadow p-5 m-4 rounded-md cursor-pointer items-center`}
             onClick={props.onClick}
             onKeyUp={props.onClick}
             tabIndex={0}
             role="menuitem">
            <img data-testid="ItemBox-Logo" src={props.url} alt="Issuer Logo"
                 className="w-20 h-20 items-center justify-center me-4 flex"/>
            <div className={"flex justify-center items-center pt-4"}>
                <h3 className="flex text-sm font-semibold text-iw-title text-center"
                    data-testid="ItemBox-Text">{props.title}</h3>
            </div>
        </div>
    </React.Fragment>
}
