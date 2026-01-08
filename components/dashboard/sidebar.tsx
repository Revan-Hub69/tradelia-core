"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { OverviewIcon, SettingsIcon, ChevronLeftIcon } from "@/components/icons/dashboard-icons";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Homepage", href: "/", icon: OverviewIcon, current: false },
  { name: "Dashboard", href: "/dashboard", icon: OverviewIcon, current: true },
  { name: "Impostazioni", href: "#", icon: SettingsIcon, current: false, onClick: true },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ collapsed, onToggle, onOpenSettings }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isGuest = !user;
  const userName = user?.user_metadata?.full_name || profile?.full_name || (isGuest ? 'Ospite' : 'Utente');
  const userInitial = userName.charAt(0).toUpperCase();
  const userType = isGuest ? 'Ospite' : 'Registrato';

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="hidden lg:flex bg-background border-r border-border/50 w-44 min-h-0 flex-col">
        <div className="animate-pulse">
          <div className="h-12 bg-muted/30 border-b border-border/50" />
          <div className="p-2 space-y-2">
            <div className="h-8 bg-muted/30 rounded" />
            <div className="h-8 bg-muted/30 rounded" />
            <div className="h-8 bg-muted/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: in-flow sidebar */}
      <div className={`hidden lg:flex bg-background border-r border-border/50 transition-all duration-300 ease-out ${
        collapsed ? 'w-16' : 'w-64'
      } min-h-0 flex-col`}>
        {/* Header - Tradelia 2026 Design */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center bg-muted/30">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                  <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">Tradelia</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center bg-muted/30 mx-auto">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            aria-label={collapsed ? "Espandi sidebar" : "Comprimi sidebar"}
          >
            <ChevronLeftIcon 
              className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} 
              size={16} 
            />
          </button>
        </div>

        {/* Navigation - Tradelia 2026 Design */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => renderNavItem(item, collapsed, onOpenSettings))}
        </nav>

        {/* Footer - Tradelia 2026 Design */}
        <div className="p-4 border-t border-border/50">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/50">
              <span className="text-xs font-medium text-foreground">{userInitial}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userType}</p>
              </div>
            )}
          </div>
          
          {/* Sign Out */}
          {!isGuest && !collapsed && (
            <button
              onClick={handleSignOut}
              className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground text-left px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-subtle"
            >
              Esci
            </button>
          )}
        </div>
      </div>

      {/* Mobile: slide-in overlay sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-30 bg-background border-r border-border/50 w-64 flex flex-col transition-transform duration-300 ease-out ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center bg-muted/30">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">Tradelia</span>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-subtle"
            aria-label="Chiudi sidebar"
          >
            <ChevronLeftIcon size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => renderNavItem(item, false, onOpenSettings))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/50">
              <span className="text-xs font-medium text-foreground">{userInitial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userType}</p>
            </div>
          </div>
          {!isGuest && (
            <button
              onClick={handleSignOut}
              className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground text-left px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-subtle"
            >
              Esci
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// Helper function to render nav items - Tradelia 2026 Design
function renderNavItem(item: typeof navigation[0], collapsed: boolean, onOpenSettings: () => void) {
  const IconComponent = item.icon;
  
  // Stili coerenti con homepage - Tradelia 2026
  const baseStyles = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 ${collapsed ? 'justify-center px-2' : ''}`;
  const activeStyles = 'bg-primary text-white font-medium shadow-sm';
  const inactiveStyles = 'text-muted-foreground hover:text-foreground hover:bg-muted/50';
  
  if (item.onClick) {
    return (
      <div key={item.name} className="relative group">
        <button
          onClick={onOpenSettings}
          className={`w-full text-left ${baseStyles} ${item.current ? activeStyles : inactiveStyles}`}
        >
          <IconComponent size={20} />
          {!collapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
        </button>
        {collapsed && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            {item.name}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div key={item.name} className="relative group">
      <Link
        href={item.href}
        className={`${baseStyles} ${item.current ? activeStyles : inactiveStyles}`}
      >
        <IconComponent size={20} />
        {!collapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
      </Link>
      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {item.name}
        </div>
      )}
    </div>
  );
}
