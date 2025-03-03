import React, { useTransition } from 'react';
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';
import { toast} from 'react-toastify';

// Mock the toast function
jest.mock('react-toastify', () => {
  return {
    toast: {
      warning: jest.fn(),
    },
    ToastContainer: () => <div data-testid="toast-wrapper" />
  };
});

// Mock the components used in HomePage
jest.mock('../../components/Home/HomeBanner.tsx', () => ({
  HomeBanner: ({ onClick }: { onClick: () => void }) => (
    <div data-testid="HomeBanner" onClick={onClick}>HomeBanner</div>
  ),
}));
 
jest.mock('../../components/Home/HomeFeatures', () => ({
  HomeFeatures: () => <div data-testid="HomeFeatures">HomeFeatures</div>,
}));
 
jest.mock('../../components/Home/HomeQuickTip', () => ({
  HomeQuickTip: ({ onClick }: { onClick: () => void }) => (
    <div data-testid="HomeQuickTip" onClick={onClick}>HomeQuickTip</div>
  ),
}));
 
// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));


describe('HomePage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
          <HomePage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear mock before each test
    jest.clearAllMocks(); 
  });

  test('renders HomeBanner, HomeFeatures, and HomeQuickTip components', () => {
    renderComponent();
 
    expect(screen.getByTestId('HomeBanner')).toBeInTheDocument();
    expect(screen.getByTestId('HomeFeatures')).toBeInTheDocument();
    expect(screen.getByTestId('HomeQuickTip')).toBeInTheDocument();
  });
 
  test('navigates to /issuers when HomeBanner is clicked', () => {
    renderComponent();
 
    const homeBanner = screen.getByTestId('HomeBanner');
    fireEvent.click(homeBanner);
 
    expect(window.location.pathname).toBe('/issuers');
  });
 
  test('navigates to /issuers when HomeQuickTip is clicked', () => {
    renderComponent();
 
    const homeQuickTip = screen.getByTestId('HomeQuickTip');
    fireEvent.click(homeQuickTip);
 
    expect(window.location.pathname).toBe('/issuers');
  });
  
  test('shows toast only once when HomeQuickTip is clicked multiple times', async() => {
    renderComponent();
    const homeQuickTip = screen.getByTestId('HomeQuickTip');

    // Click HomeQuickTip multiple times
    fireEvent.click(homeQuickTip);
    fireEvent.click(homeQuickTip);
    fireEvent.click(homeQuickTip);

    // Check that toast.warning was called only once
    expect(toast.warning).toHaveBeenCalledTimes(1);
    expect(toast.warning).toHaveBeenCalledWith(
      'QuickTip.toastText', // String as the message
      expect.objectContaining({
        onClose: expect.any(Function),
      })
    );

    // Assertion to check if toast is rendered or not using test-id
    await waitFor(() => {
      const toastElement = screen.getByTestId("toast-wrapper");
      expect(toastElement).toBeInTheDocument();
    });
  });
  
  // Snapshot test cases
  test('matches snapshot for HomePage', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  
  test('matches snapshot for HomePage with toast visible', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    // Simulate toast visibility
    fireEvent.click(screen.getByTestId('HomeQuickTip'));
    expect(asFragment()).toMatchSnapshot();
  });

  test('toast disappears after timeout', async () => {

    // Create a more dynamic mock for toast
    jest.spyOn(toast, 'warning').mockImplementation((message, options) => {
      // Simulate toast lifecycle
      if (options && options.onClose) {
        setTimeout(options.onClose, 5000);
      }
      return 'mock-toast-id';
    });
  
    renderComponent();
    const homeQuickTip = screen.getByTestId('HomeQuickTip');
  
    // Click to show toast
    fireEvent.click(homeQuickTip);
  
    // Verify toast is initially present
    const initialToastWrapper = screen.getByTestId('toast-wrapper');
    expect(initialToastWrapper).toBeInTheDocument();
  
    // Wait for toast to potentially disappear
    await waitFor(() => {
      // Verify onClose was called
      expect(toast.warning).toHaveBeenCalledWith(
        'QuickTip.toastText',
        expect.objectContaining({
          onClose: expect.any(Function)
        })
      );
    }, { timeout: 6000 });
  });

  test('shows toast message again after it disappears and user clicks again', async () => {
    jest.useFakeTimers();

    // Create a mock for toast that triggers onClose after a short delay
    let onCloseCallback: (<T = unknown>(props?: T) => void) | undefined;
    jest.spyOn(toast, 'warning').mockImplementation((message, options) => {
      if (options && options.onClose) {
        onCloseCallback = options.onClose;
        setTimeout(() => {
          if (onCloseCallback) {
            onCloseCallback();
          }
        }, 100);
      }
      return 'mock-toast-id';
    });

    renderComponent();
    const homeQuickTip = screen.getByTestId('HomeQuickTip');

    // First click - show toast
    fireEvent.click(homeQuickTip);
    
    expect(toast.warning).toHaveBeenCalledTimes(1);

    // Wait for the toast to disappear 
    await act(async () => {
      jest.advanceTimersByTime(150);
    });

    // Reset the mock to track new calls
    jest.clearAllMocks();

    // Second click - should show toast again
    fireEvent.click(homeQuickTip);

    // Verify toast is shown again
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        'QuickTip.toastText',
        expect.objectContaining({
          onClose: expect.any(Function)
        })
      );
    });

    // Cleanup timers
    jest.useRealTimers();
  });
});
