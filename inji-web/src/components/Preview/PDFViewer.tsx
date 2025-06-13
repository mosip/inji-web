import {SpecialZoomLevel, Viewer, Worker} from "@react-pdf-viewer/core";
import {SpinningLoader} from "../Common/SpinningLoader";
import React from "react";
import {PDF_WORKER_URL} from "../../utils/constants";

export function PDFViewer(props: Readonly<{ previewContent: string }>) {
    return (
        <Worker
            workerUrl={PDF_WORKER_URL}
        >
            <Viewer fileUrl={props.previewContent} renderLoader={(_) => <SpinningLoader/>}
                    defaultScale={SpecialZoomLevel.PageWidth}
                    enableSmoothScroll/>
        </Worker>
    )
}