import React from "react";
import { BrowserRouter } from "react-router-dom";

// Mock for react-i18next
export const mockUseTranslation = () => {
    return jest.mock('react-i18next', () => ({
        useTranslation: () => ({
            t: (key: string) => key,
        }),
        initReactI18next: { type: '3rdParty' }
    }));
}

// Mock for react-router-dom
export const mockUseNavigate = () => {
    return jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: jest.fn(),
    }));
}

// Wrapper for components under BrowserRouter
export const wrapUnderRouter = (children: React.ReactNode) => {
    return <BrowserRouter>{children}</BrowserRouter>
}

//Mock for localStorage
export const mockLocalStorage = () => {
    let store: { [key: string]: string } = {};
  
    const localStorageMock = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      })
    };
  
    Object.defineProperty(window, 'localStorage', { 
      value: localStorageMock,
      writable: true
    });
  
    return localStorageMock;
  };


// Mock for storage module
export const mockStorageModule = () => {
    jest.mock('./storage.ts', () => ({
        storage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            SESSION_INFO: 'SESSION_INFO',
            SELECTED_LANGUAGE: 'selectedLanguage'
        }
    }));
};

// Mock for i18next
export const mockI18n = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue(undefined),
    changeLanguage: jest.fn(),
    language: 'en'
};

jest.mock('i18next', () => mockI18n);

// Mock for window._env_
export const mockWindowEnv = () => {
    (global as any).window = {
        _env_: {
            DEFAULT_LANG: 'en'
        }
    };
};

export const mockApi = {
    authorizationRedirectionUrl: 'http://mockurl.com'
};

export const mockCrypto = {
    getRandomValues: (array: Uint32Array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 65536);
        }
        return array;
    },
    subtle: {} as SubtleCrypto, // Mock subtle property
    randomUUID: () => '123e4567-e89b-12d3-a456-426614174000' // Mock UUID in the correct format
} as Crypto;


