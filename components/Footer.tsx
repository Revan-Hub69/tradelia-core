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
    <footer className="border-t border-border/50 bg-muted/30" role="contentinfo">
      <div className="container-responsive py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            {dictionary.footer.copyright}
          </p>
          
          {/* Footer links */}
          <nav className="flex items-center gap-4 text-xs" aria-label="Link footer">
            <a 
              href={`/${locale}/privacy`} 
              className="link-internal"
              rel="nofollow"
            >
              {dictionary.footer.privacy}
            </a>
            <a 
              href={`/${locale}/disclaimer`} 
              className="link-internal"
              rel="nofollow"
            >
              {dictionary.footer.disclaimer}
            </a>
            <a 
              href={`/${locale}/contatti`} 
              className="link-internal"
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