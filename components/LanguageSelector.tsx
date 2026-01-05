'use client';

import { useState } from 'react';
import { locales, type Locale } from '@/lib/i18n';

interface LanguageSelectorProps {
  currentLocale: Locale;
}

export default function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="language-selector relative" suppressHydrationWarning>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded hover:bg-muted/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Lingua corrente: ${currentLocale === 'it' ? 'Italiano' : 'English'}. Clicca per cambiare lingua`}
      >
        <span className="font-medium uppercase">{currentLocale}</span>
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 14 14" 
          fill="none"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path 
            d="M3.5 5.25L7 8.75L10.5 5.25" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 py-1 bg-background border border-border rounded shadow-lg z-20 min-w-[80px]">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => {
                  setIsOpen(false);
                  console.log(`Lingua selezionata: ${locale}`);
                }}
                className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                  locale === currentLocale 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}