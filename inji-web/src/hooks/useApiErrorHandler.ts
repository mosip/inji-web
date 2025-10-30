import { useState, useCallback, useRef } from 'react';
import { useTranslation } from "react-i18next";
import {
    ERROR_TYPES,
    standardizeError,
    logError,
    StandardError,
} from '../utils/errorHandling';

export interface RetryConfig {
    retryableErrorCodes?: string[];
    onClose?: () => void;
}

export interface UseApiErrorHandlerReturn {
    showError: boolean;

    isRetrying: boolean;
    errorTitle?: string;
    errorDescription?: string;

    // The two possible actions. Only one will be defined at a time.
    onRetry?: () => Promise<void>;
    onClose?: () => void;

    handleApiError: (
        error: any,
        context: string,
        retryFn?: () => Promise<any>,
        onRetrySuccess?: () => void
    ) => void;
    clearError: () => void;
}

const TECHNICAL_ERROR_CODES = [
    "API_NETWORK",
    "API_UNAUTHORIZED",
    "API_SERVER"
];

const DEFAULT_RETRY_CODES = Object.values(ERROR_TYPES).filter(
    code => !TECHNICAL_ERROR_CODES.includes(code)
);

export const useApiErrorHandler = (
    retryConfig: RetryConfig = {}
): UseApiErrorHandlerReturn => {
    const { t } = useTranslation("VerifierTrustPage");
    const {
        retryableErrorCodes = DEFAULT_RETRY_CODES,
        onClose: onFinalClose,
    } = retryConfig;

    const [showError, setShowError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | undefined>();
    const [errorDescription, setErrorDescription] = useState<string | undefined>();
    const [isRetryable, setIsRetryable] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    const retryFnRef = useRef<(() => Promise<any>) | null>(null);
    const onRetrySuccessRef = useRef<(() => void) | null>(null);

    const clearError = useCallback(() => {
        setShowError(false);
        setErrorTitle(undefined);
        setErrorDescription(undefined);
        setIsRetryable(false);
        setIsRetrying(false);
        retryFnRef.current = null;
        onRetrySuccessRef.current = null;
    }, []);

    const internalOnClose = useCallback(() => {
        clearError();
        if (onFinalClose) onFinalClose();
    }, [clearError, onFinalClose]);

    const handleApiError = useCallback(
        (
            error: any,
            context: string,
            retryFn?: () => Promise<any>,
            onRetrySuccess?: () => void
        ) => {
            const stdError: StandardError = standardizeError(error, { context });
            const isTechnicalError = TECHNICAL_ERROR_CODES.includes(stdError.code);
            logError(stdError, { context });

            if (isTechnicalError) {
                setErrorTitle(t("ErrorCard.technicalTitle"));
                setErrorDescription(t("ErrorCard.technicalDescription"));
            } else {
                setErrorTitle(t("ErrorCard.defaultTitle"));
                setErrorDescription(t("ErrorCard.defaultDescription"));
            }

            const isRetryableError = retryableErrorCodes.includes(stdError.code);

            // Set the modal to show
            setShowError(true);

            // If not retryable OR no retry function provided, set as final error
            if (!isRetryableError || !retryFn) {
                retryFnRef.current = null;
                onRetrySuccessRef.current = null;
                setIsRetryable(false); // This is a final error
            } else {
                // This is a retryable error
                retryFnRef.current = retryFn;
                onRetrySuccessRef.current = onRetrySuccess || null;
                setIsRetryable(true);
            }
        },
        [retryableErrorCodes, t]
    );

    const internalOnRetry = useCallback(async () => {
        const apiCallToRetry = retryFnRef.current;
        if (!apiCallToRetry || isRetrying) return;

        setIsRetrying(true);
        setShowError(false);

        try {
            const response = await apiCallToRetry();
            if (response.ok()) {
                const onRetrySuccess = onRetrySuccessRef.current;
                clearError();
                onRetrySuccess?.();
                return;
            }

            // If retry failed, show a FINAL error
            const retryError = response.error || new Error('Retry API failure');
            handleApiError(retryError, 'retryHandler');
        } catch (err) {
            // If retry failed, show a FINAL error
            handleApiError(err, 'retryHandler');
        } finally {
            setIsRetrying(false);
        }
    }, [clearError, handleApiError, isRetrying]);

    return {
        showError,
        isRetrying,
        errorTitle,
        errorDescription,

        // Only return the function that is currently active
        onRetry: isRetryable ? internalOnRetry : undefined,
        onClose: !isRetryable ? internalOnClose : undefined,

        handleApiError,
        clearError
    };
};