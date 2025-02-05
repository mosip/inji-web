import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { reduxStore } from '../redux/reduxStore';

// Mock for storage module
export const mockStorageModule = () => {
    jest.mock('../utils/storage.ts', () => ({
        storage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            SESSION_INFO: 'SESSION_INFO',
            SELECTED_LANGUAGE: 'selectedLanguage'
        }
    }));
};

// Mock for localStorage
export const mockLocalStorage = () => {
    let store: { [key: string]: string } = {};
  
    const localStorageMock = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      })
    };
  
    Object.defineProperty(window, 'localStorage', { 
      value: localStorageMock,
      writable: true
    });
  
    return localStorageMock;
  };

// API Mock
export const mockApi = {
    authorizationRedirectionUrl: 'http://mockurl.com'
};

// Crypto Mock
export const mockCrypto = {
    getRandomValues: (array: Uint32Array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = 4294967296;
        }
        return array;
    },
    subtle: {} as SubtleCrypto,
    randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
} as Crypto;

export const mockUseTranslation = () => {
    jest.mock('react-i18next', () => ({
        useTranslation: () => ({
            t: (key: string) => key,
        }),
    }));
};

export const mockUseNavigate = () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: mockNavigate,
    }));
};

export const mockUseSelector = () => {
    jest.mock('react-redux', () => ({
        ...jest.requireActual('react-redux'),
        useSelector: jest.fn(),
    }));
};

export const setMockUseSelectorState = (state: any) => {
    const useSelectorMock = require('react-redux').useSelector;
    useSelectorMock.mockImplementation((selector: any) => selector(state));
};

export const mockUseGetObjectForCurrentLanguage = () => {
    jest.mock('../utils/i18n', () => ({
        getObjectForCurrentLanguage: jest.fn(),
    }));
};

export const wrapUnderRouter = (children: React.ReactNode) => {
    return <Router>{children}</Router>;
};

export const mockUseSearchCredentials = () => {
    jest.mock('../components/Credentials/SearchCredential', () => ({
        SearchCredential: () => <></>,
    }));
 };

export const mockUseDispatch = () => {
    jest.mock('react-redux', () => ({
        ...jest.requireActual('react-redux'),
        useDispatch: jest.fn(),
    }));
};
              
export const mockUseSpinningLoader = () => {
    jest.mock('../components/Common/SpinningLoader', () => ({
        SpinningLoader: () => <></>,
    }));
};

export const mockUseLanguageSelector = () => {
    jest.mock('../components/Common/LanguageSelector', () => ({
        LanguageSelector: () => <></>,
    }));
};

interface RenderWithProviderOptions extends Omit<RenderOptions, 'queries'> {}

export const renderWithProvider = (element: ReactElement, options?: RenderWithProviderOptions) => {
    return render(
        <Provider store={reduxStore}>
            <Router>
                {element}
            </Router>
        </Provider>,
        options
    );
};
    
export const mockUseParams = ()=>{
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({ issuerId: 'test-issuer-id' }),
      }));   
};

export const mockUseapiObject = () =>{
    jest.mock('../utils/api', () => ({
        api: {
          mimotoHost: 'http://mocked-api-host',
        },
      }));
};

export const mockUseFetch = () =>{
    jest.mock('../hooks/useFetch', () => {
        const RequestStatus = {
          LOADING: 'LOADING',
          DONE: 'DONE',
          ERROR: 'ERROR',
        };
        return {
          useFetch: () => jest.fn(),
          RequestStatus,
        };
      });
};

export const mockUseToast = () =>{
    jest.mock('react-toastify', () => ({
      toast: {
        error: jest.fn(),
      },
    }));
};

export const mockusemisc = ()=>{
    jest.mock('../utils/misc', () => ({
        downloadCredentialPDF: jest.fn(),
        getErrorObject: jest.fn(),
        getTokenRequestBody: jest.fn(),
      }));
};

export const mockusei18n = ()=>{
    jest.mock('react-i18next', () => ({
        useTranslation: () => ({
          t: (key: string) => key,
        }),
        initReactI18next: {
          type: '3rdParty',
          init: jest.fn(),
        },
      }));

};

export const mockWindowLocation = (url: string) => {
    const location = new URL(url) as unknown as Location;
    Object.defineProperty(window, 'location', {
      value: location,
      writable: true,
    });
  };

export const renderWithRouter = (Element: React.ReactElement, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <BrowserRouter>
        <Provider store={reduxStore}>
          <Routes>
            <Route path="*" element={Element} />
          </Routes>
        </Provider>
      </BrowserRouter>
    );
  };

