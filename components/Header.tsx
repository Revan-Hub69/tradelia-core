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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a 
              href="#metodologia" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dictionary.nav.methodology}
            </a>
            <a 
              href="#verifica" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dictionary.nav.verify}
            </a>
          </nav>
          
          <LanguageSelector currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}