"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { OverviewIcon, SettingsIcon, ChevronLeftIcon } from "@/components/icons/dashboard-icons";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { 
    name: "Homepage", 
    href: "/", 
    icon: OverviewIcon, 
    current: false,
    description: "Torna alla homepage"
  },
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: OverviewIcon, 
    current: true,
    description: "Dashboard principale"
  },
  { 
    name: "Impostazioni", 
    href: "#", 
    icon: SettingsIcon, 
    current: false, 
    onClick: true,
    description: "Configurazione sistema"
  },
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
      <div className={`hidden lg:flex bg-background border-r border-border/50 ${collapsed ? 'w-16' : 'w-64'} min-h-0 flex-col`}>
        <div className="animate-pulse">
          <div className="h-16 bg-muted/30 border-b border-border/50" />
          <div className="p-4 space-y-3">
            <div className="h-12 bg-muted/30 rounded-lg" />
            <div className="h-12 bg-muted/30 rounded-lg" />
            <div className="h-12 bg-muted/30 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: in-flow sidebar - Enterprise Level */}
      <div className={`hidden lg:flex bg-background border-r border-border/50 transition-all duration-300 ease-out ${
        collapsed ? 'w-16' : 'w-64'
      } min-h-0 flex-col shadow-sm`}>
        
        {/* Header - Premium Tradelia 2026 Design */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border-2 border-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                  <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-foreground tracking-tight">Tradelia</span>
                <p className="text-xs text-muted-foreground font-medium">Dashboard dinamica</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg border-2 border-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm mx-auto">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 border border-transparent hover:border-border/50"
            aria-label={collapsed ? "Espandi sidebar" : "Comprimi sidebar"}
          >
            <ChevronLeftIcon 
              className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} 
              size={16} 
            />
          </button>
        </div>

        {/* Navigation - Enterprise Level Design */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className={`space-y-1 ${collapsed ? 'space-y-2' : ''}`}>
            {navigation.map((item) => renderNavItem(item, collapsed, onOpenSettings))}
          </div>
        </nav>

        {/* Status Indicator */}
        {!collapsed && (
          <div className="px-3 py-2 border-t border-border/30">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">Sistema operativo</p>
                <p className="text-xs text-muted-foreground">Tutti i servizi attivi</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Premium User Section */}
        <div className="p-3 border-t border-border/50 bg-muted/10">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm">
              <span className="text-xs font-bold text-primary">{userInitial}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    isGuest 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {userType}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Sign Out - Premium Button */}
          {!isGuest && !collapsed && (
            <button
              onClick={handleSignOut}
              className="w-full mt-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-muted/50 border border-border/50 hover:border-border rounded-lg transition-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            >
              Esci dal sistema
            </button>
          )}
        </div>
      </div>

      {/* Mobile: slide-in overlay sidebar - Enterprise Level */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-30 bg-background border-r border-border/50 w-80 flex flex-col transition-transform duration-300 ease-out shadow-xl ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl border-2 border-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-foreground tracking-tight">Tradelia</span>
              <p className="text-xs text-muted-foreground font-medium">Dashboard dinamica</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-subtle border border-transparent hover:border-border/50"
            aria-label="Chiudi sidebar"
          >
            <ChevronLeftIcon size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => renderNavItem(item, false, onOpenSettings))}
          </div>
        </nav>

        {/* Status Indicator */}
        <div className="px-4 py-3 border-t border-border/30">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Sistema operativo</p>
              <p className="text-xs text-muted-foreground">Tutti i servizi attivi</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm">
              <span className="text-sm font-bold text-primary">{userInitial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isGuest 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {userType}
                </span>
              </div>
            </div>
          </div>
          {!isGuest && (
            <button
              onClick={handleSignOut}
              className="w-full mt-4 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-muted/50 border border-border/50 hover:border-border rounded-lg transition-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            >
              Esci dal sistema
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// Helper function to render nav items - Enterprise Tradelia 2026 Design
function renderNavItem(item: typeof navigation[0], collapsed: boolean, onOpenSettings: () => void) {
  const IconComponent = item.icon;
  
  // Enterprise-level styling following Tradelia 2026 principles
  const baseStyles = `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 ${
    collapsed ? 'justify-center px-2' : ''
  }`;
  
  const activeStyles = 'bg-gradient-to-r from-primary to-primary/90 text-white font-semibold shadow-lg shadow-primary/20 border border-primary/20';
  const inactiveStyles = 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50 hover:shadow-sm';
  
  if (item.onClick) {
    return (
      <div key={item.name} className="relative">
        <button
          onClick={onOpenSettings}
          className={`w-full text-left ${baseStyles} ${item.current ? activeStyles : inactiveStyles}`}
        >
          <div className={`flex items-center justify-center w-5 h-5 ${item.current ? 'text-white' : 'text-primary'}`}>
            <IconComponent size={16} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium truncate block">{item.name}</span>
              <span className="text-xs opacity-75 truncate block">{item.description}</span>
            </div>
          )}
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>
            </div>
          )}
        </button>
        
        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-primary/20">
            <div className="font-medium">{item.name}</div>
            <div className="text-xs opacity-90">{item.description}</div>
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-primary"></div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div key={item.name} className="relative">
      <Link
        href={item.href}
        className={`${baseStyles} ${item.current ? activeStyles : inactiveStyles}`}
      >
        <div className={`flex items-center justify-center w-5 h-5 ${item.current ? 'text-white' : 'text-primary'}`}>
          <IconComponent size={16} />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium truncate block">{item.name}</span>
            <span className="text-xs opacity-75 truncate block">{item.description}</span>
          </div>
        )}
        {!collapsed && item.current && (
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        )}
      </Link>
      
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-primary/20">
          <div className="font-medium">{item.name}</div>
          <div className="text-xs opacity-90">{item.description}</div>
          {/* Arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-primary"></div>
        </div>
      )}
    </div>
  );
}
