import {WalletCredential} from "../../types/data";
import {Modal} from "../../modals/Modal";
import {SolidButton} from "../Common/Buttons/SolidButton";
import {PDFViewer} from "../Preview/PDFViewer";
import React from "react";

export function VCDetailView(props: {
    previewContent: string,
    onClose: () => void,
    onDownload: () => Promise<void>,
    credential: WalletCredential
}) {
    return <Modal isOpen={!!props.previewContent}
                  onClose={props.onClose}
                  action={<SolidButton testId={"btn-download"} title={"download"} onClick={props.onDownload}/>}
                  title={props.credential.credentialTypeDisplayName}
    >
        <PDFViewer
            previewContent={props.previewContent}
        />
    </Modal>;
}