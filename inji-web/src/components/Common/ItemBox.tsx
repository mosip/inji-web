import React from "react";
import {ItemBoxProps} from "../../types/components";

export const ItemBox: React.FC<ItemBoxProps> = (props) => {
    return <React.Fragment>
        <div key={props.index}
             data-testid={`ItemBox-Outer-Container-${props.index}`}
             className="bg-iw-tileBackground shadow flex flex-row shadow-iw-shadow p-4 rounded-md cursor-pointer items-center"
             onClick={props.onClick}>
            <img data-testid="ItemBox-Logo" src={props.url} alt="Issuer Logo"
                 className="w-30 h-10 justify-center me-4"/>
            <div className={"justify-center items-center"}>
                <h3 className="text-lg font-semibold text-iw-title"
                    data-testid="ItemBox-Text">{props.title}</h3>
                {props.description && <p className="text-iw-title">{props.description}</p>}
            </div>
        </div>
    </React.Fragment>
}
