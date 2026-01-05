import { type Locale } from '@/lib/i18n';

interface FooterProps {
  dictionary: {
    footer: {
      copyright: string;
      privacy: string;
      disclaimer: string;
      contacts: string;
    };
  };
  locale: Locale;
}

export default function Footer({ dictionary, locale }: FooterProps) {
  return (
    <footer className="border-t bg-muted/50" role="contentinfo">
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {dictionary.footer.copyright}
          </p>
          
          <nav className="flex items-center gap-6 text-sm" aria-label="Link footer">
            <div className="flex items-center gap-2 text-success-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="font-medium">SSL Secured</span>
            </div>
            
            <a
              href={`/${locale}/privacy`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              rel="nofollow"
            >
              {dictionary.footer.privacy}
            </a>
            <a
              href={`/${locale}/disclaimer`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              rel="nofollow"
            >
              {dictionary.footer.disclaimer}
            </a>
            <a
              href={`/${locale}/contatti`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {dictionary.footer.contacts}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}