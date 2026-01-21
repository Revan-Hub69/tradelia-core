'use client';

import React from 'react';

import { DashboardHeader, MobileNavigation, SidebarNavigation } from '@/components/dashboard';
import { NavigationProvider } from '@/components/navigation';

interface UniversalLayoutProps {
  children: React.ReactNode;
  variant?: 'dashboard' | 'minimal' | 'mobile-first';
  showSidebar?: boolean;
  showMobileNav?: boolean;
  className?: string;
}

export const UniversalLayout: React.FC<UniversalLayoutProps> = ({
  children,
  variant = 'dashboard',
  showSidebar = true,
  showMobileNav = true,
  className = '',
}) => {
  return (
    <NavigationProvider>
      <div className={`min-h-screen bg-background ${className}`}>
        {/* Header universale */}
        <DashboardHeader />
        
        <div className="flex">
          {/* Sidebar per desktop */}
          {showSidebar && (
            <aside className="hidden lg:block">
              <SidebarNavigation />
            </aside>
          )}
          
          {/* Main content */}
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
        
        {/* Mobile navigation */}
        {showMobileNav && (
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        )}
      </div>
    </NavigationProvider>
  );
};