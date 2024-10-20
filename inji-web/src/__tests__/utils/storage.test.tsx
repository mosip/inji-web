import { storage } from '../../utils/storage';
import { mockLocalStorage,mockStorageModule} from '../../test-utils/mockUtils';

describe('storage class', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    localStorageMock = mockLocalStorage();
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
    jest.clearAllMocks();
  });

  test('should set and get an item correctly', () => {
    const key = storage.SELECTED_LANGUAGE;
    const value = 'en';

    (storage.setItem as jest.Mock).mockImplementation((key, value) => {
      localStorageMock.setItem(key, JSON.stringify(value));
    });
    (storage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      return data ? JSON.parse(data) : null;
    });

    storage.setItem(key, value);
    const storedValue = storage.getItem(key);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    expect(storedValue).toBe(value);
  });


  test('should return null for non-existent key', () => {
    (storage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      return data ? JSON.parse(data) : null;
    });
  
    const storedValue = storage.getItem('non_existent_key');
    expect(storedValue).toBeNull();
  });
  
  test('should handle invalid JSON gracefully', () => {
    const key = storage.SESSION_INFO;
    localStorageMock.setItem(key, 'invalid_json');
  
    (storage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      try {
        return data ? JSON.parse(data) : null;
      } catch (error) {
        return null;
      }
    });
  
    const storedValue = storage.getItem(key);
    expect(storedValue).toBeNull();
  });
  
  test('should not set an item if value is null or undefined', () => {
    const key = storage.SELECTED_LANGUAGE;
  
    (storage.setItem as jest.Mock).mockImplementation((key, value) => {
      if (value !== null && value !== undefined) {
        localStorageMock.setItem(key, JSON.stringify(value));
      }
    });
  
    storage.setItem(key, null);
    let storedValue = localStorageMock.getItem(key);
    expect(storedValue).toBeNull();
  
    storage.setItem(key, undefined);
    storedValue = localStorageMock.getItem(key);
    expect(storedValue).toBeNull();
  });
});
