import { useState, useCallback } from 'react';
import { 
    standardizeError, 
    logError, 
    createUserError, 
    StandardError,
    ErrorHandlingOptions 
} from '../utils/errorHandling';

export interface ApiErrorHandlerReturn {
    showErrorCard: boolean;
    errorCardMessage: string;
    errorTitle: string;
    handleApiError: (error: any, context: string, options?: ErrorHandlingOptions) => void;
    handleCloseErrorCard: () => void;
    clearError: () => void;
}

export const useApiErrorHandler = (onClose?: () => void): ApiErrorHandlerReturn => {
    const [showErrorCard, setShowErrorCard] = useState<boolean>(false);
    const [errorCardMessage, setErrorCardMessage] = useState<string>('');
    const [errorTitle, setErrorTitle] = useState<string>('');

    const handleApiError = useCallback((
        error: any, 
        context: string, 
        options: ErrorHandlingOptions = {}
    ) => {
        const standardError = standardizeError(error, { 
            context, 
            ...options 
        });
        
        // Log the error
        logError(standardError, { context, ...options });
        
        // Create user-friendly error display
        const userError = createUserError(standardError);
        
        setErrorTitle(userError.title);
        setErrorCardMessage(userError.message);
        setShowErrorCard(true);
    }, []);

    const handleCloseErrorCard = useCallback(() => {
        setShowErrorCard(false);
        setErrorCardMessage('');
        setErrorTitle('');
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const clearError = useCallback(() => {
        setShowErrorCard(false);
        setErrorCardMessage('');
        setErrorTitle('');
    }, []);

    return {
        showErrorCard,
        errorCardMessage,
        errorTitle,
        handleApiError,
        handleCloseErrorCard,
        clearError
    };
};