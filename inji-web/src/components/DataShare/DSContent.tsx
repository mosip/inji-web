import React, {useState} from "react";
import {MdOutlineKeyboardArrowDown} from "react-icons/md";
import {DSDisclaimer} from "./DSDisclaimer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {storeVCExpiryTimes} from "../../redux/reducers/commonReducer";
import {useTranslation} from "react-i18next";

export const DSContent:React.FC<DSContentType> = (props) => {

    const [timesDropDown, setTimesDropDown] = useState<boolean>(false);
    const vcExpiryTimes = useSelector((state: RootState) => state.common.vcExpiryTimes);
    const dispatch = useDispatch();
    const {t} = useTranslation("DataShareExpiryModal");


    const getExpiryDisplayName = (expiry: number) => {
        let expiryDisplayName = expiry.toString();
        switch(expiry){
            case 1:
                expiryDisplayName = t("content.validityTimesOptions.once");
                break;
            case 3:
                expiryDisplayName = t("content.validityTimesOptions.thrice");
                break;
            case -1:
                expiryDisplayName = t("content.validityTimesOptions.noLimit");
                break;
        }
        return expiryDisplayName;
    }


    return <div className="relative px-6 flex flex-col justify-between border-b border-solid border-iw-borderLight" data-testid={"DSContent-Outer-Container"}>
        <div className="relative flex border-b-2">
            <div className="my-4 text-iw-subTitle text-lg w-1/3 leading-relaxed py-5" data-testid={"DSContent-Outer-Title"}>{t("content.selectedDocument")}</div>
            <div className={"my-4 text-center shadow-md rounded-lg w-2/3 flex flex-row py-5 items-center"}>
                <div className={"px-6"} data-testid={"DSContent-Issuer-Logo-Container"}>
                    <img data-testid={"DSContent-Issuer-Logo"} src={props.credentialLogo} alt="Issuer Logo"
                         className="w-12 h-12 flex"/>
                </div>
                <div className="text-center text-lg" data-testid={"DSContent-Issuer-Name"}>{props.credentialName}</div>
            </div>
        </div>
        <div className="relative flex">
            <div className="my-4 w-1/3 text-iw-subTitle text-lg leading-relaxed py-5" data-testid={"DSContent-Consent-Container"}>{t("content.consent")}</div>
            <div className={"my-4 w-2/3 flex flex-row py-5 items-center"}>
                <label className="w-1/2 flex items-center space-x-2">
                    <input
                        type="radio"
                        name="consentValidity"
                        value="number"
                        checked={true}
                        data-testid={"DSContent-Consent-Radio"}
                        className="accent-iw-primary scale-150"
                    />
                    <span className="font-base text-iw-subTitle" data-testid={"DSContent-Consent-Option"}>{t("content.validityTimesHeader")}</span>
                </label>

                <label className="w-1/2 flex items-center space-x-2" data-testid={"DSContent-Validity-Date"}>
                    <input
                        type="radio"
                        name="consentValidity"
                        value="date"
                        disabled={true}
                        className="accent-iw-primary scale-150"
                    />
                    <span className="font-light text-iw-subTitle" data-testid={"DSContent-Validity-Date-Title"}>{t("content.validityDate")}</span>
                </label>
            </div>
        </div>
        <div className="relative flex mb-4" onClick={()=>setTimesDropDown(times => !times)}>
            <div className={"w-1/3"}></div>
            <div className={"w-2/3 py-4 px-4 rounded-lg border-2 border-iw-borderLight flex flex-row items-center"}>
                <label className={"w-full h-full"} data-testId={"DSContent-Selected-Validity-Times"}>{getExpiryDisplayName(vcExpiryTimes)}</label>
                <MdOutlineKeyboardArrowDown size={30} color={'var(--iw-color-arrowDown)'} />
            </div>
        </div>

        {timesDropDown && <div className="relative flex mb-4">
            <div className={"w-1/3"}></div>
            <div
                className={"w-2/3 py-4 px-2 border-2 border-iw-borderLight rounded-lg shadow-lg shadow-iw-shadow flex flex-col justify-center items-center"} data-testid={"DSContent-Validity-Times-DropDown"}>
                <label data-testid={"DSContent-Validity-Times-DropDown-Once"} onClick={()=>{dispatch(storeVCExpiryTimes(1)); setTimesDropDown(false)} } className={"w-full h-full py-3 px-4 hover:bg-iw-borderLight hover:rounded-lg"}>{t("content.validityTimesOptions.once")}</label>
                <label data-testid={"DSContent-Validity-Times-DropDown-Thrice"} onClick={()=>{dispatch(storeVCExpiryTimes(3)); setTimesDropDown(false)} } className={"w-full h-full py-3 px-4 hover:bg-iw-borderLight hover:rounded-lg"}>{t("content.validityTimesOptions.thrice")}</label>
                <label data-testid={"DSContent-Validity-Times-DropDown-NoLimit"} onClick={()=>{dispatch(storeVCExpiryTimes(-1)); setTimesDropDown(false)} } className={"w-full h-full py-3 px-4 hover:bg-iw-borderLight hover:rounded-lg"}>{t("content.validityTimesOptions.noLimit")}</label>
                <label data-testid={"DSContent-Validity-Times-DropDown-Custom"} onClick={()=>{setTimesDropDown(false); props.setCustom(true)} }
                       className={"w-full h-full py-3 px-4 hover:bg-iw-borderLight hover:rounded-lg"}>{t("content.validityTimesOptions.custom")}</label>
            </div>
        </div>}
        <DSDisclaimer content={t("disclaimer")}/>
    </div>;
}

export type DSContentType = {
    credentialName: string;
    credentialLogo: string;
    setCustom: (custom: boolean) => void;
}
