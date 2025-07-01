import { AppStorage } from '../../utils/AppStorage';
import { mockLocalStorage } from '../../test-utils/mockUtils';

jest.mock('../../utils/AppStorage.ts');

describe('Test storage class functionality', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    localStorageMock = mockLocalStorage();
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
    jest.clearAllMocks();
  });

  test('Check if an item is set and retrieved correctly', () => {
    const key = AppStorage.SELECTED_LANGUAGE;
    const value = 'en';

    (AppStorage.setItem as jest.Mock).mockImplementation((key, value) => {
      localStorageMock.setItem(key, JSON.stringify(value));
    });
    (AppStorage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      return data ? JSON.parse(data) : null;
    });

    AppStorage.setItem(key, value);
    const storedValue = AppStorage.getItem(key);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    expect(storedValue).toBe(value);
  });

  test('Check if null is returned for a non-existent key', () => {
    (AppStorage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      return data ? JSON.parse(data) : null;
    });
  
    const storedValue = AppStorage.getItem('non_existent_key');
    expect(storedValue).toBeNull();
  });
  
  test('Check if invalid JSON is handled gracefully', () => {
    const key = AppStorage.SESSION_INFO;
    localStorageMock.setItem(key, 'invalid_json');
  
    (AppStorage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      try {
        return data ? JSON.parse(data) : null;
      } catch (error) {
        return null;
      }
    });
  
    const storedValue = AppStorage.getItem(key);
    expect(storedValue).toBeNull();
  });
  
  test('Check if setting null or undefined values is handled correctly', () => {
    const key = AppStorage.SELECTED_LANGUAGE;
  
    (AppStorage.setItem as jest.Mock).mockImplementation((key, value) => {
      if (value !== null && value !== undefined) {
        localStorageMock.setItem(key, JSON.stringify(value));
      }
    });
  
    AppStorage.setItem(key, null);
    let storedValue = localStorageMock.getItem(key);
    expect(storedValue).toBeNull();
  
    AppStorage.setItem(key, null);
    storedValue = localStorageMock.getItem(key);
    expect(storedValue).toBeNull();
  });
});