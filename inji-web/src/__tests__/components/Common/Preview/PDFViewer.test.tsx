import React from 'react';
import {render, screen} from '@testing-library/react';
import {PDFViewer} from '../../../../components/Preview/PDFViewer';

jest.mock('react-pdf', () => {
    const React = require('react');

    return {
        pdfjs: {
            version: 'mock-version',
            GlobalWorkerOptions: {
                workerSrc: 'mock-worker.js',
            },
        },

        Document: ({
                       file,
                       onLoadSuccess,
                       onLoadError,
                       onLoadProgress,
                       renderMode,
                       loading,
                       children,
                   }: {
            file: any;
            onLoadSuccess?: (arg: { numPages: number }) => void;
            onLoadError?: (error: Error) => void;
            onLoadProgress?: (progress: any) => void;
            renderMode?: string;
            loading?: React.ReactNode;
            children: React.ReactNode;
        }) => {
            React.useEffect(() => {
                // simulate load success with 3 pages
                onLoadSuccess && onLoadSuccess({numPages: 3});
            }, []);
            return (
                <div data-testid="pdf-viewer" data-file={JSON.stringify(file)}>
                    {/*Render a mock loader to test the renderLoader prop*/}
                    {loading || <div data-testid="spinning-loader">Loading PDF...</div>}
                    {children}
                </div>
            );
        },

        Page: ({
                   pageNumber,
                   width,
                   height,
                   scale,
                   renderTextLayer,
                   renderAnnotationLayer,
               }: {
            pageNumber: number;
            width?: number;
            height?: number;
            scale?: number;
            renderTextLayer?: boolean;
            renderAnnotationLayer?: boolean;
        }) => (
            <div
                data-testid="pdf-page"
                data-page-number={pageNumber}
                data-width={width}
                data-height={height}
                data-scale={scale}
                data-render-text-layer={renderTextLayer ? 'true' : 'false'}
                data-render-annotation-layer={renderAnnotationLayer ? 'true' : 'false'}
            >
                Page {pageNumber}
            </div>
        ),
    };
});

jest.mock('../../../../components/Common/SpinningLoader', () => ({
    SpinningLoader: () => <div data-testid="spinning-loader">Loading PDF...</div>
}));

describe('PDFViewer Component', () => {
    const mockObjectUrl = "blob:http://localhost:3000/mock-pdf-url";

    // Save the original implementation
    const originalURL = URL;

    afterAll(() => {
        // Restore the original implementation
        URL.createObjectURL = originalURL.createObjectURL;
        URL.revokeObjectURL = originalURL.revokeObjectURL;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        URL.createObjectURL = jest.fn(() => mockObjectUrl);
        URL.revokeObjectURL = jest.fn();
    });

    const mockPdfBlob = new Blob(['PDF content'], {type: 'application/pdf'});

    it('renders correctly and matches snapshot', () => {
        const {container} = render(<PDFViewer previewContent={mockPdfBlob}/>);
        expect(container).toMatchSnapshot();
    });

    it('renders the PDF Viewer component with correct props', () => {
        render(<PDFViewer previewContent={mockPdfBlob}/>);

        const viewer = screen.getByTestId('pdf-viewer');
        expect(viewer).toBeInTheDocument();
        expect(viewer).toHaveAttribute('data-file', "\"blob:http://localhost:3000/mock-pdf-url\"");
    });

    it('passes the SpinningLoader component as renderLoader prop', () => {
        render(<PDFViewer previewContent={mockPdfBlob}/>);

        // Check if the spinning loader is rendered
        expect(screen.getByTestId('spinning-loader')).toBeInTheDocument();
        expect(screen.getByText('Loading PDF...')).toBeInTheDocument();
    });

    it('passes the correct URL to the Viewer component', () => {
        render(<PDFViewer previewContent={mockPdfBlob}/>);

        const viewer = screen.getByTestId('pdf-viewer');
        expect(viewer).toHaveAttribute('data-file', "\"blob:http://localhost:3000/mock-pdf-url\"");
    });
});