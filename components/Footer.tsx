'use client';

import Logo from './Logo';

export function Footer() {
  return (
    <footer className="section-sm border-t border-border/50 bg-muted/30">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="space-y-8">
          
          {/* Chi Siamo - Versione Essenziale */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo />
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Metodologia:</strong> Framework da studi peer-reviewed. 
                Nessun cookie, trasparenza sui partner.
              </p>
            </div>
          </div>

          {/* Disclaimer Essenziale */}
          <div className="p-4 rounded border border-border/50 bg-background">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> Strumento educativo, non consulenza finanziaria. 
              Possibili commissioni da partner raccomandati. L'utente rimane responsabile delle proprie decisioni.
            </p>
          </div>

          {/* Links Essenziali */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border/30">
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-subtle link-tech">
                Privacy
              </a>
              <a href="/terms" className="hover:text-foreground transition-subtle link-tech">
                Termini
              </a>
              <a href="/methodology" className="hover:text-foreground transition-subtle link-tech">
                Metodologia
              </a>
              <a href="mailto:info@tradelia.com" className="hover:text-foreground transition-subtle link-tech">
                Contatti
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Tradelia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}