import React, {useState} from "react";
import {ModalWrapper} from "./ModalWrapper";
import {DataShareFooter} from "../components/DataShare/DataShareFooter";
import {CustomExpiryTimesContent} from "../components/DataShare/CustomExpiryTimes/CustomExpiryTimesContent";
import {CustomExpiryTimesHeader} from "../components/DataShare/CustomExpiryTimes/CustomExpiryTimesHeader";
import {useDispatch, useSelector} from "react-redux";
import {storevcStorageExpiryLimitInTimes} from "../redux/reducers/commonReducer";
import {RootState} from "../types/redux";
import {useTranslation} from "react-i18next";
import {CustomExpiryModalProps} from "../types/components";


export const CustomExpiryModal: React.FC<CustomExpiryModalProps> = (props) => {

    const vcStorageExpiryLimitInTimes = useSelector((state: RootState) => state.common.vcStorageExpiryLimitInTimes);
    const [expiryTime, setExpiryTime] = useState<number>(vcStorageExpiryLimitInTimes);
    const {t} = useTranslation("CustomExpiryModal");
    const dispatch = useDispatch();
    return <ModalWrapper header={<CustomExpiryTimesHeader title={t("title")}/>}
                         content={<CustomExpiryTimesContent expiryTime={expiryTime} setExpiryTime={setExpiryTime}/>}
                         footer={<DataShareFooter successText={t("success")} cancelText={t("cancel")} onSuccess={() => {dispatch(storevcStorageExpiryLimitInTimes(expiryTime));props.onSuccess()} } onCancel={props.onCancel}/>}
                         size={"sm"}
                         zIndex={50} />
}

