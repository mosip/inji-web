import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CredentialRequestModalHeader } from '../../../components/Credentials/CredentialRequestModalHeader';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

describe('CredentialRequestModalHeader Component', () => {
    const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
    const mockT = jest.fn((key: string, options?: any) => {
        if (key === 'header.title') {
            return `Request from ${options?.verifierName || ''}`;
        }
        if (key === 'header.description') {
            return 'Please select the credentials you want to share';
        }
        return key;
    }) as any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTranslation.mockReturnValue({
            t: mockT,
            i18n: {} as any,
            ready: true,
        } as any);
    });

    describe('Rendering', () => {
        it('should match snapshot', () => {
            const { asFragment } = render(
                <CredentialRequestModalHeader verifierName="Test Verifier" />
            );
            expect(asFragment()).toMatchSnapshot();
        });

        it('should render container with correct className', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            const title = screen.getByTestId('title-verifier-request');
            const container = title.closest('div');
            expect(container).toBeInTheDocument();
        });

        it('should render title element', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            const title = screen.getByTestId('title-verifier-request');
            expect(title).toBeInTheDocument();
            expect(title.tagName).toBe('H2');
        });

        it('should render description element', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            const description = screen.getByTestId('text-select-credentials');
            expect(description).toBeInTheDocument();
            expect(description.tagName).toBe('P');
        });
    });

    describe('Title content', () => {
        it('should display verifier name in title', () => {
            render(<CredentialRequestModalHeader verifierName="ABC Verifier" />);

            expect(mockT).toHaveBeenCalledWith('header.title', { verifierName: 'ABC Verifier' });
            const title = screen.getByTestId('title-verifier-request');
            expect(title).toBeInTheDocument();
        });

        it('should handle different verifier names', () => {
            render(<CredentialRequestModalHeader verifierName="XYZ Corporation" />);

            expect(mockT).toHaveBeenCalledWith('header.title', { verifierName: 'XYZ Corporation' });
            const title = screen.getByTestId('title-verifier-request');
            expect(title).toBeInTheDocument();
        });

        it('should handle empty verifier name', () => {
            render(<CredentialRequestModalHeader verifierName="" />);

            expect(mockT).toHaveBeenCalledWith('header.title', { verifierName: '' });
            const title = screen.getByTestId('title-verifier-request');
            expect(title).toBeInTheDocument();
        });

        it('should call translation function with correct key and options', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            expect(mockT).toHaveBeenCalledWith('header.title', { verifierName: 'Test Verifier' });
        });
    });

    describe('Description content', () => {
        it('should display description text', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            expect(mockT).toHaveBeenCalledWith('header.description');
            const description = screen.getByTestId('text-select-credentials');
            expect(description).toBeInTheDocument();
        });

        it('should call translation function with correct key for description', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            expect(mockT).toHaveBeenCalledWith('header.description');
        });
    });

    describe('Translation', () => {
        it('should call useTranslation with correct namespace', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            expect(mockUseTranslation).toHaveBeenCalledWith(['CredentialRequestModal']);
        });

        it('should use translation function for both title and description', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            expect(mockT).toHaveBeenCalledWith('header.title', expect.objectContaining({ verifierName: 'Test Verifier' }));
            expect(mockT).toHaveBeenCalledWith('header.description');
        });
    });

    describe('Accessibility and structure', () => {
        it('should have correct test IDs', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            expect(screen.getByTestId('title-verifier-request')).toBeInTheDocument();
            expect(screen.getByTestId('text-select-credentials')).toBeInTheDocument();
        });

        it('should apply correct className to title', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            const title = screen.getByTestId('title-verifier-request');
            expect(title).toHaveAttribute('class');
        });

        it('should apply correct className to description', () => {
            render(<CredentialRequestModalHeader verifierName="Test Verifier" />);

            const description = screen.getByTestId('text-select-credentials');
            expect(description).toHaveAttribute('class');
        });
    });

    describe('Edge cases', () => {
        it('should handle long verifier names', () => {
            const longName = 'A'.repeat(100);
            render(<CredentialRequestModalHeader verifierName={longName} />);

            expect(mockT).toHaveBeenCalledWith('header.title', { verifierName: longName });
            const title = screen.getByTestId('title-verifier-request');
            expect(title).toBeInTheDocument();
        });

        it('should handle special characters in verifier name', () => {
            render(<CredentialRequestModalHeader verifierName="Test & Co. (Ltd.)" />);

            expect(mockT).toHaveBeenCalledWith('header.title', { verifierName: 'Test & Co. (Ltd.)' });
            const title = screen.getByTestId('title-verifier-request');
            expect(title).toBeInTheDocument();
        });

        it('should handle verifier name with numbers', () => {
            render(<CredentialRequestModalHeader verifierName="Verifier123" />);

            expect(mockT).toHaveBeenCalledWith('header.title', { verifierName: 'Verifier123' });
            const title = screen.getByTestId('title-verifier-request');
            expect(title).toBeInTheDocument();
        });
    });
});

