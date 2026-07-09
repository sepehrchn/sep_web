import { useContext } from 'react';
import { LANGUAGES, Language, I18nContext } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function LanguageSwitcher() {
  const context = useContext(I18nContext);
  
  if (!context) {
    return null;
  }

  const { language, setLanguage } = context;
  const { t } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe size={16} className="text-white" />
      <select
        value={language}
        onChange={handleLanguageChange}
        className="bg-transparent text-sm text-white border border-white/30 rounded px-2 py-1 cursor-pointer hover:text-white/90 transition-colors"
        aria-label={t ? t('nav.languageSelect') : 'Select language'}
      >
        {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES[Language]][]).map(([lang, info]) => (
          <option key={lang} value={lang} className="bg-bg-card text-text-primary">
            {info.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
