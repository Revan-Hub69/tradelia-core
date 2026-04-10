import Link from 'next/link';
import { useTheme } from '@/app/hooks/theme';
import { useLocale } from '@/app/hooks/locale';

export default function Header() {
  const { darkMode } = useTheme();
  const { locale, locales } = useLocale();

  return (
    <header className="fixed top-0 left-0 w-full bg-neutral-50 border-b border-neutral-200 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v1 MuhundredM" />
          </svg>
          <span className="text-lg font-semibold text-tradeblue">Tradelia</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {[...locales].map((l, i) => (
            <Link key={i} href={`/${l}`} className="text-sm text-gray-600 hover:text-tradeblue transition-colors">
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Mobile Nav Button */}
        <button className="md:hidden text-gray-600 hover:text-tradeblue focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Theme / Locale Switcher */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full text-gray-600 hover:text-tradeblue transition-colors">
            {darkMode ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12h.01M21 12h-.01M12 3v2m0 14v2m-8-10C5.943 7 5 7.943 5 9c0 5.554 3.844 10.743 9 16 5.156-5.257 9-10.446 9-16 0-6.058-3.942-11-9-11zm0 12c-1.657 0-3-.893-3-2h4c0 1.105.894 2 2 2h4c1.105 0 2-.895 2-2v-4c0-1.105-.894-2-2-2h-4c-1.657 0-3 .893-3 2h4c0 1.105.894 2 2 2z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12h.01M21 12h-.01M12 3v2m0 14v2m-8-10C5.943 7 5 7.943 5 9c0 5.554 3.844 10.743 9 16 5.156-5.257 9-10.446 9-16 0-6.058-3.942-11-9-11z" />
              </svg>
            )}
          </button>

          <button className="p-2 rounded-full text-gray-600 hover:text-tradeblue transition-colors">
            {locale === 'en' ? 'EN' : 'IT'}
          </button>
        </div>
      </div>
    </header>
  );
}