import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, de } from "./translations";

const { languageDetector } = require("./src/utils/LanguageDetector");


const resources = {
    en: {
      translation: en,
    },
    de: {
      translation: de,
    }
  };

i18n.use(initReactI18next)
.use(languageDetector).init({
  resources,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, 
  },
  react: {
    useSuspense: false, 
  },
});

export default i18n;