import {toast} from 'react-toastify';
import {showToast} from "../../../../components/Common/toast/ToastWrapper";

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

    it('should call toast.success with correct content for success type', () => {
        showToast({message: 'Success message', type: 'success', testId: 'success-toast'});

        expect(toast.success).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    message: 'Success message',
                    testId: 'toast-success-success-toast'
                })
            }),
            undefined
        );
    });

    it('should call toast.error with correct content for error type', () => {
        showToast({message: 'Error message', type: 'error', testId: 'error-toast'});

        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(toast.error).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    message: 'Error message',
                    testId: 'toast-error-error-toast'
                })
            }),
            undefined
        );
    });

    it('should call toast.warning with correct content for warning type', () => {
        showToast({message: 'Warning message', type: 'warning', testId: 'warning-toast'});

        expect(toast.warning).toHaveBeenCalledTimes(1);
        expect(toast.warning).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    message: 'Warning message',
                    testId: 'toast-warning-warning-toast'
                })
            }),
            undefined
        );
    });

    it('should call toast.info with correct content for info type', () => {
        showToast({message: 'Info message', type: 'info', testId: 'info-toast'});

        expect(toast.info).toHaveBeenCalledTimes(1);
        expect(toast.info).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    message: 'Info message',
                    testId: 'toast-info-info-toast'
                })
            }),
            undefined
        );
    });

    it('should call default toast with correct content for default type', () => {
        showToast({message: 'Default message', testId: 'default-toast'});

        expect(toast).toHaveBeenCalledTimes(1);
        expect(toast).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    message: 'Default message',
                    testId: 'toast-default-default-toast'
                })
            }),
            undefined
        );
    });

    it('should pass custom options to toast functions', () => {
        const options = {autoClose: 5000, position: 'top-right'};
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