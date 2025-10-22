/**
 * Standardized Error Handling Utilities
 * Provides consistent error handling patterns across the application
 */

export interface StandardError {
    code: string;
    message: string;
    context?: string;
    originalError?: any;
    timestamp: Date;
}

export interface ErrorHandlingOptions {
    context?: string;
    showToUser?: boolean;
    logError?: boolean;
    fallbackMessage?: string;
}

// Internal error types and mappings (not exported as they're only used internally)
const ERROR_TYPES = {
    API_TIMEOUT: 'API_TIMEOUT',
    API_NETWORK: 'API_NETWORK',
    API_SERVER: 'API_SERVER',
    API_CLIENT: 'API_CLIENT',
    API_UNAUTHORIZED: 'API_UNAUTHORIZED',
    API_FORBIDDEN: 'API_FORBIDDEN',
    API_NOT_FOUND: 'API_NOT_FOUND',
    WALLET_NOT_AVAILABLE: 'WALLET_NOT_AVAILABLE',
    CREDENTIALS_NOT_FOUND: 'CREDENTIALS_NOT_FOUND',
    UNKNOWN: 'UNKNOWN',
    VALIDATION: 'VALIDATION'
} as const;

const HTTP_STATUS_TO_ERROR_TYPE: Record<number, string> = {
    400: ERROR_TYPES.API_CLIENT,
    401: ERROR_TYPES.API_UNAUTHORIZED,
    403: ERROR_TYPES.API_FORBIDDEN,
    404: ERROR_TYPES.API_NOT_FOUND,
    408: ERROR_TYPES.API_TIMEOUT,
    429: ERROR_TYPES.API_CLIENT,
    500: ERROR_TYPES.API_SERVER,
    502: ERROR_TYPES.API_SERVER,
    503: ERROR_TYPES.API_SERVER,
    504: ERROR_TYPES.API_TIMEOUT
};

const ERROR_MESSAGES: Record<string, string> = {
    [ERROR_TYPES.API_TIMEOUT]: 'The request took too long to complete. Please try again.',
    [ERROR_TYPES.API_NETWORK]: 'Network connection error. Please check your internet connection.',
    [ERROR_TYPES.API_SERVER]: 'Server error occurred. Please try again later.',
    [ERROR_TYPES.API_CLIENT]: 'There was an error with your request. Please try again.',
    [ERROR_TYPES.API_UNAUTHORIZED]: 'You are not authorized. Please log in again.',
    [ERROR_TYPES.API_FORBIDDEN]: 'You do not have permission to access this resource.',
    [ERROR_TYPES.API_NOT_FOUND]: 'The requested resource was not found.',
    [ERROR_TYPES.WALLET_NOT_AVAILABLE]: 'Wallet ID not available. Please make sure you are logged in and have unlocked your wallet.',
    [ERROR_TYPES.CREDENTIALS_NOT_FOUND]: 'No matching credentials found for this request.',
    [ERROR_TYPES.VALIDATION]: 'Invalid input provided. Please check your data and try again.',
    [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

const ERROR_TITLES: Record<string, string> = {
    [ERROR_TYPES.API_TIMEOUT]: 'Request Timeout',
    [ERROR_TYPES.API_NETWORK]: 'Network Error',
    [ERROR_TYPES.API_SERVER]: 'Server Error',
    [ERROR_TYPES.API_CLIENT]: 'Request Error',
    [ERROR_TYPES.API_UNAUTHORIZED]: 'Unauthorized',
    [ERROR_TYPES.API_FORBIDDEN]: 'Access Denied',
    [ERROR_TYPES.API_NOT_FOUND]: 'Not Found',
    [ERROR_TYPES.WALLET_NOT_AVAILABLE]: 'Wallet Error',
    [ERROR_TYPES.CREDENTIALS_NOT_FOUND]: 'No Credentials',
    [ERROR_TYPES.VALIDATION]: 'Validation Error',
    [ERROR_TYPES.UNKNOWN]: 'Error'
};

/**
 * Standardizes any error into a StandardError object
 */
export const standardizeError = (
    error: any, 
    options: ErrorHandlingOptions = {}
): StandardError => {
    const { context, fallbackMessage } = options;
    
    // Determine error type
    let errorType: string = ERROR_TYPES.UNKNOWN;
    let message = fallbackMessage || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
    
    // Handle different error types
    if (error?.response?.status) {
        // HTTP error
        const status = error.response.status;
        errorType = HTTP_STATUS_TO_ERROR_TYPE[status] || 
                   (status >= 400 && status < 500 ? ERROR_TYPES.API_CLIENT : ERROR_TYPES.API_SERVER);
        message = ERROR_MESSAGES[errorType] || error?.response?.data?.message || message;
    } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        // Network error
        errorType = ERROR_TYPES.API_NETWORK;
        message = ERROR_MESSAGES[ERROR_TYPES.API_NETWORK];
    } else if (error?.code === 'TIMEOUT' || error?.message?.includes('timeout')) {
        // Timeout error
        errorType = ERROR_TYPES.API_TIMEOUT;
        message = ERROR_MESSAGES[ERROR_TYPES.API_TIMEOUT];
    } else if (error?.message?.includes('Wallet ID not available')) {
        // Wallet error
        errorType = ERROR_TYPES.WALLET_NOT_AVAILABLE;
        message = ERROR_MESSAGES[ERROR_TYPES.WALLET_NOT_AVAILABLE];
    } else if (error?.message?.includes('No matching credentials')) {
        // Credentials error
        errorType = ERROR_TYPES.CREDENTIALS_NOT_FOUND;
        message = ERROR_MESSAGES[ERROR_TYPES.CREDENTIALS_NOT_FOUND];
    } else if (error?.message) {
        // Generic error with message
        message = error.message;
    }
    
    return {
        code: errorType,
        message,
        context,
        originalError: error,
        timestamp: new Date()
    };
};

/**
 * Logs error with consistent format
 */
export const logError = (error: StandardError, options: ErrorHandlingOptions = {}): void => {
    if (options.logError === false) return;
    
    const logData = {
        code: error.code,
        message: error.message,
        context: error.context,
        timestamp: error.timestamp.toISOString(),
        originalError: error.originalError
    };
    
    console.error(`[${error.code}] ${error.message}`, logData);
};

/**
 * Creates a user-friendly error display object
 */
export const createUserError = (error: StandardError) => ({
    title: ERROR_TITLES[error.code] || 'Error',
    message: error.message,
    code: error.code
});

/**
 * Standard error handling wrapper for async functions
 */
export const withErrorHandling = async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlingOptions = {}
): Promise<{ data?: T; error?: StandardError }> => {
    try {
        const data = await asyncFn();
        return { data };
    } catch (error) {
        const standardError = standardizeError(error, options);
        logError(standardError, options);
        return { error: standardError };
    }
};
