import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function FinalCTANew() {
  return (
    <>
      <SectionLayout background="muted">
        <div className="mx-auto max-w-3xl text-center">
          
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Da dove si inizia
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Dal punto più comune: come l'hype usa numeri e concetti fuori contesto.
          </p>
          
          {/* Repeat CTA - link secondario */}
          <Link 
            href="/dashboard/start" 
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            Inizia dal primo passo
          </Link>
          
        </div>
      </SectionLayout>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-6 text-sm text-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors font-medium">Privacy</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/about" className="hover:text-primary transition-colors font-medium">Metodo</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/contact" className="hover:text-primary transition-colors font-medium">Contatti</Link>
            </div>
            
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-foreground leading-relaxed max-w-3xl mx-auto">
                <strong className="font-semibold">Disclaimer:</strong> Tradelia è educativo. 
                Non fornisce consulenza finanziaria né raccomandazioni operative.
                Serve a migliorare la comprensione e ridurre errori comuni nel mondo crypto.
              </p>
            </div>
            
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                © 2025 Tradelia. Capire prima di credere. Capire prima di agire.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
