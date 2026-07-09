import { useContext } from 'react';
import { I18nContext, Language, isRTL as checkRTL } from '@/lib/i18n';
import translations from '@/lib/translations.json';

type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }

  const { language } = context;
  const t = (key: TranslationKey | string, defaultValue?: any): any => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    for (const k of keys) { value = value?.[k]; }
    if (value !== undefined) return value;
    const fallback = translations.en as Record<string, any>;
    let fb: any = fallback;
    for (const k of keys) { fb = fb?.[k]; }
    return fb !== undefined ? fb : defaultValue || key;
  };

  return {
    language,
    t,
    isRTL: checkRTL(language),
  };
}
