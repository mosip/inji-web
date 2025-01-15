import React, {useState} from "react";
import {ModalWrapper} from "./ModalWrapper";
import {DataShareHeader} from "../components/DataShare/DataShareHeader";
import {DataShareFooter} from "../components/DataShare/DataShareFooter";
import {DataShareContent} from "../components/DataShare/DataShareContent";
import {CustomExpiryModal} from "./CustomExpiryModal";
import {useTranslation} from "react-i18next";
import {DataShareExpiryModalProps} from "../types/components";

export const DataShareExpiryModal: React.FC<DataShareExpiryModalProps> = (props) => {

    const [isCustomExpiryInTimesModalOpen, setIsCustomExpiryInTimesModalOpen] = useState<boolean>(false);
    const {t} = useTranslation("DataShareExpiryModal")
    return <React.Fragment>
            <ModalWrapper header={<DataShareHeader title={t("title")} subTitle={t("subTitle", {credentialName: props.credentialName})}/>}
                       content={<DataShareContent credentialName={props.credentialName} credentialLogo={props.credentialLogo} setIsCustomExpiryInTimesModalOpen={setIsCustomExpiryInTimesModalOpen}/>}
                       footer={<DataShareFooter parent = "data-share-expiry-modal" cancelText={t("cancel")} successText={t("success")} onSuccess={props.onSuccess} onCancel={props.onCancel}/>}
                       size={"3xl"}
                       zIndex={40}/>
            {isCustomExpiryInTimesModalOpen && <CustomExpiryModal onSuccess={() => setIsCustomExpiryInTimesModalOpen(false)} onCancel={() => setIsCustomExpiryInTimesModalOpen(false)}/>}
        </React.Fragment>

}

