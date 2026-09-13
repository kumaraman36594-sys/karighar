import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language } from '../types';

import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import ta from '../i18n/ta.json';
import te from '../i18n/te.json';
import bn from '../i18n/bn.json';
import mr from '../i18n/mr.json';
import gu from '../i18n/gu.json';
import kn from '../i18n/kn.json';

const DICTIONARIES: Record<Language, Record<string, string>> = {
  en,
  hi,
  ta,
  te,
  bn,
  mr,
  gu,
  kn,
};

const STORAGE_KEY = 'karighar_language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  hasChosenLanguage: boolean;
  setHasChosenLanguage: (chosen: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && DICTIONARIES[stored]) {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'hi';
  });

  const [hasChosenLanguage, setHasChosenLanguageState] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setHasChosenLanguageState(true);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const setHasChosenLanguage = (chosen: boolean) => {
    setHasChosenLanguageState(chosen);
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      const dict = DICTIONARIES[language] || DICTIONARIES.hi;
      if (dict && dict[key]) {
        return dict[key];
      }
      if (DICTIONARIES.hi && DICTIONARIES.hi[key]) {
        return DICTIONARIES.hi[key];
      }
      if (DICTIONARIES.en && DICTIONARIES.en[key]) {
        return DICTIONARIES.en[key];
      }
      return fallback || key;
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        hasChosenLanguage,
        setHasChosenLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
