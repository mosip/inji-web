import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {WalletCredential} from '../../../types/data';
import {VCCardView} from '../../../components/VC/VCCardView';

describe('VCCardView Component', () => {
    const mockCredential: WalletCredential = {
        credentialId: 'test-id-123',
        credentialTypeDisplayName: 'Health ID',
        issuerDisplayName: 'Test Issuer',
        credentialTypeLogo: 'test-logo.png',
        issuerLogo: "test-issuer-logo.png",
    };

    const mockPreview = jest.fn();
    const mockDownload = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should match snapshot', () => {
        const {container} = render(
            <VCCardView
                credential={mockCredential}
                onPreview={mockPreview}
                onDownload={mockDownload}
            />
        );

        expect(container).toMatchSnapshot();
    });

    it('should render with correct credential information', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onPreview={mockPreview}
                onDownload={mockDownload}
            />
        );

        expect(screen.getByTestId("vc-card-view")).toBeInTheDocument();
        const logo = screen.getByTestId('issuer-logo');
        const name = screen.getByTestId('credential-type-display-name');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'test-logo.png');
        expect(logo).toHaveAttribute('alt', 'Credential Type Logo');

        expect(name).toBeInTheDocument();
        expect(name).toHaveTextContent('Health ID');
    });

    it('should call onPreview when clicked', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onPreview={mockPreview}
                onDownload={mockDownload}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.click(card);

        expect(mockPreview).toHaveBeenCalledTimes(1);
        expect(mockPreview).toHaveBeenCalledWith(mockCredential);
    });

    it('should call onPreview when pressing enter key', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onPreview={mockPreview}
                onDownload={mockDownload}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.keyDown(card, {key: 'Enter'});

        expect(mockPreview).toHaveBeenCalledTimes(1);
        expect(mockPreview).toHaveBeenCalledWith(mockCredential);
    });

    it('should not call onPreview when pressing key other than enter key', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onPreview={mockPreview}
                onDownload={mockDownload}
            />
        );

        const card = screen.getByRole('menuitem');
        fireEvent.keyDown(card, {key: '1'});

        expect(mockPreview).not.toBeCalled()
    });

    it('should call onDownload when download icon is clicked', () => {
        render(
            <VCCardView
                credential={mockCredential}
                onPreview={mockPreview}
                onDownload={mockDownload}
            />
        );

        const downloadIcon = screen.getByTestId('icon-download');
        fireEvent.click(downloadIcon);

        expect(mockDownload).toHaveBeenCalledTimes(1);
        expect(mockDownload).toHaveBeenCalledWith(mockCredential);
    })
});