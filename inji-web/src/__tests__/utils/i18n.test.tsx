import { initReactI18next } from 'react-i18next';
import { mockI18n, mockWindowEnv, mockStorageModule } from '../../utils/mockUtils';
import en from '../../locales/en.json';
import fr from '../../locales/fr.json';
import ta from '../../locales/ta.json';
import hi from '../../locales/hi.json';
import kn from '../../locales/kn.json';
import ar from '../../locales/ar.json';

// Initializing the mocks
mockStorageModule();
mockWindowEnv();

// Importing the mocked storage after setting up the mock
import { storage as mockStorage } from '../../utils/storage';

describe('i18n configuration', () => {
  let i18nModule: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).window._env_ = { DEFAULT_LANG: 'en' };
    jest.isolateModules(() => {
      i18nModule = require('../../utils/i18n');
    });
  });

  it('should initialize i18n with the correct configuration when a language is selected', async () => {
    const selectedLanguage = 'ar';
    (mockStorage.getItem as jest.Mock).mockReturnValue(selectedLanguage);

    await i18nModule.initializeI18n();

    expect(mockStorage.getItem).toHaveBeenCalledWith(mockStorage.SELECTED_LANGUAGE);
    expect(mockI18n.use).toHaveBeenCalledWith(expect.objectContaining({
      init: expect.any(Function)
    }));
    expect(mockI18n.init).toHaveBeenCalledWith(expect.objectContaining({
      resources: { en, ta, kn, hi, fr, ar },
      lng: selectedLanguage,
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    }));
  });

  it('should initialize i18n with the default language when no language is selected', async () => {
    (mockStorage.getItem as jest.Mock).mockReturnValue(null);

    await i18nModule.initializeI18n();

    expect(mockStorage.getItem).toHaveBeenCalledWith(mockStorage.SELECTED_LANGUAGE);
    expect(mockI18n.init).toHaveBeenCalledWith(expect.objectContaining({
      resources: { en, ta, kn, hi, fr, ar },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    }));
  });


  it('should switch language and store it in localStorage', async () => {
    const newLanguage = 'ta';
    await i18nModule.switchLanguage(newLanguage);

    expect(mockStorage.setItem).toHaveBeenCalledWith(mockStorage.SELECTED_LANGUAGE, newLanguage);
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith(newLanguage);
  });

  it('should get the correct object for the current language', () => {
    const displayArray = [
      { language: 'en', locale: 'en', value: 'Hello' },
      { language: 'fr', locale: 'fr', value: 'Bonjour' }
    ];

    const result = i18nModule.getObjectForCurrentLanguage(displayArray, 'fr');
    expect(result).toEqual({ language: 'fr', locale: 'fr', value: 'Bonjour' });

    const fallbackResult = i18nModule.getObjectForCurrentLanguage(displayArray, 'es');
    expect(fallbackResult).toEqual({ language: 'en', locale: 'en', value: 'Hello' });
  });

  it('should return the correct text direction for the current language', () => {
    expect(i18nModule.getDirCurrentLanguage('ar')).toBe('rtl');
    expect(i18nModule.getDirCurrentLanguage('en')).toBe('ltr');
  });

  it('should correctly identify RTL languages', () => {
    expect(i18nModule.isRTL('ar')).toBe(true);
    expect(i18nModule.isRTL('en')).toBe(false);
  });

  it('should have the correct LanguagesSupported array', () => {
    expect(i18nModule.LanguagesSupported).toEqual([
      { label: "English", value: 'en' },
      { label: "தமிழ்", value: 'ta' },
      { label: "ಕನ್ನಡ", value: 'kn' },
      { label: "हिंदी", value: 'hi' },
      { label: "Français", value: 'fr' },
      { label: "عربي", value: 'ar' }
    ]);
  });

  it('should use the correct default language', () => {
    expect(i18nModule.defaultLanguage).toBe('en');
  });
});