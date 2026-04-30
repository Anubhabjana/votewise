import { createContext, useState, useEffect, useContext } from 'react';
import { translateStrings } from '../services/translation';
import { UI_STRINGS } from '../constants/uiStrings';
import { useDemo } from './DemoContext';

import { LANGUAGES } from '../constants/languages';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { isDemoMode } = useDemo();
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('votewise_lang') || 'en';
  });
  
  const [dictionary, setDictionary] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);

  // When demo mode changes to ON, we force language to 'en'
  useEffect(() => {
    if (isDemoMode) {
      setLanguage('en');
    }
  }, [isDemoMode]);

  useEffect(() => {
    const batchTranslate = async () => {
      // In demo mode or if language is english, we skip translation and map 1:1
      if (isDemoMode || language === 'en') {
        const engDict = {};
        UI_STRINGS.forEach(str => engDict[str] = str);
        setDictionary(engDict);
        setTranslationError(false);
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      setTranslationError(false);
      
      try {
        const translatedArray = await translateStrings(UI_STRINGS, language);
        
        const newDict = {};
        let unchangedCount = 0;
        let translatableCount = 0;
        
        UI_STRINGS.forEach((str, index) => {
          newDict[str] = translatedArray[index] || str;
          // Only count strings that should actually change (skip short/technical terms)
          if (str && str.length > 3 && !/^[A-Z.]+$/.test(str)) {
            translatableCount++;
            if (translatedArray[index] === str) {
              unchangedCount++;
            }
          }
        });
        
        // Only flag error if >80% of translatable strings came back unchanged
        if (translatableCount > 0 && (unchangedCount / translatableCount) > 0.8) {
           setTranslationError(true);
        }

        setDictionary(newDict);
      } catch (err) {
        console.error("Batch translation failed", err);
        setTranslationError(true);
      } finally {
        setIsTranslating(false);
      }
    };

    batchTranslate();
  }, [language, isDemoMode]);

  const changeLanguage = (langCode) => {
    if (isDemoMode) return; // Prevent changing if demo mode is active
    
    setLanguage(langCode);
    localStorage.setItem('votewise_lang', langCode);
    
    const nativeName = LANGUAGES.find(l => l.code === langCode)?.nativeName;
    if (nativeName) {
      // Simple custom event for the toast
      window.dispatchEvent(new CustomEvent('language-changed', { detail: nativeName }));
    }
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      dictionary,
      isTranslating,
      translationError
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
