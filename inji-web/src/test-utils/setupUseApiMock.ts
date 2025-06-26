import {RequestStatus} from "../utils/constants";

export const mockUseApi = {
    fetchData: jest.fn(),
    state: RequestStatus.LOADING,
    data: null,
    error: null,
    status: null,
    ok: () => false
};

type MockApiResponseOptions = {
    response?: object;
    status?: number | null;
    error?: any;
    headers?: object;
    state?: RequestStatus;
};

export function mockApiResponse({
                                    response = {},
                                    status = 200,
                                    error = null,
                                    headers = {},
                                    state = RequestStatus.DONE,
                                }: MockApiResponseOptions = {}) {
    mockUseApi.fetchData.mockResolvedValueOnce({
        ok: () => status === 200,
        data: response,
        status,
        error,
        headers,
        state
    });
}

export function mockApiResponseSequence(
    responses: MockApiResponseOptions[]
) {
    responses.forEach(
        (mockData) => {
            mockApiResponse(mockData)
        }
    );
}