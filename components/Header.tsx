import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { type Locale } from '@/lib/i18n';

interface HeaderProps {
  dictionary: {
    nav: {
      methodology: string;
      verify: string;
      home: string;
    };
  };
  locale: Locale;
}

export default function Header({ dictionary, locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm">
      <div className="container flex h-14 items-center">
        <Logo />
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a 
              href="#metodologia" 
              className="transition-all duration-300 hover:text-primary-600 text-muted-foreground relative group"
            >
              {dictionary.nav.methodology}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full" />
            </a>
            <a 
              href="#verifica" 
              className="transition-all duration-300 hover:text-primary-600 text-muted-foreground relative group"
            >
              {dictionary.nav.verify}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>
          
          <LanguageSelector currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}