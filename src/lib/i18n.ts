import { createContext } from 'react';

export type Language = 'en' | 'hy' | 'fa';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const LANGUAGES = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  hy: { name: 'Armenian', nativeName: 'Հայերեն', dir: 'ltr' },
  fa: { name: 'Persian', nativeName: 'فارسی', dir: 'rtl' },
} as const;

export const isRTL = (lang: Language) => LANGUAGES[lang].dir === 'rtl';
