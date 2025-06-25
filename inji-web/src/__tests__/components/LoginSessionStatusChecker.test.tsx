import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {useUser} from '../../hooks/User/useUser';
import {useLocation, useNavigate} from 'react-router-dom';
import {Storage} from '../../utils/Storage';
import {KEYS, ROUTES} from '../../utils/constants';
import LoginSessionStatusChecker from "../../components/Common/LoginSessionStatusChecker";

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('../../hooks/User/useUser', () => ({
    useUser: jest.fn(),
}));

jest.mock('../../utils/Storage', () => ({
    Storage: {
        getItem: jest.fn(),
    },
}));

describe('LoginSessionStatusChecker', () => {
    // Setup common mocks
    const mockNavigate = jest.fn();
    const mockRemoveUser = jest.fn();
    const mockFetchUserProfile = jest.fn();

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup default mocks
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useUser as jest.Mock).mockReturnValue({
            removeUser: mockRemoveUser,
            fetchUserProfile: mockFetchUserProfile,
        });
    });

    test('should redirect to passcode page when session is active but no wallet ID', async () => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.CREDENTIALS});
        setupMockActiveSessionInStorage()

        render(<LoginSessionStatusChecker/>);

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PASSCODE)
        )
    });

    test('should redirect to root page when accessing protected route without being logged in', async () => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.CREDENTIALS});
        // Mock storage with no user and no wallet ID
        (Storage.getItem as jest.Mock).mockReturnValue(null);

        render(<LoginSessionStatusChecker/>);

        await waitFor(() => expect(mockRemoveUser).toHaveBeenCalled())
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
    });

    test('should not redirect when user is logged in and accessing protected route', () => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.CREDENTIALS});
        setupMockLoggedInStorage();

        render(<LoginSessionStatusChecker/>);

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test.each([ROUTES.PASSCODE, ROUTES.USER_RESET_PASSCODE])('should not redirect when accessing passcode related route - %s with active session', (route) => {
        (useLocation as jest.Mock).mockReturnValue({pathname: route});
        setupMockActiveSessionInStorage();

        render(<LoginSessionStatusChecker/>);

        expect(mockNavigate).not.toHaveBeenCalled();
    })

    test("should not redirect when accessing non-protected route when session is active", () => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.FAQ});
        setupMockLoggedInStorage()

        render(<LoginSessionStatusChecker/>);

        expect(mockNavigate).not.toHaveBeenCalled();
    })

    test('should fetch user profile on mount', () => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.CREDENTIALS});

        render(<LoginSessionStatusChecker/>);

        expect(mockFetchUserProfile).toHaveBeenCalled();
    });

    test('should add and remove storage event listener', () => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.CREDENTIALS});
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        const {unmount} = render(<LoginSessionStatusChecker/>);

        expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
        unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    });

    test("should redirect to root page when fetching user profile fails", async () => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.CREDENTIALS});
        mockFetchUserProfile.mockRejectedValue(new Error("Fetch failed"));

        render(<LoginSessionStatusChecker/>);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
        });
    })

    test.each([KEYS.USER, KEYS.WALLET_ID])("should recheck on storage change of %s key", async (storageKey) => {
        (useLocation as jest.Mock).mockReturnValue({pathname: ROUTES.CREDENTIALS});
        const mockStorageEvent = new StorageEvent('storage', {
            key: storageKey,
            newValue: undefined
        });
        render(<LoginSessionStatusChecker/>);

        window.dispatchEvent(mockStorageEvent);

        expect(mockFetchUserProfile).toHaveBeenCalled();
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT))
    })

    function setupMockLoggedInStorage() {
        (Storage.getItem as jest.Mock).mockImplementation((key) => {
            if (key === KEYS.USER) return JSON.stringify({username: 'testUser'});
            if (key === KEYS.WALLET_ID) return 'wallet-123';
            return null;
        });
    }

    function setupMockActiveSessionInStorage() {
        (Storage.getItem as jest.Mock).mockImplementation((key) => {
            if (key === KEYS.USER) return JSON.stringify({username: 'testUser'});
            return null;
        });
    }
});