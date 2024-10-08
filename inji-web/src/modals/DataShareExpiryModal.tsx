import React, {useState} from "react";
import {ModalWrapper} from "./ModalWrapper";
import {DataShareHeader} from "../components/DataShare/DataShareHeader";
import {DataShareFooter} from "../components/DataShare/DataShareFooter";
import {DataShareContent} from "../components/DataShare/DataShareContent";
import {CustomExpiryModal} from "./CustomExpiryModal";
import {useTranslation} from "react-i18next";

export const DataShareExpiryModal: React.FC<DataShareExpiryModalType> = (props) => {

    const [custom, setCustom] = useState<boolean>(false);
    const {t} = useTranslation("DataShareExpiryModal")
    return <React.Fragment>
            <ModalWrapper header={<DataShareHeader title={t("title")} subTitle={t("subTitle", {credentialName: props.credentialName})}/>}
                       content={<DataShareContent credentialName={props.credentialName} credentialLogo={props.credentialLogo} setCustom={setCustom}/>}
                       footer={<DataShareFooter cancel={t("cancel")} success={t("success")} onSuccess={props.onSuccess} onCancel={props.onCancel}/>}
                       size={"3xl"}
                       zIndex={40}/>
            {custom && <CustomExpiryModal onSuccess={() => setCustom(false)} onCancel={() => setCustom(false)}/>}
        </React.Fragment>

}

export type DataShareExpiryModalType = {
    credentialName: string;
    credentialLogo: string;
    onSuccess: () => void;
    onCancel: () => void;
}
