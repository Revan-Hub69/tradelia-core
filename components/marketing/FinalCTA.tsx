import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface FinalCTAProps {
  className?: string;
}

export default function FinalCTA({ className }: FinalCTAProps) {
  return (
    <>
      <section className={`py-32 ${className || ""}`}>
        <div className="mx-auto max-w-5xl px-6">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5 shadow-2xl">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="premium" className="text-sm">Inizia il Percorso</Badge>
                <h2 className="text-4xl font-bold">Pronto a iniziare il tuo percorso educativo?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Accedi alla dashboard per esplorare contenuti interattivi, checklist cognitive 
                  e percorsi di apprendimento strutturati. Metodo, non segnali.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="xl" variant="premium" className="px-10">
                  <Link href="/dashboard">
                    Accedi Dashboard
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="px-10">
                  <Link href="/about">
                    Scopri il Metodo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <p className="text-base text-muted-foreground">
                <strong className="text-foreground">Avvertenza:</strong> Contenuti esclusivamente educativi. 
                Non costituiscono consulenza finanziaria, non sono sollecitazione al pubblico risparmio, 
                non forniscono indicazioni operative.
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <span className="font-medium">Tradelia</span>
              <span>•</span>
              <span>Metodo, non segnali</span>
              <span>•</span>
              <span>Rigore accademico</span>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                © 2025 Tradelia. Piattaforma educativa per la gestione consapevole del rischio.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}