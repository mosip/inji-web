import React from 'react';
import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import {VCDetailView} from "../../../components/VC/VCDetailView";
import {mockUseTranslation} from "../../../test-utils/mockUtils";
import {mockVerifiableCredentials} from "../../../test-utils/mockObjects";
import {WalletCredential} from "../../../types/data";

mockUseTranslation()
jest.mock('../../../components/Preview/PDFViewer', () => ({
  PDFViewer: ({ previewContent } : {
      previewContent: string
  }) => (
    <div data-testid="pdf-viewer">{previewContent}</div>
  ),
}));

describe('VCDetailView', () => {
  const mockCredential : WalletCredential = mockVerifiableCredentials[0];

  const mockProps = {
    previewContent: 'Test PDF Content',
    onClose: jest.fn(),
    onDownload: jest.fn().mockResolvedValue(undefined),
    credential: mockCredential
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when previewContent is provided', () => {
    render(<VCDetailView {...mockProps} />);

    expect(screen.getByTestId('vc-card-detail-view')).toBeInTheDocument();
    expect(screen.getByTestId('title-credential-type-display-name')).toHaveTextContent('Drivers License');
    const detailViewContent = screen.getByTestId("vc-card-detail-view-content");
    expect(detailViewContent).toBeInTheDocument()
    expect(within(detailViewContent).getByTestId('pdf-viewer')).toHaveTextContent('Test PDF Content');
  });

  it('should not render modal when previewContent is empty', () => {
    render(<VCDetailView {...mockProps} previewContent="" />);

    expect(screen.queryByTestId('vc-card-detail-view')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<VCDetailView {...mockProps} />);

    const closeButton = screen.getByTestId('icon-close');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onDownload when download button is clicked', async () => {
    render(<VCDetailView {...mockProps} />);

    // 2 buttons with testId 'btn-download' are rendered - 1 for mobile and 1 for desktop which are hidden based on screen size
    const downloadButton = screen.getAllByTestId('btn-download')[0];
    fireEvent.click(downloadButton);

    expect(mockProps.onDownload).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      // Just ensuring the promise resolves
      expect(mockProps.onDownload).toHaveBeenCalled();
    });
  });

  it('should pass credential title to modal', () => {
    render(
      <VCDetailView
        {...mockProps}
      />
    );

    expect(screen.getByTestId('title-credential-type-display-name')).toHaveTextContent('Drivers License');
  });
});