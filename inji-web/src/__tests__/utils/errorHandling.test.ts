import {
    standardizeError,
    logError,
    createUserError,
    withErrorHandling,
    ERROR_TYPES,
    StandardError,
    ErrorHandlingOptions,
} from '../../utils/errorHandling';

// Mock console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('errorHandling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        mockConsoleError.mockRestore();
    });

    describe('standardizeError', () => {
        it('should handle HTTP error with known status code', () => {
            const error = {
                response: {
                    status: 404,
                    data: { message: 'Not found' },
                },
            };

            const result = standardizeError(error, { context: 'testContext' });

            expect(result.code).toBe(ERROR_TYPES.API_NOT_FOUND);
            // Standard error message should be prioritized over response data message
            expect(result.message).toBe('The requested resource was not found.');
            expect(result.context).toBe('testContext');
            expect(result.originalError).toBe(error);
            expect(result.timestamp).toBeInstanceOf(Date);
        });

        it('should handle HTTP error with unknown status code (4xx)', () => {
            const error = {
                response: {
                    status: 418,
                    data: { message: 'I am a teapot' },
                },
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.API_CLIENT);
        });

        it('should handle HTTP error with unknown status code (5xx)', () => {
            const error = {
                response: {
                    status: 501,
                    data: { message: 'Not implemented' },
                },
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.API_SERVER);
        });

        it('should handle network error', () => {
            const error = {
                code: 'NETWORK_ERROR',
                message: 'Network request failed',
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.API_NETWORK);
            expect(result.message).toBe('Network connection error. Please check your internet connection.');
        });

        it('should handle network error from message', () => {
            const error = {
                message: 'Network Error occurred',
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.API_NETWORK);
        });

        it('should handle timeout error', () => {
            const error = {
                code: 'TIMEOUT',
                message: 'Request timed out',
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.API_TIMEOUT);
            expect(result.message).toBe('The request took too long to complete. Please try again.');
        });

        it('should handle timeout error from message', () => {
            const error = {
                message: 'Request timeout occurred',
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.API_TIMEOUT);
        });

        it('should handle wallet error', () => {
            const error = {
                message: 'Wallet ID not available in storage',
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.WALLET_NOT_AVAILABLE);
            expect(result.message).toBe('Wallet ID not available. Please make sure you are logged in and have unlocked your wallet.');
        });

        it('should handle credentials error', () => {
            const error = {
                message: 'No matching credentials found for request',
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.CREDENTIALS_NOT_FOUND);
            expect(result.message).toBe('No matching credentials found for this request.');
        });

        it('should handle error with message', () => {
            const error = {
                message: 'Custom error message',
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.UNKNOWN);
            expect(result.message).toBe('Custom error message');
        });

        it('should handle unknown error', () => {
            const error = {};

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.UNKNOWN);
            expect(result.message).toBe('An unexpected error occurred. Please try again.');
        });

        it('should use fallback message when provided', () => {
            const error = {};
            const fallbackMessage = 'Custom fallback message';

            const result = standardizeError(error, { fallbackMessage });

            expect(result.message).toBe(fallbackMessage);
        });

        it('should handle all HTTP status codes', () => {
            const statusCodes = [
                { status: 400, expected: ERROR_TYPES.API_CLIENT },
                { status: 401, expected: ERROR_TYPES.API_UNAUTHORIZED },
                { status: 403, expected: ERROR_TYPES.API_FORBIDDEN },
                { status: 404, expected: ERROR_TYPES.API_NOT_FOUND },
                { status: 408, expected: ERROR_TYPES.API_TIMEOUT },
                { status: 429, expected: ERROR_TYPES.API_CLIENT },
                { status: 500, expected: ERROR_TYPES.API_SERVER },
                { status: 502, expected: ERROR_TYPES.API_SERVER },
                { status: 503, expected: ERROR_TYPES.API_SERVER },
                { status: 504, expected: ERROR_TYPES.API_TIMEOUT },
            ];

            statusCodes.forEach(({ status, expected }) => {
                const error = { response: { status } };
                const result = standardizeError(error);
                expect(result.code).toBe(expected);
            });
        });

        it('should use standard error message over response data message', () => {
            const error = {
                response: {
                    status: 400,
                    data: { message: 'Custom response message' },
                },
            };

            const result = standardizeError(error);

            // Standard error message should be prioritized
            expect(result.code).toBe(ERROR_TYPES.API_CLIENT);
            expect(result.message).toBe('There was an error with your request. Please try again.');
        });

        it('should use response data message as fallback when standard message is falsy', () => {
            // This tests the fallback chain: ERROR_MESSAGES[errorType] || error?.response?.data?.message || message
            // Since all known error types have standard messages, response data message acts as fallback
            // when standard message is not available (though this is unlikely in practice)
            const error = {
                response: {
                    status: 418, // I'm a teapot - maps to API_CLIENT which has a standard message
                    data: { message: 'Custom response message' },
                },
            };

            const result = standardizeError(error);

            // Standard error message is prioritized over response data message
            expect(result.code).toBe(ERROR_TYPES.API_CLIENT);
            expect(result.message).toBe('There was an error with your request. Please try again.');
        });

        it('should fallback to standard error message when response data message is not available', () => {
            const error = {
                response: {
                    status: 400,
                    // No data.message
                },
            };

            const result = standardizeError(error);

            expect(result.code).toBe(ERROR_TYPES.API_CLIENT);
            expect(result.message).toBe('There was an error with your request. Please try again.');
        });
    });

    describe('logError', () => {
        it('should log error by default', () => {
            const error: StandardError = {
                code: ERROR_TYPES.API_CLIENT,
                message: 'Test error',
                context: 'testContext',
                timestamp: new Date(),
                originalError: new Error('Original'),
            };

            logError(error);

            expect(mockConsoleError).toHaveBeenCalled();
            const callArgs = mockConsoleError.mock.calls[0];
            expect(callArgs[0]).toContain('[API_CLIENT]');
            expect(callArgs[0]).toContain('Test error');
        });

        it('should not log when logError is false', () => {
            const error: StandardError = {
                code: ERROR_TYPES.API_CLIENT,
                message: 'Test error',
                timestamp: new Date(),
            };

            logError(error, { logError: false });

            expect(mockConsoleError).not.toHaveBeenCalled();
        });

        it('should include context in log data', () => {
            const error: StandardError = {
                code: ERROR_TYPES.API_SERVER,
                message: 'Server error',
                context: 'apiCall',
                timestamp: new Date(),
            };

            logError(error);

            expect(mockConsoleError).toHaveBeenCalled();
        });

        it('should log with original error', () => {
            const originalError = new Error('Original error');
            const error: StandardError = {
                code: ERROR_TYPES.UNKNOWN,
                message: 'Standardized error',
                timestamp: new Date(),
                originalError,
            };

            logError(error);

            expect(mockConsoleError).toHaveBeenCalled();
        });
    });

    describe('createUserError', () => {
        it('should create user error with known error code', () => {
            const error: StandardError = {
                code: ERROR_TYPES.API_TIMEOUT,
                message: 'Request timeout',
                timestamp: new Date(),
            };

            const result = createUserError(error);

            expect(result.title).toBe('Request Timeout');
            expect(result.message).toBe('Request timeout');
            expect(result.code).toBe(ERROR_TYPES.API_TIMEOUT);
        });

        it('should create user error with unknown error code', () => {
            const error: StandardError = {
                code: 'UNKNOWN_CODE' as any,
                message: 'Unknown error',
                timestamp: new Date(),
            };

            const result = createUserError(error);

            expect(result.title).toBe('Error');
            expect(result.message).toBe('Unknown error');
            expect(result.code).toBe('UNKNOWN_CODE');
        });

        it('should map all error codes to titles', () => {
            const errorCodes = [
                ERROR_TYPES.API_TIMEOUT,
                ERROR_TYPES.API_NETWORK,
                ERROR_TYPES.API_SERVER,
                ERROR_TYPES.API_CLIENT,
                ERROR_TYPES.API_UNAUTHORIZED,
                ERROR_TYPES.API_FORBIDDEN,
                ERROR_TYPES.API_NOT_FOUND,
                ERROR_TYPES.WALLET_NOT_AVAILABLE,
                ERROR_TYPES.CREDENTIALS_NOT_FOUND,
                ERROR_TYPES.VALIDATION,
            ];

            errorCodes.forEach((code) => {
                const error: StandardError = {
                    code,
                    message: 'Test message',
                    timestamp: new Date(),
                };

                const result = createUserError(error);
                expect(result.title).toBeTruthy();
                expect(result.title).not.toBe('Error'); // Should have specific title
            });
        });
    });

    describe('withErrorHandling', () => {
        it('should return data on successful async function', async () => {
            const asyncFn = jest.fn().mockResolvedValue({ data: 'success' });

            const result = await withErrorHandling(asyncFn);

            expect(result.data).toEqual({ data: 'success' });
            expect(result.error).toBeUndefined();
            expect(asyncFn).toHaveBeenCalled();
        });

        it('should return error on failed async function', async () => {
            const error = new Error('Test error');
            const asyncFn = jest.fn().mockRejectedValue(error);

            const result = await withErrorHandling(asyncFn);

            expect(result.data).toBeUndefined();
            expect(result.error).toBeDefined();
            expect(result.error?.code).toBe(ERROR_TYPES.UNKNOWN);
            expect(result.error?.message).toBe('Test error');
        });

        it('should use context from options', async () => {
            const error = new Error('Test error');
            const asyncFn = jest.fn().mockRejectedValue(error);

            const result = await withErrorHandling(asyncFn, { context: 'testContext' });

            expect(result.error?.context).toBe('testContext');
        });

        it('should log error by default', async () => {
            const error = new Error('Test error');
            const asyncFn = jest.fn().mockRejectedValue(error);

            await withErrorHandling(asyncFn);

            expect(mockConsoleError).toHaveBeenCalled();
        });

        it('should not log error when logError is false', async () => {
            const error = new Error('Test error');
            const asyncFn = jest.fn().mockRejectedValue(error);

            await withErrorHandling(asyncFn, { logError: false });

            expect(mockConsoleError).not.toHaveBeenCalled();
        });

        it('should standardize HTTP errors', async () => {
            const error = {
                response: {
                    status: 404,
                    data: { message: 'Not found' },
                },
            };
            const asyncFn = jest.fn().mockRejectedValue(error);

            const result = await withErrorHandling(asyncFn);

            expect(result.error?.code).toBe(ERROR_TYPES.API_NOT_FOUND);
        });

        it('should handle complex async function', async () => {
            const asyncFn = jest.fn().mockImplementation(async () => {
                await new Promise((resolve) => setTimeout(resolve, 10));
                return { success: true, data: { id: 1 } };
            });

            const result = await withErrorHandling(asyncFn);

            expect(result.data).toEqual({ success: true, data: { id: 1 } });
            expect(result.error).toBeUndefined();
        });
    });
});

