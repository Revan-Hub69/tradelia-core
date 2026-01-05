'use client';

import { useState } from 'react';

const locales = ['it', 'en'] as const;
type Locale = typeof locales[number];

interface LanguageSelectorProps {
  currentLocale?: Locale;
}

export default function LanguageSelector({ currentLocale = 'it' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<Locale>(currentLocale);

  const handleLocaleChange = (locale: Locale) => {
    setSelectedLocale(locale);
    setIsOpen(false);
    // In a real app, this would trigger a route change or context update
    console.log(`Language changed to: ${locale}`);
  };

  const getLanguageName = (locale: Locale) => {
    return locale === 'it' ? 'Italiano' : 'English';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="uppercase">{selectedLocale}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  locale === selectedLocale ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-700'
                }`}
              >
                <span className="uppercase font-medium">{locale}</span>
                <span className="ml-2 text-xs text-gray-500">{getLanguageName(locale)}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}