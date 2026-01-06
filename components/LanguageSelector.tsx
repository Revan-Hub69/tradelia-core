'use client';

import { useState, createContext, useContext, useEffect, useRef } from 'react';
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

const languages = {
  it: { name: 'Italiano', code: 'IT' },
  en: { name: 'English', code: 'EN' }
} as const;

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          const items = dropdownRef.current?.querySelectorAll('button');
          if (items) {
            const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
            const nextIndex = event.key === 'ArrowDown' 
              ? (currentIndex + 1) % items.length
              : (currentIndex - 1 + items.length) % items.length;
            items[nextIndex]?.focus();
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const currentLanguage = languages[locale];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-subtle rounded hover:bg-muted/30 focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
        aria-label={`Current language: ${currentLanguage.name}. Click to change language`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-xs uppercase tracking-wide font-medium">
          {currentLanguage.code}
        </span>
        <span className="text-sm">
          {currentLanguage.name}
        </span>
        <svg 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            ref={dropdownRef}
            className="absolute right-0 top-full mt-1 py-1 bg-background border border-border/50 rounded shadow-lg z-20 min-w-[140px]"
            role="listbox"
            aria-label="Select language"
          >
            {Object.entries(languages).map(([langCode, lang]) => {
              const isSelected = langCode === locale;
              return (
                <button
                  key={langCode}
                  onClick={() => handleLocaleChange(langCode as Locale)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLocaleChange(langCode as Locale);
                    }
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-subtle rounded-sm flex items-center gap-3 ${
                    isSelected 
                      ? 'text-foreground font-medium bg-muted/30' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20 focus:bg-muted/20 focus:text-foreground'
                  } focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-inset`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                >
                  <span className="text-xs uppercase tracking-wide font-medium min-w-[20px]">
                    {lang.code}
                  </span>
                  <span className="flex-1">
                    {lang.name}
                  </span>
                  {isSelected && (
                    <svg 
                      className="w-4 h-4 text-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}