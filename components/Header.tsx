'use client';

import Logo from './Logo';
import LanguageSelector, { useLanguage } from './LanguageSelector';

export default function Header() {
  const { locale } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <Logo />
          </div>
          
          {/* Badge di credibilità */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {locale === 'it' ? '50,000+ trader protetti' : '50,000+ traders protected'}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {locale === 'it' ? 'Funzioni' : 'Features'}
            </a>
            <a 
              href="#testimonials" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {locale === 'it' ? 'Testimonianze' : 'Testimonials'}
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {locale === 'it' ? 'Prezzi' : 'Pricing'}
            </a>
          </nav>
          
          <LanguageSelector />
          
          <a 
            href="/dashboard" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {locale === 'it' ? 'Inizia Gratis' : 'Start Free'}
          </a>
        </div>
      </div>
    </header>
  );
}