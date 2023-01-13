import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './ko.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: ko,
    },
    en: {
      translation: en,
    },
  },
  lng: process.env.REACT_APP_LANG,
});

export default i18n;
