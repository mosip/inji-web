import { addNewSession, getAllActiveSession, getActiveSession, removeActiveSession } from '../../utils/sessions';
import { mockStorageModule } from '../../test-utils/mockUtils';
import { SessionObject } from '../../types/data';

// Set up the storage mock before the tests run
jest.mock('../../utils/storage');
mockStorageModule();

// Import the mocked storage after setting up the mock
import { storage as mockStorage } from '../../utils/storage';

describe('Test Session Management Functions', () => {
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

  test('Check if a new session is added correctly', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([]));
    addNewSession(mockSession);
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      mockStorage.SESSION_INFO,
      JSON.stringify([mockSession])
    );
  });

  test('Check if all active sessions are retrieved correctly', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([mockSession]));
    const sessions = getAllActiveSession();
    expect(sessions).toEqual([mockSession]);
  });

  test('Check if an active session is retrieved correctly by state', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([mockSession]));
    const session = getActiveSession('state123');
    expect(session).toEqual(mockSession);
  });

  test('Check if an empty object is returned when no active session is found', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([]));
    const session = getActiveSession('state456');
    expect(session).toEqual({});
  });

  test('Check if an active session is removed correctly by state', () => {
    (mockStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([mockSession]));
    removeActiveSession('state123');
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      mockStorage.SESSION_INFO,
      JSON.stringify([])
    );
  });
});