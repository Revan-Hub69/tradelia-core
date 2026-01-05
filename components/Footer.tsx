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
    <footer className="border-t border-border/30 bg-gradient-to-br from-muted/20 to-muted/40 relative" role="contentinfo">
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container-responsive py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {dictionary.footer.copyright}
          </p>
          
          {/* Footer links */}
          <nav className="flex items-center gap-6 text-sm" aria-label="Link footer">
            <div className="flex items-center gap-2 text-success group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:scale-110">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-medium">SSL Secured</span>
            </div>
            
            <a
              href={`/${locale}/privacy`}
              className="link-internal font-medium"
              rel="nofollow"
            >
              {dictionary.footer.privacy}
            </a>
            <a
              href={`/${locale}/disclaimer`}
              className="link-internal font-medium"
              rel="nofollow"
            >
              {dictionary.footer.disclaimer}
            </a>
            <a
              href={`/${locale}/contatti`}
              className="link-internal font-medium"
            >
              {dictionary.footer.contacts}
            </a>
          </nav>
        </div>
        
        {/* Structured data per SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Tradelia",
              "url": "https://tradelia.com",
              "logo": "https://tradelia.com/favicon.svg",
              "description": dictionary.footer.copyright,
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": `https://tradelia.com/${locale}/contatti`
              }
            })
          }}
        />
      </div>
    </footer>
  );
}