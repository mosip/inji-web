import { initReactI18next } from 'react-i18next';
import { setReduxState, clearReduxState } from '../../test-utils/reduxMockUtils';
import en from '../../locales/en.json';
import fr from '../../locales/fr.json';
import ta from '../../locales/ta.json';
import hi from '../../locales/hi.json';
import kn from '../../locales/kn.json';
import ar from '../../locales/ar.json';

// Mock i18next
const mockI18n = {
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockResolvedValue(undefined),
  changeLanguage: jest.fn().mockResolvedValue(undefined),
  language: 'en',
  t: jest.fn((key: string) => key),
};

jest.mock('i18next', () => mockI18n);

// Mock react-i18next
jest.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
}));

// Mock storage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  SELECTED_LANGUAGE: 'selectedLanguage',
};

jest.mock('../../utils/storage', () => ({
  storage: mockStorage,
}));

// Mock window
const windowSpy = jest.spyOn(global, 'window', 'get');

describe('Test i18n configuration', () => {
  let i18nModule: any;

  beforeEach(() => {
    jest.clearAllMocks();
    windowSpy.mockClear();
    clearReduxState();
    mockStorage.getItem.mockReset();
    mockStorage.setItem.mockReset();

    windowSpy.mockImplementation(() => ({
      _env_: {
        DEFAULT_LANG: 'en',
      },
    } as Window & typeof globalThis));

    setReduxState({
      language: 'en',
    });

    jest.isolateModules(() => {
      i18nModule = jest.requireActual('../../utils/i18n');
    });
  });

  afterEach(() => {
    jest.resetModules();
    windowSpy.mockRestore();
    clearReduxState();
  });

  describe('Testing initialization process', () => {
    test('Check if it initializes with the selected language', async () => {
      const selectedLanguage = 'ar';
      mockStorage.getItem.mockReturnValue(selectedLanguage);
      
      setReduxState({
        language: selectedLanguage
      });

      await i18nModule.initializeI18n();

      expect(mockStorage.getItem).toHaveBeenCalledWith('selectedLanguage');
      expect(mockI18n.use).toHaveBeenCalledWith(initReactI18next);
      expect(mockI18n.init).toHaveBeenCalledWith(expect.objectContaining({
        resources: { en, ta, kn, hi, fr, ar },
        lng: selectedLanguage,
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
      }));
    });

    test('Check if it initializes with the default language when none is selected', async () => {
      mockStorage.getItem.mockReturnValue(null);
      
      await i18nModule.initializeI18n();

      expect(mockStorage.getItem).toHaveBeenCalledWith('selectedLanguage');
      expect(mockI18n.init).toHaveBeenCalledWith(expect.objectContaining({
        resources: { en, ta, kn, hi, fr, ar },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
      }));
    });
  });

  describe('Test language direction functionality', () => {
    test('Check if it correctly identifies RTL languages', () => {
      expect(i18nModule.isRTL('ar')).toBe(true);
      expect(i18nModule.isRTL('en')).toBe(false);
      expect(i18nModule.isRTL('fr')).toBe(false);
    });

    test('Check if it returns the correct direction for a given language', () => {
      expect(i18nModule.getDirCurrentLanguage('ar')).toBe('rtl');
      expect(i18nModule.getDirCurrentLanguage('en')).toBe('ltr');
    });
  });

  describe('Test language switching functionality', () => {
    test('Check if it stores and changes the language correctly', async () => {
      const newLanguage = 'fr';
      await i18nModule.switchLanguage(newLanguage);
      
      expect(mockStorage.setItem).toHaveBeenCalledWith('selectedLanguage', newLanguage);
      expect(mockI18n.changeLanguage).toHaveBeenCalledWith(newLanguage);
    });
  });

  describe('Test getObjectForCurrentLanguage functionality', () => {
    test('Check if it returns the correct object for the current language', () => {
      const displayArray = [
        { language: 'en', value: 'English' },
        { language: 'fr', value: 'French' }
      ];
      
      const result = i18nModule.getObjectForCurrentLanguage(displayArray, 'fr');
      expect(result).toEqual({ language: 'fr', value: 'French' });
    });

    test('Check if it falls back to the default language when the requested language is not found', () => {
      const displayArray = [
        { language: 'en', value: 'English' },
        { language: 'fr', value: 'French' }
      ];
      
      const result = i18nModule.getObjectForCurrentLanguage(displayArray, 'es');
      expect(result).toEqual({ language: 'en', value: 'English' });
    });
  });
});