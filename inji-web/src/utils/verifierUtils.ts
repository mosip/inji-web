import { api } from "./api";
import { withErrorHandling } from "./errorHandling";
import { ROUTES } from "./constants";
import { UseApiReturn } from "../hooks/useApi";

export interface RejectVerifierOptions {
    presentationId: string;
    fetchData: UseApiReturn<any>["fetchData"];
    redirectUri?: string | null;
    onSuccess?: () => void;
    navigate?: (path: string) => void;
}

/**
 * Shared utility function to reject a verifier request.
 * Makes the API call to reject the verifier and handles post-call behavior.
 * 
 * @param options - Configuration object containing:
 *   - presentationId: The presentation ID to reject
 *   - fetchData: The fetchData function from useApi hook
 *   - redirectUri: Optional redirect URI to navigate to after rejection
 *   - onSuccess: Optional callback to execute after successful API call
 *   - navigate: Optional navigate function (from useNavigate) to navigate to home if no redirectUri
 */
export const rejectVerifierRequest = async (options: RejectVerifierOptions): Promise<void> => {
    const { presentationId, fetchData, redirectUri, onSuccess, navigate } = options;

    const { error } = await withErrorHandling(async () => {
        const cancelPayload = {
            errorCode: "access_denied",
            errorMessage: "User denied authorization to share credentials"
        };

        await fetchData({
            url: api.userRejectVerifier.url(presentationId),
            apiConfig: api.userRejectVerifier,
            body: cancelPayload
        });
    });

    if(error) {
        return;
    }

    if (onSuccess) {
        onSuccess();
    }

    if (redirectUri) {
        window.location.href = redirectUri;
    } else if (navigate) {
        navigate(ROUTES.ROOT);
    }
};

