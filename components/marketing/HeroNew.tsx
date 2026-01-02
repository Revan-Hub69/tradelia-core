'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroNew() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-8 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sistema di verifica decisionale
            </span>
          </div>

          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Tradelia non convince.
              <br />
              <span className="text-primary">Tradelia chiarifica.</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Verifica la compatibilità tra ciò che vuoi fare e le caratteristiche reali di broker, wallet, exchange e conti deposito.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/verifica">
                Inizia la verifica
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#metodo">
                Scopri il metodo
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground">
            Nessun segnale. Nessuna promessa. Nessuna spinta all'azione rapida.
          </p>
        </div>
      </div>
    </section>
  )
}
