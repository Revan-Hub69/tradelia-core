"use client";

import { MenuIcon } from "@/components/icons/dashboard-icons";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="bg-background border-b border-border/50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded transition-colors duration-150 lg:hidden"
          >
            <MenuIcon size={20} />
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-foreground">Dashboard</h1>
        </div>
      </div>
    </header>
  );
}
