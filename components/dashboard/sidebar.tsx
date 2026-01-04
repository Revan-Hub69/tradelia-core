"use client";

import Link from "next/link";
import { OverviewIcon, UniverseIcon, RegimeIcon, AIIcon, SettingsIcon, ChevronLeftIcon } from "@/components/icons/dashboard-icons";
import { ThemeToggleCompact } from "./theme-toggle-compact";

const navigation = [
  { name: "Homepage", href: "/", icon: OverviewIcon, current: false, external: true },
  { name: "Overview", href: "/dashboard/trading", icon: OverviewIcon, current: true },
  { name: "Universe", href: "/dashboard/trading#universe", icon: UniverseIcon, current: false },
  { name: "Regime", href: "/dashboard/trading#regime", icon: RegimeIcon, current: false },
  { name: "AI Analysis", href: "/dashboard/trading#ai", icon: AIIcon, current: false },
  { name: "Settings", href: "#", icon: SettingsIcon, current: false, onClick: true },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ collapsed, onToggle, onOpenSettings }: SidebarProps) {
  return (
    <>
      {/* Desktop: in-flow sidebar */}
      <div className={`hidden lg:flex bg-card text-card-foreground transition-all duration-300 ease-in-out border-r border-border/50 ${
        collapsed ? 'w-12' : 'w-40'
      } min-h-0 flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted/30 rounded border border-border/50 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                  <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
                </svg>
              </div>
              <span className="font-medium text-sm text-foreground">Tradelia</span>
            </div>
          )}
          {collapsed && (
            <div className="w-6 h-6 bg-muted/30 rounded border border-border/50 flex items-center justify-center mx-auto">
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-muted/30 transition-subtle"
          >
            <ChevronLeftIcon 
              className={`text-muted-foreground transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} 
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
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && <span className="text-xs text-muted-foreground">Tema</span>}
            <ThemeToggleCompact />
          </div>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <div className="w-6 h-6 bg-muted/30 rounded-full flex items-center justify-center border border-border/50">
              <span className="text-xs font-medium text-muted-foreground">U</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">Local User</p>
                <p className="text-xs text-muted-foreground truncate">Development</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: slide-in overlay sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-30 bg-card text-card-foreground border-r border-border/50 w-40 flex flex-col transition-transform duration-300 ease-in-out ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-muted/30 rounded border border-border/50 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
            <span className="font-medium text-sm text-foreground">Tradelia</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-muted/30 transition-subtle"
          >
            <ChevronLeftIcon className="text-muted-foreground" size={14} />
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
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-muted/30 rounded-full flex items-center justify-center border border-border/50">
              <span className="text-xs font-medium text-muted-foreground">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Local User</p>
              <p className="text-xs text-muted-foreground truncate">Development</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function to render nav items
function renderNavItem(item: typeof navigation[0], collapsed: boolean, onOpenSettings: () => void) {
  const IconComponent = item.icon;
  
  if (item.onClick) {
    return (
      <div key={item.name} className="relative group">
        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-2'} px-2 py-2 rounded transition-subtle text-left ${
            item.current
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
          }`}
        >
          <IconComponent size={16} />
          {!collapsed && <span className="font-medium text-xs">{item.name}</span>}
        </button>
        {collapsed && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
        className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'} px-2 py-2 rounded transition-subtle ${
          item.current
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
        }`}
      >
        <IconComponent size={16} />
        {!collapsed && <span className="font-medium text-xs">{item.name}</span>}
      </Link>
      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {item.name}
        </div>
      )}
    </div>
  );
}