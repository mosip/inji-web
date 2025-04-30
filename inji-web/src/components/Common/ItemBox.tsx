import React from "react";
import {ItemBoxProps} from "../../types/components";

export const ItemBox: React.FC<ItemBoxProps> = (props) => {
    return <React.Fragment>
        <div key={props.index}
             data-testid={`ItemBox-Outer-Container-${props.index}`}
             className={`bg-white w-full h-48 flex flex-col shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-5 rounded-lg cursor-pointer items-center justify-center`}
             onClick={props.onClick}
             onKeyUp={props.onClick}
             tabIndex={0}
             role="menuitem">
            <img data-testid="ItemBox-Logo" src={props.url} alt="Issuer Logo"
                 className="w-20 h-20 object-contain mb-4"/>
            <div className={"flex justify-center items-center"}>
                <h3 className="text-sm font-semibold text-gray-800 text-center"
                    data-testid="ItemBox-Text">{props.title}</h3>
            </div>
        </div>
    </React.Fragment>
}
