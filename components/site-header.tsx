'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LogoIcon } from '@/components/icons/logo-icon'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  const navigation = [
    { href: '#problema', label: 'Perche' },
    { href: '#metodo', label: 'Metodo' },
    { href: '#esempi', label: 'Esempi' },
    { href: '#trasparenza', label: 'Confini' }
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Tradelia - torna alla home"
        >
          <LogoIcon className="h-8 w-8" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Tradelia</span>
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background text-sm text-foreground transition hover:bg-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
          aria-expanded={open}
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </div>
        </button>

        <nav className="hidden items-center gap-6 sm:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/verifica" className="btn-primary px-4 py-2 text-xs">
            Trova lo strumento
          </Link>
        </nav>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-1 py-2">
              <ThemeToggle />
            </div>
            <Link
              href="/verifica"
              className="btn-primary px-4 py-2 text-xs"
              onClick={() => setOpen(false)}
            >
              Trova lo strumento
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
