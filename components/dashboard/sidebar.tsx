"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { OverviewIcon, SettingsIcon, ChevronLeftIcon } from "@/components/icons/dashboard-icons";
import { ThemeToggleCompact } from "./theme-toggle-compact";
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
  
  const isGuest = !user;
  const userName = user?.user_metadata?.full_name || profile?.full_name || (isGuest ? 'Ospite' : 'Utente');
  const userInitial = userName.charAt(0).toUpperCase();
  const userType = isGuest ? 'Ospite' : 'Registrato';

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      {/* Desktop: in-flow sidebar */}
      <div className={`hidden lg:flex bg-background border-r border-border/50 transition-all duration-200 ease-out ${
        collapsed ? 'w-12' : 'w-44'
      } min-h-0 flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border border-border/50 flex items-center justify-center bg-muted/30">
                <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                  <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">Tradelia</span>
            </div>
          )}
          {collapsed && (
            <div className="w-6 h-6 rounded border border-border/50 flex items-center justify-center bg-muted/30 mx-auto">
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
            aria-label={collapsed ? "Espandi sidebar" : "Comprimi sidebar"}
          >
            <ChevronLeftIcon 
              className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} 
              size={14} 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => renderNavItem(item, collapsed, onOpenSettings))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50 space-y-3">
          {/* Theme Toggle */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && <span className="text-xs text-muted-foreground">Tema</span>}
            <ThemeToggleCompact />
          </div>
          
          {/* User Info */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border border-border/50 ${
              isGuest ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              <span className="text-xs font-medium">{userInitial}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userType}</p>
              </div>
            )}
          </div>
          
          {/* Sign Out */}
          {!isGuest && !collapsed && (
            <button
              onClick={handleSignOut}
              className="w-full text-xs text-muted-foreground hover:text-foreground text-left px-2 py-1.5 rounded hover:bg-muted/50 transition-colors duration-150"
            >
              Esci
            </button>
          )}
        </div>
      </div>

      {/* Mobile: slide-in overlay sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-30 bg-background border-r border-border/50 w-44 flex flex-col transition-transform duration-200 ease-out ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-border/50 flex items-center justify-center bg-muted/30">
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">Tradelia</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
            aria-label="Chiudi sidebar"
          >
            <ChevronLeftIcon size={14} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => renderNavItem(item, false, onOpenSettings))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Tema</span>
            <ThemeToggleCompact />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border border-border/50 ${
              isGuest ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              <span className="text-xs font-medium">{userInitial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{userType}</p>
            </div>
          </div>
          {!isGuest && (
            <button
              onClick={handleSignOut}
              className="w-full text-xs text-muted-foreground hover:text-foreground text-left px-2 py-1.5 rounded hover:bg-muted/50 transition-colors duration-150"
            >
              Esci
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// Helper function to render nav items
// Active: bg-foreground text-background (come button homepage - massimo contrasto)
// Inactive: text-muted-foreground hover:text-foreground hover:bg-muted/50
function renderNavItem(item: typeof navigation[0], collapsed: boolean, onOpenSettings: () => void) {
  const IconComponent = item.icon;
  
  // Stili coerenti con homepage - WCAG AAA
  const baseStyles = `flex items-center ${collapsed ? 'justify-center' : 'gap-2'} px-2.5 py-2 rounded transition-colors duration-150`;
  const activeStyles = 'bg-foreground text-background font-medium';
  const inactiveStyles = 'text-muted-foreground hover:text-foreground hover:bg-muted/50';
  
  if (item.onClick) {
    return (
      <div key={item.name} className="relative group">
        <button
          onClick={onOpenSettings}
          className={`w-full text-left ${baseStyles} ${item.current ? activeStyles : inactiveStyles}`}
        >
          <IconComponent size={16} />
          {!collapsed && <span className="text-xs">{item.name}</span>}
        </button>
        {collapsed && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
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
        <IconComponent size={16} />
        {!collapsed && <span className="text-xs">{item.name}</span>}
      </Link>
      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
          {item.name}
        </div>
      )}
    </div>
  );
}
