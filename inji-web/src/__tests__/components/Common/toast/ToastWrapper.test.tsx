import {toast} from 'react-toastify';
import {showToast} from '../../../../components/Common/toast/ToastWrapper';

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
            expect.objectContaining({
                props: expect.objectContaining({
                    message: expectedMessage,
                    testId: expectedTestId
                })
            }),
            undefined
        );
    });

    it('should pass custom options to toast functions', () => {
        const options = {style: {backgroundColor: 'blue'}};
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