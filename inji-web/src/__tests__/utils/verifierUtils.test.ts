import { rejectVerifierRequest, RejectVerifierOptions } from '../../utils/verifierUtils';
import { api } from '../../utils/api';
import { withErrorHandling } from '../../utils/errorHandling';
import { ROUTES } from '../../utils/constants';

// Mock dependencies
jest.mock('../../utils/api', () => ({
    api: {
        userRejectVerifier: {
            url: jest.fn((presentationId: string) => `/wallets/test-wallet/presentations/${presentationId}`),
            methodType: 1,
            headers: jest.fn(() => ({ 'Content-Type': 'application/json' })),
            credentials: 'include'
        }
    }
}));

jest.mock('../../utils/errorHandling', () => ({
    withErrorHandling: jest.fn(async (fn: () => Promise<any>) => {
        try {
            const data = await fn();
            return { data };
        } catch (error) {
            return { error };
        }
    })
}));

describe('verifierUtils', () => {
    const mockFetchData = jest.fn();
    const mockNavigate = jest.fn();
    const mockOnSuccess = jest.fn();

    const defaultOptions: RejectVerifierOptions = {
        presentationId: 'test-presentation-id',
        fetchData: mockFetchData
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetchData.mockResolvedValue({ ok: () => true });
        (withErrorHandling as jest.Mock).mockImplementation(async (fn: () => Promise<any>) => {
            try {
                const data = await fn();
                return { data };
            } catch (error) {
                return { error };
            }
        });
        (api.userRejectVerifier.url as jest.Mock).mockImplementation(
            (presentationId: string) => `/wallets/test-wallet/presentations/${presentationId}`
        );
        
        // Mock window.location.href
        delete (window as any).location;
        (window as any).location = { href: '' };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('rejectVerifierRequest', () => {
        it('should make API call with correct payload', async () => {
            await rejectVerifierRequest(defaultOptions);

            expect(withErrorHandling).toHaveBeenCalledTimes(1);
            expect(mockFetchData).toHaveBeenCalledTimes(1);
            expect(mockFetchData).toHaveBeenCalledWith({
                url: '/wallets/test-wallet/presentations/test-presentation-id',
                apiConfig: api.userRejectVerifier,
                body: {
                    errorCode: 'access_denied',
                    errorMessage: 'User denied authorization to share credentials'
                }
            });
        });

        it('should call onSuccess callback if provided', async () => {
            await rejectVerifierRequest({
                ...defaultOptions,
                onSuccess: mockOnSuccess
            });

            expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        });

        it('should not call onSuccess if not provided', async () => {
            await rejectVerifierRequest(defaultOptions);

            expect(mockOnSuccess).not.toHaveBeenCalled();
        });

        it('should redirect to redirectUri if provided', async () => {
            const redirectUri = 'https://example.com/callback';
            
            await rejectVerifierRequest({
                ...defaultOptions,
                redirectUri
            });

            expect(window.location.href).toBe(redirectUri);
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should navigate to ROOT if navigate is provided and no redirectUri', async () => {
            await rejectVerifierRequest({
                ...defaultOptions,
                navigate: mockNavigate
            });

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
            expect(window.location.href).toBe('');
        });

        it('should prioritize redirectUri over navigate', async () => {
            const redirectUri = 'https://example.com/callback';
            
            await rejectVerifierRequest({
                ...defaultOptions,
                redirectUri,
                navigate: mockNavigate
            });

            expect(window.location.href).toBe(redirectUri);
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should call onSuccess before navigation', async () => {
            const redirectUri = 'https://example.com/callback';
            const callOrder: string[] = [];

            mockOnSuccess.mockImplementation(() => {
                callOrder.push('onSuccess');
            });

            Object.defineProperty(window, 'location', {
                value: {
                    set href(url: string) {
                        callOrder.push('redirect');
                    },
                    get href() {
                        return '';
                    }
                },
                writable: true
            });

            await rejectVerifierRequest({
                ...defaultOptions,
                redirectUri,
                onSuccess: mockOnSuccess
            });

            expect(callOrder).toEqual(['onSuccess', 'redirect']);
        });

        it('should call onSuccess before navigate', async () => {
            const callOrder: string[] = [];

            mockOnSuccess.mockImplementation(() => {
                callOrder.push('onSuccess');
            });

            mockNavigate.mockImplementation(() => {
                callOrder.push('navigate');
            });

            await rejectVerifierRequest({
                ...defaultOptions,
                navigate: mockNavigate,
                onSuccess: mockOnSuccess
            });

            expect(callOrder).toEqual(['onSuccess', 'navigate']);
        });

        it('should handle null redirectUri', async () => {
            await rejectVerifierRequest({
                ...defaultOptions,
                redirectUri: null,
                navigate: mockNavigate
            });

            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
            expect(window.location.href).toBe('');
        });

        it('should not navigate or redirect if neither redirectUri nor navigate is provided', async () => {
            await rejectVerifierRequest(defaultOptions);

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(window.location.href).toBe('');
        });

        it('should use correct presentationId in API call', async () => {
            const customPresentationId = 'custom-presentation-123';
            
            await rejectVerifierRequest({
                ...defaultOptions,
                presentationId: customPresentationId
            });

            expect(api.userRejectVerifier.url).toHaveBeenCalledWith(customPresentationId);
            expect(mockFetchData).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: `/wallets/test-wallet/presentations/${customPresentationId}`,
                    apiConfig: expect.any(Object),
                    body: expect.objectContaining({
                        errorCode: 'access_denied',
                        errorMessage: 'User denied authorization to share credentials'
                    })
                })
            );
        });

        it('should handle withErrorHandling errors gracefully', async () => {
            const error = new Error('API Error');
            (withErrorHandling as jest.Mock).mockImplementationOnce(async (fn: () => Promise<any>) => {
                try {
                    await fn();
                } catch {
                    // Ignore errors from fn
                }
                return { error };
            });

            await rejectVerifierRequest(defaultOptions);

            expect(mockFetchData).toHaveBeenCalled();
            expect(mockOnSuccess).not.toHaveBeenCalled();
        });

        it('should not call onSuccess if API call fails', async () => {
            const error = new Error('API Error');
            (withErrorHandling as jest.Mock).mockImplementationOnce(async (fn: () => Promise<any>) => {
                try {
                    await fn();
                } catch {
                    // Ignore errors from fn
                }
                return { error };
            });

            await rejectVerifierRequest({
                ...defaultOptions,
                onSuccess: mockOnSuccess
            });

            expect(mockOnSuccess).not.toHaveBeenCalled();
        });

        it('should not navigate if API call fails', async () => {
            const error = new Error('API Error');
            (withErrorHandling as jest.Mock).mockImplementationOnce(async (fn: () => Promise<any>) => {
                try {
                    await fn();
                } catch {
                    // Ignore errors from fn
                }
                return { error };
            });

            await rejectVerifierRequest({
                ...defaultOptions,
                navigate: mockNavigate
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});

