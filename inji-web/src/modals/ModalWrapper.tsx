import React from "react";

export const ModalWrapper:React.FC<ModalWrapperType> = (props) => {

    return <>
        <div className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 ${props.zIndex == 50 ? 'z-50': 'z-40'} outline-none focus:outline-none`}>
            <div className={`relative w-auto my-6 mx-auto ${props.size === '3xl' ? 'max-w-3xl' : 'max-w-sm'}`}>
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-iw-background outline-none focus:outline-none">
                    {props.header}
                    {props.content}
                    {props.footer}
                </div>
            </div>
        </div>
        <div className={`opacity-25 fixed inset-0 ${props.zIndex == 50 ? 'z-40': 'z-30'} bg-iw-backDrop`}></div>
    </>
}

export type ModalWrapperType = {
    header: React.ReactNode;
    content: React.ReactNode;
    footer: React.ReactNode;
    zIndex: number;
    size: string;
}
