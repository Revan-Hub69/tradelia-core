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
    <header className="sticky top-0 z-50 glass border-b border-border/30 transition-all duration-300">
      <div className="container-responsive">
        <div className="flex h-15 items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-8">
            <nav className="hidden sm:flex items-center gap-8">
              <a 
                href="#metodologia" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 relative group"
              >
                {dictionary.nav.methodology}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-600 transition-all duration-300 group-hover:w-full" />
              </a>
              <a 
                href="#verifica" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 relative group"
              >
                {dictionary.nav.verify}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-600 transition-all duration-300 group-hover:w-full" />
              </a>
            </nav>
            
            <LanguageSelector currentLocale={locale} />
          </div>
        </div>
      </div>
      
      {/* Subtle gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}