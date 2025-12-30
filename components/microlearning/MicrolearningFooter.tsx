'use client'

import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { Button } from "@/components/ui/button"
import { BrainIcon } from "@/components/icons/brain-icon"
import Link from "next/link"

export function MicrolearningFooter() {
  return (
    <footer className="space-y-8">
      {/* Educational Reminder */}
      <UnifiedCard className="bg-muted/30">
        <CardContent className="p-8 text-center">
          <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
            <BrainIcon className="w-6 h-6 text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">
            Ricorda l'Obiettivo
          </h3>
          
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ogni lezione dura 3-5 minuti e non richiede decisioni operative. 
            L'obiettivo è sviluppare comprensione e senso critico, non fornire segnali di trading.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/dashboard/start">
                Torna al Percorso di Orientamento
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/dashboard/metodo">
                Leggi Metodologia Completa
              </Link>
            </Button>
          </div>
        </CardContent>
      </UnifiedCard>

      {/* Legal Disclaimer */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          <strong className="font-medium">Disclaimer:</strong> Tradelia è un progetto educativo 
          che usa metodologie di behavioral finance per spiegare i mercati crypto. 
          Non fornisce consulenza finanziaria né raccomandazioni operative. 
          L'obiettivo è sviluppare comprensione e senso critico.
        </p>
      </div>
    </footer>
  )
}