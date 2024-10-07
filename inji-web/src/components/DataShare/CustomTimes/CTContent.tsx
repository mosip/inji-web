import React from "react";
import {RiArrowDownSLine, RiArrowUpSLine} from "react-icons/ri";
import {useTranslation} from "react-i18next";

export const CTContent:React.FC<CTContentType>= (props) => {

    const {t} = useTranslation("CustomExpiryModal");
    return <div className="relative px-6 mx-4 flex flex-col justify-between" data-testid={"CTContent-Outer-Container"}>
        <div className={"border-2 rounded-lg flex flex-row justify-between"}>
            <div className={"flex flex-col px-2"}  data-testid={"CTContent-Times-Range-Container"}>
                <button onClick={() => props.setExpiryTime(props.expiryTime + 1)} data-testid={"CTContent-Times-Range-Increase"}>
                    <RiArrowUpSLine size={20} color={'var(--iw-color-arrowDown)'}/>
                </button>
                <button onClick={() => props.expiryTime > 1 && props.setExpiryTime(props.expiryTime - 1)} data-testid={"CTContent-Times-Range-Decrease"}>
                    <RiArrowDownSLine size={20} color={'var(--iw-color-arrowDown)'} />
                </button>
            </div>
            <div className={"px-2 flex w-full"}><input type={"text"} min={0} value={props.expiryTime} onChange={event => {props.setExpiryTime(isNaN(parseInt(event.target.value)) ? 0 : parseInt(event.target.value)); }} className={"appearance-none w-full p-2 focus:outline-none no-spinner"} placeholder={"Enter Number here"} data-testid={"CTContent-Times-Value"}/></div>
            <div className={"px-2 flex items-center justify-center bg-iw-borderLight text-iw-subText"} data-testid={"CTContent-Times-Metrics"}>{t("metrics")}</div>
        </div>
    </div>;
}

export type CTContentType = {
    expiryTime: number;
    setExpiryTime: (expiry:number) => void;
}
