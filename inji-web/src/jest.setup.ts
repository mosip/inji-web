// jest.setup.ts

import { mockStorageModule, mockLocalStorage } from './utils/mockUtils';

// Calling the mock functions to set up the mocks
mockStorageModule();
mockLocalStorage();

// Ensuring that localStorage is available globally
Object.defineProperty(global, 'localStorage', {
  value: localStorage,
  writable: true
});

