import {SpinningLoader} from "../Common/SpinningLoader";
import React, {useEffect, useMemo, useRef, useState} from "react";

import {Document, Page, pdfjs} from "react-pdf";
import {pdfWorkerSource} from "../../utils/constants";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSource(pdfjs.version);

export function PDFViewer(props: Readonly<{ previewContent: Blob }>) {
    const blobUrl = useMemo(() => URL.createObjectURL(props.previewContent), [props.previewContent]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [numPages, setNumPages] = useState<number>(0);
    // Padding to account for any margins or borders in the container
    const containerPadding = 22;

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width - containerPadding);
            }
        });
        observer.observe(containerRef.current);
        return () => {
            // cleanup the observer and URL
            observer.disconnect();
            URL.revokeObjectURL(blobUrl);
        }
    }, []);

    function onDocumentLoadSuccess({numPages}: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div
            ref={containerRef}
            className="w-full max-h-screen overflow-auto"
            style={{position: 'relative'}}
        >
            <Document
                file={blobUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                renderMode="canvas"
                loading={<SpinningLoader/>}
            >
                {Array.from({length: numPages}, (_, i) => (
                    <Page
                        key={i + 1}
                        pageNumber={i + 1}
                        width={containerWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                ))}
            </Document>
        </div>
    );
}