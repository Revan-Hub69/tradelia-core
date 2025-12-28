import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FinalCTANew() {
  return (
    <>
      <section id="start" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Inizia con calma</h2>
              <p className="text-lg text-muted-foreground">
                Parti dalla prima micro-lezione. Nessuna pressione, nessuna promessa: solo basi chiare.
              </p>
              <Button asChild size="lg" className="px-8">
                <Link href="/dashboard">
                  Inizia
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <span>•</span>
              <Link href="/about" className="hover:text-foreground transition-colors">Metodo</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contatti</Link>
            </div>
            
            <div className="pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <strong className="text-foreground">Disclaimer:</strong> Tradelia è una piattaforma educativa. 
                Nessuna consulenza finanziaria. Nessuna raccomandazione o segnale operativo.
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
