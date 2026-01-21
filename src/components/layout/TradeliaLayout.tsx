'use client';

import React from 'react';

// Import dei componenti esistenti
import { DashboardHeader, MobileNavigation, SidebarNavigation } from '@/components/dashboard';
import { NavigationProvider } from '@/components/navigation';

interface TradeliaLayoutProps {
  children: React.ReactNode;
  variant?: 'dashboard' | 'minimal' | 'mobile-first' | 'premium';
  headerVariant?: 'dashboard' | 'simple' | 'minimal';
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
  variant = 'dashboard',
  headerVariant = 'dashboard',
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
            <MobileNavigation />
          </div>
        )}
      </div>
    </NavigationProvider>
  );
};