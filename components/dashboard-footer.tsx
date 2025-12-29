"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/icons/logo-icon";
import { BrainIcon } from "@/components/icons/brain-icon";
import { EconomicsIcon } from "@/components/icons/economics-icon";
import { WarningIcon } from "@/components/icons/warning-icon";

const dashboardSections = [
  {
    title: "Percorsi Educativi",
    links: [
      { name: "Start · Orientamento", href: "/dashboard/start", icon: BrainIcon },
      { name: "Microlearning", href: "/dashboard/microlearning", icon: BrainIcon },
      { name: "Metodo e Fonti", href: "/dashboard/metodo", icon: EconomicsIcon },
    ]
  },
  {
    title: "Strumenti di Analisi",
    links: [
      { name: "Misuratori di Contesto", href: "/dashboard/misuratori", icon: EconomicsIcon },
      { name: "Check Piattaforme", href: "/dashboard/check-piattaforme", icon: WarningIcon },
    ]
  },
  {
    title: "Protezione",
    links: [
      { name: "Libreria Truffe", href: "/dashboard/truffe", icon: WarningIcon },
    ]
  }
];

const resourceLinks = [
  { name: "Principi Antifuffa", href: "/about" },
  { name: "Biblioteca Educativa", href: "/library" },
  { name: "Glossario", href: "/library/glossary" },
  { name: "FAQ", href: "/faq" },
];

export function DashboardFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <LogoIcon className="h-8 w-8 text-primary" />
              <div>
                <div className="text-lg font-semibold">Tradelia</div>
                <div className="text-xs text-muted-foreground">Educazione al rischio</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Piattaforma educativa per decisioni finanziarie consapevoli. 
              Metodo, non segnali. Educazione, non consigli.
            </p>
          </div>

          {/* Dashboard Sections */}
          {dashboardSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <IconComponent className="w-3 h-3" />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Resource Links */}
            <div className="flex flex-wrap gap-6">
              {resourceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tradelia. Educazione finanziaria indipendente.
            </div>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-start gap-3">
            <WarningIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong>Disclaimer educativo:</strong> Tradelia fornisce esclusivamente contenuti educativi. 
              Non offre consigli di investimento, segnali operativi o raccomandazioni finanziarie. 
              Ogni decisione di investimento è di esclusiva responsabilità dell'utente.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}