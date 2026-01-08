"use client";

import { MenuIcon } from "@/components/icons/dashboard-icons";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-subtle border border-transparent hover:border-border/50 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            aria-label="Apri menu di navigazione"
          >
            <MenuIcon size={20} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground font-medium">Analisi e monitoraggio portafoglio</p>
          </div>
        </div>

        {/* Right side - Status indicators */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Sistema attivo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
