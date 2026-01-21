'use client';

import React from 'react';

import { DashboardHeader } from '@/components/dashboard';
import { NavigationProvider, PWABottomNavigationSimple, SidebarNavigation } from '@/components/navigation';

type UniversalLayoutProps = {
  children: React.ReactNode;
  showSidebar?: boolean;
  showMobileNav?: boolean;
  className?: string;
};

export const UniversalLayout: React.FC<UniversalLayoutProps> = ({
  children,
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
            <PWABottomNavigationSimple />
          </div>
        )}
      </div>
    </NavigationProvider>
  );
};
