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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <div className="flex h-14 items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6">
              <a 
                href="#metodologia" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dictionary.nav.methodology}
              </a>
              <a 
                href="#verifica" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dictionary.nav.verify}
              </a>
            </nav>
            
            <LanguageSelector currentLocale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}