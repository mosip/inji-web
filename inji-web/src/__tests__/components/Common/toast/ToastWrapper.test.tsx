import { render, fireEvent } from '@testing-library/react';
import {toast} from 'react-toastify';
import {showToast} from '../../../../components/Common/toast/ToastWrapper';
import type { CloseButtonProps } from 'react-toastify/dist/components';

jest.mock('react-toastify', () => {
    const actual = jest.requireActual('react-toastify');
    const mockToast = jest.fn();

    Object.assign(mockToast, {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
        default: jest.fn()
    });

    return {
        ...actual,
        toast: mockToast
    };
});

describe('showToast', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        {
            description: 'should call toast.success with correct content for success type',
            params: {message: 'Success message', type: 'success', testId: 'success-toast'},
            expectedFn: 'success',
            expectedMessage: 'Success message',
            expectedTestId: 'toast-success-success-toast'
        },
        {
            description: 'should call toast.error with correct content for error type',
            params: {message: 'Error message', type: 'error', testId: 'error-toast'},
            expectedFn: 'error',
            expectedMessage: 'Error message',
            expectedTestId: 'toast-error-error-toast'
        },
        {
            description: 'should call toast.warning with correct content for warning type',
            params: {message: 'Warning message', type: 'warning', testId: 'warning-toast'},
            expectedFn: 'warning',
            expectedMessage: 'Warning message',
            expectedTestId: 'toast-warning-warning-toast'
        },
        {
            description: 'should call toast.info with correct content for info type',
            params: {message: 'Info message', type: 'info', testId: 'info-toast'},
            expectedFn: 'info',
            expectedMessage: 'Info message',
            expectedTestId: 'toast-info-info-toast'
        },
        {
            description: 'should call default toast with correct content for default type',
            params: {message: 'Default message', testId: 'default-toast'},
            expectedFn: 'default',
            expectedMessage: 'Default message',
            expectedTestId: 'toast-default-default-toast'
        }
    ])('$description', ({params, expectedFn, expectedMessage, expectedTestId}) => {
        const toastFn = expectedFn === 'default' ? toast : (toast as unknown as Record<string, typeof toast>)[expectedFn];

        showToast(params as any);

        expect(toastFn).toHaveBeenCalledTimes(1);
        expect(toastFn).toHaveBeenCalledWith(
            expect.any(Function),
            {"closeButton": true}
        );
    });

    it('should pass custom options to toast functions', () => {
        const options = {style: {backgroundColor: 'blue'}, closeButton: true};
        showToast({
            message: 'Message with options',
            type: 'success',
            testId: 'options-toast',
            options
        });

        expect(toast.success).toHaveBeenCalledWith(
            expect.anything(),
            options
        );
    });
});

describe('Toast rendering with default and custom closeButton options', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders message and data-testid correctly for default closeButton behavior', () => {
      const message = 'Hello Default';
      const type = 'success';
      const testId = 'default-cb';

      showToast({ message, type, testId });

      expect(toast.success).toHaveBeenCalledTimes(1);
      const contentFn = (toast as any).success.mock.calls[0][0] as (props: { closeToast: () => void }) => React.ReactNode;
      
      const mockCloseToast = jest.fn();
      const { getByText, getByTestId, queryByTestId } = render(<>{contentFn({ closeToast: mockCloseToast })}</>);

      const root = getByTestId(`toast-${type}-${testId}`);
      expect(root).toBeInTheDocument();
      expect(getByText(message)).toBeInTheDocument();
      expect(queryByTestId('close-btn')).toBeNull();
      expect(mockCloseToast).not.toHaveBeenCalled();
    });

    it('renders custom close button when options.closeButton is a function with correct signature', () => {
        const message = 'Hello Custom';
        const type = 'error';
        const testId = 'custom-cb';
        const customCloseButton = (props: CloseButtonProps) => (
          <button data-testid="close-btn" onClick={(e) => props.closeToast(e)}>
            X
          </button>
        );
  
        showToast({
          message,
          type,
          testId,
          options: { closeButton: customCloseButton },
        });
  
        expect(toast.error).toHaveBeenCalledTimes(1);
        const contentFn = (toast as any).error.mock.calls[0][0] as (props: { closeToast: () => void }) => React.ReactNode;
  
        const mockCloseToast = jest.fn();
        const { getByText, getByTestId } = render(<>{contentFn({ closeToast: mockCloseToast })}</>);
  
        const root = getByTestId(`toast-${type}-${testId}`);
        expect(root).toBeInTheDocument();
        expect(getByText(message)).toBeInTheDocument();
  
        const closeBtn = getByTestId('close-btn');
        expect(closeBtn).toBeInTheDocument();
  
        fireEvent.click(closeBtn);
        expect(mockCloseToast).toHaveBeenCalledTimes(1);
      });
  
    it('renders custom close button element when options.closeButton is a React element', () => {
        const message = 'Hello Element';
        const type = 'warning';
        const testId = 'element-cb';
        const customElement = <span data-testid="close-span">Close</span>;

        showToast({
            message,
            type,
            testId,
            options: { closeButton: customElement },
        });

        expect(toast.warning).toHaveBeenCalledTimes(1);
        const contentFn = (toast as any).warning.mock.calls[0][0] as (props: { closeToast: () => void }) => React.ReactNode;

        const mockCloseToast = jest.fn();
        const { getByText, getByTestId } = render(<>{contentFn({ closeToast: mockCloseToast })}</>);

        const root = getByTestId(`toast-${type}-${testId}`);
        expect(root).toBeInTheDocument();
        expect(getByText(message)).toBeInTheDocument();

        const closeSpan = getByTestId('close-span');
        expect(closeSpan).toBeInTheDocument();
    });
});