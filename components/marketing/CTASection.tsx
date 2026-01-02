'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CTASection() {
  return (
    <section className="border-t border-border/50 bg-muted/20 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Pronto a verificare la compatibilità?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Dichiara il tuo obiettivo e verifichiamo insieme se lo strumento che stai considerando è coerente con le tue necessità.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/verify">
                Inizia la verifica
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Torna alla homepage
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Versione framework: 2026.01 - Tradelia non convince. Tradelia chiarifica.
          </p>
        </div>
      </div>
    </section>
  )
}
