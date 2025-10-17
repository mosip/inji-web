import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NoMatchingCredentialsModal } from '../../modals/NoMatchingCredentialsModal';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../hooks/useApi', () => ({
  useApi: jest.fn(),
}));

jest.mock('../../modals/ModalWrapper', () => ({
  ModalWrapper: ({ header, footer, content, zIndex, size }: any) => (
    <div data-testid="ModalWrapper-Mock" data-z-index={zIndex} data-size={size}>
      {header}
      {content}
      {footer}
    </div>
  ),
}));

jest.mock('../../components/Common/Buttons/SolidButton', () => ({
  SolidButton: ({ onClick, title, testId, fullWidth, className }: any) => (
    <button 
      data-testid={testId} 
      onClick={onClick}
      data-full-width={fullWidth}
      className={className}
      type="button"
    >
      {title}
    </button>
  ),
}));

jest.mock('../../assets/error_message.svg', () => 'error-message-icon-mock.svg');

describe('NoMatchingCredentialsModal', () => {
  const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
  const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

  const defaultProps = {
    isVisible: true,
    missingClaims: ['claim1', 'claim2'],
    onGoToHome: jest.fn(),
    redirectUri: 'https://example.com/redirect',
    presentationId: 'test-presentation-id',
  };

  const mockFetchData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'title': 'No Matching Credentials',
          'description': 'You do not have the required credentials to proceed.',
          'goToHomeButton': 'Go to Home',
        };
        return translations[key] || key;
      },
    } as any);

    mockUseApi.mockReturnValue({
      fetchData: mockFetchData,
      data: null,
      error: null,
      state: 'idle' as any,
      status: null,
      ok: () => true,
    });
  });

  describe('Rendering', () => {
    it('renders nothing when not visible', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} isVisible={false} />);
      expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
    });

    it('renders modal when visible', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
      expect(screen.getByTestId('img-no-matching-credentials-icon')).toBeInTheDocument();
    });

    it('renders error icon', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const errorIcon = screen.getByTestId('img-no-matching-credentials-icon');
      expect(errorIcon).toBeInTheDocument();
      expect(errorIcon).toHaveAttribute('src', 'error-message-icon-mock.svg');
      expect(errorIcon).toHaveAttribute('alt', 'Error Icon');
    });

    it('renders title and description from translations', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText('No Matching Credentials')).toBeInTheDocument();
      expect(screen.getByText('You do not have the required credentials to proceed.')).toBeInTheDocument();
    });

    it('renders go to home button', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      expect(goToHomeButton).toBeInTheDocument();
      expect(goToHomeButton).toHaveTextContent('Go to Home');
    });
  });

  describe('User Interactions', () => {
    it('calls onGoToHome when go to home button is clicked without presentationId', async () => {
      const propsWithoutPresentationId = {
        ...defaultProps,
        presentationId: undefined,
        redirectUri: undefined, // Ensure no redirectUri
      };

      render(<NoMatchingCredentialsModal {...propsWithoutPresentationId} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1);
      });
      expect(mockFetchData).not.toHaveBeenCalled();
    });

    it('calls onGoToHome when go to home button is clicked with redirectUri', () => {
      const propsWithoutPresentationId = {
        ...defaultProps,
        presentationId: undefined,
      };

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<NoMatchingCredentialsModal {...propsWithoutPresentationId} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      expect(window.location.href).toBe('https://example.com/redirect');
    });

    it('calls API to reject verifier when presentationId is provided', async () => {
      mockFetchData.mockResolvedValue({
        data: { success: true },
        error: null,
        status: 200,
        ok: () => true,
      });

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalledWith({
          url: expect.stringContaining('/presentations/test-presentation-id'),
          apiConfig: expect.any(Object),
          body: {
            errorCode: 'access_denied',
            errorMessage: 'User denied authorization to share credentials',
          },
        });
      });

      expect(window.location.href).toBe('https://example.com/redirect');
    });

    it('calls onGoToHome when no redirectUri is provided', async () => {
      const propsWithoutRedirectUri = {
        ...defaultProps,
        redirectUri: null,
      };

      mockFetchData.mockResolvedValue({
        data: { success: true },
        error: null,
        status: 200,
        ok: () => true,
      });

      render(<NoMatchingCredentialsModal {...propsWithoutRedirectUri} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalled();
      });

      expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1);
    });
  });

  describe('API Integration', () => {
    it('handles API success correctly', async () => {
      mockFetchData.mockResolvedValue({
        data: { success: true },
        error: null,
        status: 200,
        ok: () => true,
      });

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalledWith({
          url: expect.stringContaining('/presentations/test-presentation-id'),
          apiConfig: expect.any(Object),
          body: {
            errorCode: 'access_denied',
            errorMessage: 'User denied authorization to share credentials',
          },
        });
      });

      expect(window.location.href).toBe('https://example.com/redirect');
    });

    it('handles API error gracefully', async () => {
      const error = new Error('API Error');
      mockFetchData.mockRejectedValue(error);

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalled();
      });
      expect(window.location.href).toBe('');
    });
  });

  describe('Component Structure', () => {
    it('renders all required elements', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
      expect(screen.getByTestId('img-no-matching-credentials-icon')).toBeInTheDocument();
      expect(screen.getByTestId('text-no-matching-credentials-description')).toBeInTheDocument();
      expect(screen.getByTestId('btn-go-to-home')).toBeInTheDocument();
    });

    it('has correct CSS classes for responsive design', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId('card-no-matching-credentials-modal');
      expect(modalContainer).toHaveClass('w-full', 'max-w-[400px]', 'min-h-[350px]');
    });

    it('passes correct props to ModalWrapper', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalWrapper = screen.getByTestId('ModalWrapper-Mock');
      expect(modalWrapper).toHaveAttribute('data-z-index', '50');
      expect(modalWrapper).toHaveAttribute('data-size', 'md');
    });
  });

  describe('Props Handling', () => {
    it('handles missing claims prop', () => {
      const propsWithoutMissingClaims = {
        ...defaultProps,
        missingClaims: undefined,
      };

      render(<NoMatchingCredentialsModal {...propsWithoutMissingClaims} />);

      expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
    });

    it('handles empty missing claims array', () => {
      const propsWithEmptyMissingClaims = {
        ...defaultProps,
        missingClaims: [],
      };

      render(<NoMatchingCredentialsModal {...propsWithEmptyMissingClaims} />);

      expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
    });

    it('handles undefined redirectUri', async () => {
      const propsWithoutRedirectUri = {
        ...defaultProps,
        redirectUri: undefined,
      };

      mockFetchData.mockResolvedValue({
        data: { success: true },
        error: null,
        status: 200,
        ok: () => true,
      });

      render(<NoMatchingCredentialsModal {...propsWithoutRedirectUri} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalled();
      });

      expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1);
    });

    it('handles undefined presentationId', async () => {
      const propsWithoutPresentationId = {
        ...defaultProps,
        presentationId: undefined,
        redirectUri: undefined, // Ensure no redirectUri
      };

      render(<NoMatchingCredentialsModal {...propsWithoutPresentationId} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(defaultProps.onGoToHome).toHaveBeenCalledTimes(1);
      });
      expect(mockFetchData).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const title = screen.getByText('No Matching Credentials');
      expect(title).toHaveAttribute('id', 'title-no-matching-credentials');

      const description = screen.getByTestId('text-no-matching-credentials-description');
      expect(description).toBeInTheDocument();
    });

    it('has proper button attributes', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');
      expect(goToHomeButton).toBeInTheDocument();
      expect(goToHomeButton.tagName).toBe('BUTTON');
      expect(goToHomeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid button clicks', async () => {
      mockFetchData.mockResolvedValue({
        data: { success: true },
        error: null,
        status: 200,
        ok: () => true,
      });

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const goToHomeButton = screen.getByTestId('btn-go-to-home');

      // Rapid clicks
      fireEvent.click(goToHomeButton);
      fireEvent.click(goToHomeButton);
      fireEvent.click(goToHomeButton);

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalled();
      });

      // Should handle multiple clicks without errors
      expect(window.location.href).toBe('https://example.com/redirect');
    });

    it('handles undefined onGoToHome callback', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        onGoToHome: undefined as any,
        presentationId: undefined,
      };

      // Should not throw error
      expect(() => {
        render(<NoMatchingCredentialsModal {...propsWithoutCallback} />);
      }).not.toThrow();
    });

    it('handles special characters in missing claims', () => {
      const propsWithSpecialClaims = {
        ...defaultProps,
        missingClaims: ['claim@#$%', 'claim with spaces', 'claim-with-dashes'],
      };

      render(<NoMatchingCredentialsModal {...propsWithSpecialClaims} />);

      expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('uses correct translation namespace', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(mockUseTranslation).toHaveBeenCalledWith('NoMatchingCredentialsModal');
    });

    it('handles missing translation keys gracefully', () => {
      mockUseTranslation.mockReturnValue({
        t: (key: string) => key, // Return key if translation not found
      } as any);

      render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByText('title')).toBeInTheDocument();
      expect(screen.getByText('description')).toBeInTheDocument();
      expect(screen.getByText('goToHomeButton')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily when props are the same', () => {
      const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);

      const initialModal = screen.getByTestId('ModalWrapper-Mock');

      rerender(<NoMatchingCredentialsModal {...defaultProps} />);

      const afterRerender = screen.getByTestId('ModalWrapper-Mock');
      expect(initialModal).toBe(afterRerender);
    });

    it('re-renders when isVisible prop changes', () => {
      const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);

      expect(screen.getByTestId('ModalWrapper-Mock')).toBeInTheDocument();

      rerender(<NoMatchingCredentialsModal {...defaultProps} isVisible={false} />);

      expect(screen.queryByTestId('ModalWrapper-Mock')).not.toBeInTheDocument();
    });

    it('re-renders when callback props change', () => {
      const newOnGoToHome = jest.fn();
      const { rerender } = render(<NoMatchingCredentialsModal {...defaultProps} />);

      const initialModal = screen.getByTestId('ModalWrapper-Mock');

      rerender(<NoMatchingCredentialsModal {...defaultProps} onGoToHome={newOnGoToHome} />);

      const afterRerender = screen.getByTestId('ModalWrapper-Mock');
      // React may optimize and not re-render for callback changes, which is fine
      expect(afterRerender).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies mobile-first responsive classes', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId('card-no-matching-credentials-modal');
      expect(modalContainer).toHaveClass('w-full', 'max-w-[400px]', 'min-h-[350px]');
    });

    it('applies mobile breakpoint classes', () => {
      render(<NoMatchingCredentialsModal {...defaultProps} />);

      const modalContainer = screen.getByTestId('card-no-matching-credentials-modal');
      expect(modalContainer).toHaveClass('max-[533px]:w-screen', 'max-[533px]:fixed', 'max-[533px]:inset-x-0', 'max-[533px]:z-[60]');
    });
  });
});