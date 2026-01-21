'use client';

import React from 'react';

// Import dei componenti esistenti
import { DashboardHeader } from '@/components/dashboard';
import { SidebarNavigation, PWABottomNavigationSimple } from '@/components/navigation';
import { NavigationProvider } from '@/components/navigation';

interface TradeliaLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showMobileNav?: boolean;
  className?: string;
}

/**
 * Layout universale che orchestra tutti i componenti Tradelia esistenti
 * Utilizza il sistema professionale con Tradelia Coins e componenti signature
 */
export const TradeliaLayout: React.FC<TradeliaLayoutProps> = ({
  children,
  showSidebar = true,
  showMobileNav = true,
  className = '',
}) => {
  return (
    <NavigationProvider>
      <div className={`min-h-screen bg-background ${className}`}>
        {/* Header con sistema professionale Tradelia */}
        <DashboardHeader />
        
        <div className="flex">
          {/* Sidebar Navigation esistente */}
          {showSidebar && (
            <aside className="hidden lg:block">
              <SidebarNavigation />
            </aside>
          )}
          
          {/* Main content con signature glass treatment */}
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
        
        {/* Mobile Navigation esistente */}
        {showMobileNav && (
          <div className="lg:hidden">
            <PWABottomNavigationSimple />
          </div>
        )}
      </div>
    </NavigationProvider>
  );
};