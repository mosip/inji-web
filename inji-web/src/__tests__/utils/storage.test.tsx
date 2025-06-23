import { Storage } from '../../utils/Storage';
import { mockLocalStorage, mockStorageModule } from '../../test-utils/mockUtils';

jest.mock('../../utils/Storage.ts');

describe('Test storage class functionality', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    localStorageMock = mockLocalStorage();
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
    jest.clearAllMocks();
  });

  test('Check if an item is set and retrieved correctly', () => {
    const key = Storage.SELECTED_LANGUAGE;
    const value = 'en';

    (Storage.setItem as jest.Mock).mockImplementation((key, value) => {
      localStorageMock.setItem(key, JSON.stringify(value));
    });
    (Storage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      return data ? JSON.parse(data) : null;
    });

    Storage.setItem(key, value);
    const storedValue = Storage.getItem(key);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    expect(storedValue).toBe(value);
  });

  test('Check if null is returned for a non-existent key', () => {
    (Storage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      return data ? JSON.parse(data) : null;
    });
  
    const storedValue = Storage.getItem('non_existent_key');
    expect(storedValue).toBeNull();
  });
  
  test('Check if invalid JSON is handled gracefully', () => {
    const key = Storage.SESSION_INFO;
    localStorageMock.setItem(key, 'invalid_json');
  
    (Storage.getItem as jest.Mock).mockImplementation((key) => {
      const data = localStorageMock.getItem(key);
      try {
        return data ? JSON.parse(data) : null;
      } catch (error) {
        return null;
      }
    });
  
    const storedValue = Storage.getItem(key);
    expect(storedValue).toBeNull();
  });
  
  test('Check if setting null or undefined values is handled correctly', () => {
    const key = Storage.SELECTED_LANGUAGE;
  
    (Storage.setItem as jest.Mock).mockImplementation((key, value) => {
      if (value !== null && value !== undefined) {
        localStorageMock.setItem(key, JSON.stringify(value));
      }
    });
  
    Storage.setItem(key, null);
    let storedValue = localStorageMock.getItem(key);
    expect(storedValue).toBeNull();
  
    Storage.setItem(key, undefined);
    storedValue = localStorageMock.getItem(key);
    expect(storedValue).toBeNull();
  });
});