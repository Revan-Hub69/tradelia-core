"use client";

import Link from "next/link";
import { OverviewIcon, UniverseIcon, RegimeIcon, AIIcon, SettingsIcon, ChevronLeftIcon } from "@/components/icons/dashboard-icons";

const navigation = [
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
    <div className={`bg-card text-card-foreground transition-all duration-300 ease-in-out border-r border-border/50 ${
      collapsed ? 'w-12' : 'w-48'
    } min-h-screen flex flex-col fixed lg:relative z-30 lg:z-auto ${
      collapsed ? 'lg:w-12' : 'lg:w-48'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted/30 rounded border border-border/50 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
            <span className="font-semibold text-foreground">Tradelia</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded hover:bg-muted/30 transition-subtle"
        >
          <ChevronLeftIcon 
            className={`text-muted-foreground transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          
          if (item.onClick) {
            return (
              <div key={item.name} className="relative group">
                <button
                  onClick={onOpenSettings}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded transition-subtle text-left ${
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  }`}
                >
                  <IconComponent size={18} />
                  {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
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
                className={`flex items-center space-x-3 px-3 py-2.5 rounded transition-subtle ${
                  item.current
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                }`}
              >
                <IconComponent size={18} />
                {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
              {collapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted/30 rounded-full flex items-center justify-center border border-border/50">
            <span className="text-xs font-medium text-muted-foreground">U</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Local User</p>
              <p className="text-xs text-muted-foreground truncate">Development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}