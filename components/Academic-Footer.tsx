'use client';

export const AcademicFooter = () => {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container-academic">
        <div className="section-academic-sm">
          
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            
            {/* Institution Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="text-primary"
                >
                  <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="text-heading">Tradelia</span>
              </div>
              
              <div className="text-body-sm text-muted-foreground mb-4">
                Framework di verifica della coerenza basato su ricerca comportamentale accademica.
              </div>
            </div>

            {/* Academic Links */}
            <div>
              <div className="text-heading mb-4">Risorse Accademiche</div>
              <ul className="space-y-2">
                <li>
                  <a href="#methodology" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">
                    Metodologia
                  </a>
                </li>
                <li>
                  <a href="#bibliography" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">
                    Bibliografia
                  </a>
                </li>
                <li>
                  <a href="#limitations" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">
                    Limitazioni
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="text-heading mb-4">Informazioni Legali</div>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">
                    Termini di Utilizzo
                  </a>
                </li>
                <li>
                  <a href="/disclaimer" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border pt-6">
            
            {/* Copyright and Academic Notice */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              <div className="text-caption text-muted-foreground">
                © 2026 Tradelia. Tutti i diritti riservati.
              </div>

              <div className="text-caption text-muted-foreground">
                Strumento educativo. Non costituisce consulenza finanziaria.
              </div>
            </div>

            {/* Academic Citation */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-caption text-muted-foreground">
                <div className="mb-1">
                  <strong>Basato su ricerca accademica peer-reviewed</strong>
                </div>
                <div>
                  Fonti principali: Barber & Odean (2000), Kahneman & Tversky (1979), Thaler & Sunstein (2008)
                </div>
              </div>
            </div>

            {/* Institutional Disclaimer */}
            <div className="mt-4 p-4 border border-border bg-background">
              <div className="text-caption text-muted-foreground">
                <strong>Disclaimer Accademico:</strong> Questo framework è sviluppato per finalità educative e di ricerca. 
                I risultati della verifica non costituiscono consulenza finanziaria personalizzata. 
                Per decisioni di investimento consultare sempre un consulente finanziario qualificato e autorizzato.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};