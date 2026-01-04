"use client";

import { type ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { SettingsModal } from "./settings-modal";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-12' : 'lg:ml-40'
      }`}>
        {/* Header */}
        <DashboardHeader 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
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