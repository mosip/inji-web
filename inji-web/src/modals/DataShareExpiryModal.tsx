import React, {useState} from "react";
import {ModalWrapper} from "./ModalWrapper";
import {DSHeader} from "../components/DataShare/DSHeader";
import {DSFooter} from "../components/DataShare/DSFooter";
import {DSContent} from "../components/DataShare/DSContent";
import {CustomExpiryModal} from "./CustomExpiryModal";
import {useTranslation} from "react-i18next";

export const DataShareExpiryModal: React.FC<DataShareExpiryModalType> = (props) => {

    const [custom, setCustom] = useState<boolean>(false);
    const {t} = useTranslation("DataShareExpiryModal")
    return <React.Fragment>
            <ModalWrapper header={<DSHeader title={t("title")} subTitle={t("subTitle", {credentialName: props.credentialName})}/>}
                       content={<DSContent credentialName={props.credentialName} credentialLogo={props.credentialLogo} setCustom={setCustom}/>}
                       footer={<DSFooter cancel={t("cancel")} success={t("success")} onSuccess={props.onSuccess} onCancel={props.onCancel}/>}
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
