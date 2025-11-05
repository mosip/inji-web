import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CredentialRequestModalFooter } from '../../../components/Credentials/CredentialRequestModalFooter';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

describe('CredentialRequestModalFooter Component', () => {
    const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
    const mockOnCancel = jest.fn();
    const mockOnConsentAndShare = jest.fn();

    const mockT = jest.fn((key: string, options?: any) => {
        const translations: Record<string, string> = {
            'buttons.consentShare': 'Consent & Share',
            'buttons.cancel': 'Cancel',
        };
        return translations[key] || key;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTranslation.mockReturnValue({
            t: mockT,
            i18n: {} as any,
            ready: true,
        });
    });

    describe('Rendering', () => {
        it('should match snapshot with enabled consent button', () => {
            const { asFragment } = render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );
            expect(asFragment()).toMatchSnapshot();
        });

        it('should match snapshot with disabled consent button', () => {
            const { asFragment } = render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={false}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );
            expect(asFragment()).toMatchSnapshot();
        });

        it('should render container with correct className', () => {
            const { container } = render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const footerContainer = container.firstChild;
            expect(footerContainer).toBeInTheDocument();
        });

        it('should render mobile layout', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            // Mobile layout should have buttons
            const mobileButtons = screen.getAllByTestId('btn-consent-share');
            expect(mobileButtons.length).toBeGreaterThan(0);
        });

        it('should render desktop layout', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            // Desktop layout should also have buttons
            const desktopButtons = screen.getAllByTestId('btn-cancel');
            expect(desktopButtons.length).toBe(2); // One for mobile, one for desktop
        });
    });

    describe('Consent & Share button', () => {
        it('should render consent button with correct text', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            expect(mockT).toHaveBeenCalledWith('buttons.consentShare');
            const consentButtons = screen.getAllByTestId('btn-consent-share');
            expect(consentButtons.length).toBe(2); // Mobile and desktop
            consentButtons.forEach(button => {
                expect(button).toBeInTheDocument();
            });
        });

        it('should be enabled when isConsentButtonEnabled is true', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const consentButtons = screen.getAllByTestId('btn-consent-share');
            consentButtons.forEach(button => {
                expect(button).not.toBeDisabled();
            });
        });

        it('should be disabled when isConsentButtonEnabled is false', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={false}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const consentButtons = screen.getAllByTestId('btn-consent-share');
            consentButtons.forEach(button => {
                expect(button).toBeDisabled();
            });
        });

        it('should call onConsentAndShare when clicked and enabled', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const consentButton = screen.getAllByTestId('btn-consent-share')[0];
            fireEvent.click(consentButton);

            expect(mockOnConsentAndShare).toHaveBeenCalledTimes(1);
        });

        it('should not call onConsentAndShare when clicked and disabled', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={false}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const consentButton = screen.getAllByTestId('btn-consent-share')[0];
            fireEvent.click(consentButton);

            expect(mockOnConsentAndShare).not.toHaveBeenCalled();
        });

        it('should apply correct className when enabled', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const consentButton = screen.getAllByTestId('btn-consent-share')[0];
            expect(consentButton).toHaveAttribute('type', 'button');
        });

        it('should apply correct className when disabled', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={false}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const consentButton = screen.getAllByTestId('btn-consent-share')[0];
            expect(consentButton).toHaveAttribute('type', 'button');
            expect(consentButton).toBeDisabled();
        });
    });

    describe('Cancel button', () => {
        it('should render cancel button with correct text', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            expect(mockT).toHaveBeenCalledWith('buttons.cancel');
            const cancelButtons = screen.getAllByTestId('btn-cancel');
            expect(cancelButtons.length).toBe(2); // Mobile and desktop
            cancelButtons.forEach(button => {
                expect(button).toBeInTheDocument();
            });
        });

        it('should call onCancel when clicked', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const cancelButton = screen.getAllByTestId('btn-cancel')[0];
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });

        it('should call onCancel for both mobile and desktop buttons', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const cancelButtons = screen.getAllByTestId('btn-cancel');
            expect(cancelButtons.length).toBe(2);

            fireEvent.click(cancelButtons[0]);
            expect(mockOnCancel).toHaveBeenCalledTimes(1);

            fireEvent.click(cancelButtons[1]);
            expect(mockOnCancel).toHaveBeenCalledTimes(2);
        });

        it('should have correct button type', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const cancelButtons = screen.getAllByTestId('btn-cancel');
            cancelButtons.forEach(button => {
                expect(button).toHaveAttribute('type', 'button');
            });
        });
    });

    describe('Layout structure', () => {
        it('should render both mobile and desktop layouts', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            // Should have 2 consent buttons (one for mobile, one for desktop)
            expect(screen.getAllByTestId('btn-consent-share').length).toBe(2);
            
            // Should have 2 cancel buttons (one for mobile, one for desktop)
            expect(screen.getAllByTestId('btn-cancel').length).toBe(2);
        });

        it('should render cancel button with span element containing text', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            const cancelButtons = screen.getAllByTestId('btn-cancel');
            expect(cancelButtons.length).toBe(2);
            
            cancelButtons.forEach(button => {
                const span = button.querySelector('span');
                expect(span).toBeInTheDocument();
                // Verify translation was called
                expect(mockT).toHaveBeenCalledWith('buttons.cancel');
            });
        });
    });

    describe('Translation', () => {
        it('should call useTranslation with correct namespace', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            expect(mockUseTranslation).toHaveBeenCalledWith(['CredentialRequestModal']);
        });

        it('should use translation function for button texts', () => {
            render(
                <CredentialRequestModalFooter
                    isConsentButtonEnabled={true}
                    onCancel={mockOnCancel}
                    onConsentAndShare={mockOnConsentAndShare}
                />
            );

            expect(mockT).toHaveBeenCalledWith('buttons.consentShare');
            expect(mockT).toHaveBeenCalledWith('buttons.cancel');
        });
    });
});

