
import { mockLocalStorage } from '../../utils/mockUtils';
import { storage } from '../../utils/storage';

describe('Storage Module', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    localStorageMock = mockLocalStorage();
    jest.clearAllMocks();
  });

  it('should not set an item if value is undefined', () => {
    const key = 'testKey';
    const value = undefined;
    storage.setItem(key, value as any);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
  
});