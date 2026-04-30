import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function useTranslation() {
  const { dictionary } = useLanguage();

  const t = useCallback((text) => {
    if (!text) return text;
    // If not in dictionary yet, fallback to english original text
    return dictionary[text] || text;
  }, [dictionary]);

  return { t };
}
