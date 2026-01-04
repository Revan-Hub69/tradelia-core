"use client";

import { useState, useEffect } from "react";
import { SearchIcon, BellIcon, SettingsIcon, MenuIcon } from "@/components/icons/dashboard-icons";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export function DashboardHeader({ onToggleSidebar, onOpenSettings }: DashboardHeaderProps) {
  const [notifications] = useState(2);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Set initial time and update every second
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-card border-b border-border/50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded transition-subtle lg:hidden"
          >
            <MenuIcon size={20} />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">Trading Dashboard</h1>
          <div className="hidden sm:flex items-center space-x-3">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-status-ok/20 text-status-ok border border-status-ok/30">
              Live
            </span>
            <span className="text-xs text-muted-foreground">Updated: {currentTime}</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search symbols..."
                className="w-48 pl-8 pr-3 py-1.5 border border-border/50 rounded bg-background focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-subtle"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <SearchIcon className="text-muted-foreground" size={14} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary rounded transition-subtle">
            <BellIcon size={18} />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {notifications}
              </span>
            )}
          </button>

          {/* Settings */}
          <button 
            onClick={onOpenSettings}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary rounded transition-subtle"
          >
            <SettingsIcon size={18} />
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center border border-border/50">
              <span className="text-xs font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}