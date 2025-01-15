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
import {toast} from "react-toastify";

export const CustomExpiryModal: React.FC<CustomExpiryModalProps> = (props) => {
    const vcStorageExpiryLimitInTimes = useSelector(
        (state: RootState) => state.common.vcStorageExpiryLimitInTimes
    );
    const [expiryTime, setExpiryTime] = useState<number>(
        vcStorageExpiryLimitInTimes > 1 ? vcStorageExpiryLimitInTimes : 1
    );
    const {t} = useTranslation("CustomExpiryModal");
    const dispatch = useDispatch();

    const onSuccess = () => {
        if (expiryTime < 1 || expiryTime > 50) {
            toast.error(t("error"));
        } else {
            dispatch(storevcStorageExpiryLimitInTimes(expiryTime));
            props.onSuccess();
        }
    };

    return (
        <ModalWrapper
            header={<CustomExpiryTimesHeader title={t("title")} />}
            content={
                <CustomExpiryTimesContent
                    expiryTime={expiryTime}
                    setExpiryTime={setExpiryTime}
                />
            }
            footer={
                <DataShareFooter
                    parent="custom-expiry-modal"
                    successText={t("success")}
                    cancelText={t("cancel")}
                    onSuccess={onSuccess}
                    onCancel={props.onCancel}
                />
            }
            size={"sm"}
            zIndex={50}
        />
    );
};
