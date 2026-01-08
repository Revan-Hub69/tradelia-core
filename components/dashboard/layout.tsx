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
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('tradelia-sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tradelia-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed, mounted]);

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

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden">
      {/* Mobile backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 z-20 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={handleToggleSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSidebarCollapsed(true);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Chiudi sidebar"
        />
      )}

      {/* Sidebar - always in flow on desktop, slide-in on mobile */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleToggleSidebar}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <DashboardHeader 
          onToggleSidebar={handleToggleSidebar}
        />
        
        {/* Content - single scroll point with better spacing */}
        <main className="flex-1 overflow-y-auto overscroll-none bg-muted/20">
          <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mini Footer - Enhanced */}
        <footer className="border-t border-border/50 px-6 py-3 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground max-w-7xl mx-auto">
            <span>© 2026 Tradelia. Strumento educativo per analisi finanziaria.</span>
            <span>Non costituisce consulenza finanziaria professionale.</span>
          </div>
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}