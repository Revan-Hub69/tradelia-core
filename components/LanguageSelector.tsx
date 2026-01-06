'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import { translations, type Locale } from '../lib/translations';

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}>({ 
  locale: 'it', 
  setLocale: () => {}, 
  t: () => '' 
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('it');

  useEffect(() => {
    // Autodetect browser language con safe localStorage access
    const detectLanguage = (): Locale => {
      // Safe localStorage access (può fallire in SSR o private browsing)
      let saved: string | null = null;
      try {
        saved = typeof window !== 'undefined' ? localStorage.getItem('tradelia-language') : null;
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
      
      if (saved && (saved === 'it' || saved === 'en')) {
        return saved as Locale;
      }

      // Safe navigator access
      if (typeof window !== 'undefined' && navigator.language) {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('it')) return 'it';
        if (browserLang.startsWith('en')) return 'en';
      }
      
      // Default fallback
      return 'it';
    };

    setLocale(detectLanguage());
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    // Safe localStorage access
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradelia-language', newLocale);
      }
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

const locales = ['it', 'en'] as const;

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-subtle rounded hover:bg-muted/30"
        aria-label="Seleziona lingua"
      >
        <span className="uppercase tracking-wide">{locale}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 py-1 bg-background border border-border/50 rounded shadow-lg z-20 min-w-[80px]">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full px-3 py-2 text-left text-sm transition-subtle rounded-sm ${
                  loc === locale 
                    ? 'text-foreground font-medium bg-muted/30' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                }`}
              >
                <span className="uppercase tracking-wide">{loc}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}