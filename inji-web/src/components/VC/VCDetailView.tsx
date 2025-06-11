import {WalletCredential} from "../../types/data";
import {Modal} from "../../modals/Modal";
import {PDFViewer} from "../Preview/PDFViewer";
import React from "react";
import {ResponsiveIconButtonWithText} from "../Common/Buttons/ResponsiveIconButtonWithText";
import {DownloadIcon} from "../Common/Icons/DownloadIcon";


export function VCDetailView(props: Readonly<{
    previewContent: string,
    onClose: () => void,
    onDownload: () => Promise<void>,
    credential: WalletCredential
}>) {
    return <Modal isOpen={!!props.previewContent}
                  onClose={props.onClose}
        // action={<SolidButton testId={"btn-download"} title={"download"} onClick={props.onDownload}/>}
                  action={<ResponsiveIconButtonWithText text={"Download"}
                                                        icon={<DownloadIcon
                                                            testId={"icon-download"}
                                                        />}
                      // className={"h-25 w-25 bg-gradient-to-r rounded-lg text-center cursor-pointer shadow hover:shadow-lg from-iw-primary to-iw-secondary p-0.5"}/>}
                                                        testId={"download"}
                                                        onClick={props.onDownload}
                  />}
                  title={props.credential.credentialTypeDisplayName}
    >
        <PDFViewer
            previewContent={props.previewContent}
        />
    </Modal>;
}