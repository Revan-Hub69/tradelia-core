'use client'

import Link from 'next/link'
import { LogoIcon } from '@/components/icons/logo-icon'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-70">
            <LogoIcon className="h-7 w-7" />
            <span className="text-sm font-semibold">Tradelia</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="#metodologia" className="link-internal text-sm">
              Metodologia
            </Link>
            <Link href="/verify" className="text-sm font-medium text-foreground">
              Verifica
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
