"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/icons/logo-icon";

// Updated footer layout - v2.0
const footerLinks = [
  { name: "Inizia Qui", href: "/dashboard/start" },
  { name: "Metodo & Fonti", href: "/dashboard/metodo" },
  { name: "Chi Siamo", href: "/about" },
  { name: "Privacy", href: "/privacy" },
];

export function DashboardFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Single Row Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <LogoIcon className="h-5 w-5 text-primary" />
            <div>
              <span className="text-sm font-semibold">Tradelia</span>
              <p className="text-xs text-muted-foreground">Educazione al rischio</p>
            </div>
          </div>

          {/* Links - Horizontal */}
          <nav className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tradelia
          </div>
        </div>

        {/* Disclaimer - Separate row */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>Disclaimer:</strong> Contenuti educativi. Non consigli di investimento.
          </p>
        </div>
      </div>
    </footer>
  );
}