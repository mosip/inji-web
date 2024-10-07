import React from "react";

export const DSFooter:React.FC<DSFooterType> = (props) => {
    return <div className="flex items-center justify-between p-6 rounded-b"  data-testid={"DSFooter-Outer-Container"}>
        <button
            className="w-1/2 text-iw-primary font-bold px-6 mr-2 border-2 border-iw-primary py-2 text-sm outline-1 shadow hover:shadow-lg focus:outline-none ease-linear rounded-lg transition-all duration-150"
            type="button"
            data-testid={"DSFooter-Cancel-Button"}
            onClick={props.onCancel}> {props.cancel} </button>
        <button
            className="w-1/2 bg-iw-primary text-center items-center text-iw-text ml-2 font-bold text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            data-testid={"DSFooter-Success-Button"}
            onClick={props.onSuccess}> {props.success} </button>
    </div>;
}

export type DSFooterType = {
    success: string;
    onSuccess: () => void;
    cancel: string;
    onCancel: () => void;
}


