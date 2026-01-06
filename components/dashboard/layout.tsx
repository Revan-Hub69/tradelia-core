"use client";

import { type ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { SettingsModal } from "./settings-modal";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Block body scroll when modal is open
  useEffect(() => {
    if (settingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [settingsOpen]);

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden">
      {/* Mobile backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar - always in flow on desktop, slide-in on mobile */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <DashboardHeader 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Content - single scroll point */}
        <main className="flex-1 overflow-y-auto overscroll-none">
          <div className="p-2 sm:p-3">
            {children}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}