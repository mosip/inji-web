import { addNewSession, getAllActiveSession, getActiveSession, removeActiveSession } from '../../utils/sessions';
import {mockStorageModule } from '../../test-utils/mockUtils';
import { SessionObject } from '../../types/data';

// Set up the storage mock before the tests run
mockStorageModule();

// Import the mocked storage after setting up the mock
import { storage as mockStorage } from '../../utils/storage';

describe('Session Management', () => {
  const mockSession: SessionObject = {
    selectedIssuer: undefined,
    certificateId: 'cert123',
    codeVerifier: 'verifier123',
    vcStorageExpiryLimitInTimes: 3600,
    state: 'state123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add a new session', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([]));
    addNewSession(mockSession);
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      mockStorage.SESSION_INFO,
      JSON.stringify([mockSession])
    );
  });

  test('should get all active sessions', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([mockSession]));
    const sessions = getAllActiveSession();
    expect(sessions).toEqual([mockSession]);
  });

  test('should get an active session by state', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([mockSession]));
    const session = getActiveSession('state123');
    expect(session).toEqual(mockSession);
  });

  test('should return an empty object if no active session is found', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([]));
    const session = getActiveSession('state456');
    expect(session).toEqual({});
  });

  test('should remove an active session by state', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([mockSession]));
    removeActiveSession('state123');
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      mockStorage.SESSION_INFO,
      JSON.stringify([])
    );
  });
});