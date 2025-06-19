import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationVI from './locales/vi/translation.json';
import translationJA from './locales/ja/translation.json';

// Các ngôn ngữ hỗ trợ
const resources = {
  en: {
    translation: translationEN
  },
  vi: {
    translation: translationVI
  },
  ja: {
    translation: translationJA
  }
};

i18n
  // Phát hiện ngôn ngữ tự động
  .use(LanguageDetector)
  // Tích hợp với React
  .use(initReactI18next)
  // Khởi tạo i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // Không cần escape với React
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage'
    }
  });

export default i18n; 