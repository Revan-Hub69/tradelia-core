"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard/paths/long-term", label: "Percorsi" },
  { href: "/library", label: "Libreria" },
  { href: "/about", label: "Metodo" },
];

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/20 text-foreground">
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r bg-white">
        <div className="border-b px-6 py-5">
          <Link href="/" className="block text-lg font-semibold text-foreground">
            Tradelia
          </Link>
          <p className="text-sm text-muted-foreground">Decisioni educate, rischio sotto controllo.</p>
        </div>
        <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "default" : "ghost",
                    size: "sm",
                  }),
                  "justify-start"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 pb-6 text-xs text-muted-foreground">
          Base formativa senza segnali operativi.
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 md:ml-64">
        <div className="flex w-full flex-col">
          <header className="border-b bg-white">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
              {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
            </div>
            <div className="flex gap-2 border-t bg-white px-6 py-3 md:hidden">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({
                        variant: isActive ? "secondary" : "ghost",
                        size: "sm",
                      })
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>
          <main className="px-6 py-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
          </main>
          <footer className="border-t bg-white px-6 py-4 text-xs text-muted-foreground">
            Contenuti a scopo educativo, non costituiscono consulenza finanziaria.
          </footer>
        </div>
      </div>
    </div>
  );
}
