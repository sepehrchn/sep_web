import { ReactNode, useEffect, useState } from 'react';
import { I18nContext, Language, isRTL } from '@/lib/i18n';

const STORAGE_KEY = 'preferred-language';

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = 'fa' }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // Load language from cookie (server-friendly) or localStorage on mount
  useEffect(() => {
    // helper to read cookie
    const readCookie = (name: string) => {
      try {
        const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
      } catch (e) {
        return null;
      }
    };

    const savedCookie = readCookie(STORAGE_KEY) as Language | null;
    if (savedCookie && ['en', 'fa'].includes(savedCookie)) {
      setLanguageState(savedCookie);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && ['en', 'fa'].includes(saved)) {
        setLanguageState(saved);
      }
    }

    setMounted(true);
  }, []);

  // Update localStorage, cookie and HTML dir when language changes
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      // ignore
    }

    try {
      // Persist as a cookie so server or pre-hydration script can read it
      // Expires in 1 year
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${STORAGE_KEY}=${encodeURIComponent(
        language
      )}; path=/; max-age=${maxAge}; samesite=lax`;
    } catch (e) {
      // ignore
    }

    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, isRTL: isRTL(language) }}>
      {children}
    </I18nContext.Provider>
  );
}
