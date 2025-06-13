import React from 'react';
import {render, screen} from '@testing-library/react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {PDFViewer} from '../../../../components/Preview/PDFViewer';

jest.mock('@react-pdf-viewer/core', () => ({
    SpecialZoomLevel: {
        PageWidth: 'page-width'
    },
    Worker: ({children}: { children: React.ReactNode }) => <div data-testid="pdf-worker">{children}</div>,
    Viewer: ({fileUrl, renderLoader, defaultScale, enableSmoothScroll}: {
        fileUrl: string;
        renderLoader?: (props: unknown) => React.ReactNode;
        defaultScale: string;
        enableSmoothScroll?: boolean
    }) => (
        <div
            data-testid="pdf-viewer"
            data-file-url={fileUrl}
            data-default-scale={defaultScale}
            data-enable-smooth-scroll={enableSmoothScroll ? 'true' : 'false'}
        >
            {/* Render a mock loader to test the renderLoader prop */}
            {renderLoader && renderLoader({})}
        </div>
    )
}));

jest.mock('../../../../components/Common/SpinningLoader', () => ({
    SpinningLoader: () => <div data-testid="spinning-loader">Loading PDF...</div>
}));

describe('PDFViewer Component', () => {
    const mockPdfUrl = 'https://example.com/test.pdf';

    it('renders correctly and matches snapshot', () => {
        const {container} = render(<PDFViewer previewContent={mockPdfUrl}/>);
        expect(container).toMatchSnapshot();
    });

    it('renders the PDF Worker component', () => {
        render(<PDFViewer previewContent={mockPdfUrl}/>);
        expect(screen.getByTestId('pdf-worker')).toBeInTheDocument();
    });

    it('renders the PDF Viewer component with correct props', () => {
        render(<PDFViewer previewContent={mockPdfUrl}/>);

        const viewer = screen.getByTestId('pdf-viewer');
        expect(viewer).toBeInTheDocument();
        expect(viewer).toHaveAttribute('data-file-url', mockPdfUrl);
        expect(viewer).toHaveAttribute('data-default-scale', 'page-width');
        expect(viewer).toHaveAttribute('data-enable-smooth-scroll', 'true');
    });

    it('passes the SpinningLoader component as renderLoader prop', () => {
        render(<PDFViewer previewContent={mockPdfUrl}/>);

        // Check if the spinning loader is rendered
        expect(screen.getByTestId('spinning-loader')).toBeInTheDocument();
        expect(screen.getByText('Loading PDF...')).toBeInTheDocument();
    });

    it('passes the correct URL to the Viewer component', () => {
        const customUrl = 'https://example.com/custom.pdf';
        render(<PDFViewer previewContent={customUrl}/>);

        const viewer = screen.getByTestId('pdf-viewer');
        expect(viewer).toHaveAttribute('data-file-url', customUrl);
    });
});