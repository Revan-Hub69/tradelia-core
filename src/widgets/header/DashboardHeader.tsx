/**
 * Dashboard Header - Tradelia 2026
 * 
 * Header della dashboard con logo, command palette trigger,
 * notifiche e menu utente
 */

'use client';

import { Button } from '@/src/shared/ui/Button';
import { useCommandStore } from '@/src/features/command-palette/store/command-store';
import { LocaleSwitcher } from '@/src/features/locale-switcher/components/LocaleSwitcher';
import { ThemeToggle } from '@/src/shared/ui/ThemeToggle';
import Logo from '@/components/Logo';
import type { SidebarState } from '@/src/features/sidebar-state/types';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  sidebarState: SidebarState;
}

export function DashboardHeader({ onToggleSidebar, sidebarState }: DashboardHeaderProps) {
  const { setOpen: openCommandPalette } = useCommandStore();

  return (
    <header className="h-14 border-b border-border/50 bg-background flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        {/* Logo - visible when sidebar is hidden */}
        {sidebarState === 'hidden' && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6">
              <Logo />
            </div>
            <span className="text-sm font-semibold text-foreground">Tradelia</span>
          </div>
        )}
      </div>

      {/* Center Section - Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <Button
          variant="outline"
          className="w-full justify-between text-muted-foreground hover:text-foreground"
          onClick={() => openCommandPalette(true)}
        >
          <span className="text-sm">Cerca comandi...</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">K</kbd>
          </div>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Language Switcher */}
        <LocaleSwitcher />
        
        {/* User Menu */}
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 rounded-full bg-muted"
          aria-label="User menu"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Button>
      </div>
    </header>
  );
}