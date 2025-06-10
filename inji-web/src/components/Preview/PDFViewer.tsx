import {SpecialZoomLevel, Viewer, Worker} from "@react-pdf-viewer/core";
import {SpinningLoader} from "../Common/SpinningLoader";
import React from "react";

export function PDFViewer(props: { previewContent: string }) {
    return (
        <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
            <Viewer fileUrl={props.previewContent} renderLoader={(_) => <SpinningLoader/>}
                    defaultScale={SpecialZoomLevel.PageWidth}
                    enableSmoothScroll/>
        </Worker>
    )
}