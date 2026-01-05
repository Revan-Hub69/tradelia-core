'use client';

import { useState } from 'react';
import { locales, type Locale, getDictionary } from '@/lib/i18n';

interface LanguageSelectorProps {
  currentLocale: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

export default function LanguageSelector({ currentLocale, onLocaleChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (locale: Locale) => {
    setIsOpen(false);
    if (onLocaleChange) {
      onLocaleChange(locale);
    } else {
      // Fallback: reload page with new locale
      window.location.href = `/${locale}`;
    }
  };

  const getLanguageName = (locale: Locale) => {
    const names = {
      it: 'Italiano',
      en: 'English'
    };
    return names[locale];
  };

  return (
    <div className="language-selector relative" suppressHydrationWarning>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 border border-gray-300 rounded-md hover:bg-gray-50 relative group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Lingua corrente: ${getLanguageName(currentLocale)}. Clicca per cambiare lingua`}
      >
        <span className="font-medium uppercase">{currentLocale}</span>
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 14 14" 
          fill="none"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path 
            d="M3.5 5.25L7 8.75L10.5 5.25" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[120px]">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                  locale === currentLocale 
                    ? 'text-primary-600 font-medium bg-primary-50' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="uppercase font-medium">{locale}</span>
                <span className="ml-2 text-xs">{getLanguageName(locale)}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}