import React, {useState} from "react";
import {ModalWrapper} from "./ModalWrapper";
import {DSFooter} from "../components/DataShare/DSFooter";
import {CTContent} from "../components/DataShare/CustomTimes/CTContent";
import {CTHeader} from "../components/DataShare/CustomTimes/CTHeader";
import {useDispatch, useSelector} from "react-redux";
import {storeVCExpiryTimes} from "../redux/reducers/commonReducer";
import {RootState} from "../types/redux";
import {useTranslation} from "react-i18next";


export const CustomExpiryModal: React.FC<CustomExpiryModalType> = (props) => {

    const vcExpiryTimes = useSelector((state: RootState) => state.common.vcExpiryTimes);
    const [expiryTime, setExpiryTime] = useState<number>(vcExpiryTimes);
    const {t} = useTranslation("CustomExpiryModal");
    const dispatch = useDispatch();
    return <ModalWrapper header={<CTHeader title={t("title")}/>}
                         content={<CTContent expiryTime={expiryTime} setExpiryTime={setExpiryTime}/>}
                         footer={<DSFooter success={t("success")} cancel={t("cancel")} onSuccess={() => {dispatch(storeVCExpiryTimes(expiryTime));props.onSuccess()} } onCancel={props.onCancel}/>}
                         size={"sm"}
                         zIndex={50} />
}

export type CustomExpiryModalType = {
    onCancel: () => void;
    onSuccess: () => void;
}
