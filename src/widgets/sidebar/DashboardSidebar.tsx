/**
 * Dashboard Sidebar Widget - Tradelia 2026
 * 
 * Sidebar intelligente multi-stato con:
 * - 3 stati: expanded (280px), compact (72px), hidden (0px)
 * - Persistenza stato con localStorage
 * - Tooltips intelligenti in compact mode
 * - Keyboard navigation completa
 * - Accessibilità WCAG AAA+
 */

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore, useSidebarState } from '@/src/features/sidebar-state';
import { cn, transitionSubtle } from '@/src/shared/ui/utils';
import type { NavigationItem } from '@/src/entities/navigation/types';

// Sidebar dimensions following Tradelia 2026 spec
const SIDEBAR_WIDTHS = {
  expanded: 280,
  compact: 72,
  hidden: 0,
} as const;

interface DashboardSidebarProps {
  navigationItems: NavigationItem[];
  className?: string;
  onNavigate?: (item: NavigationItem) => void;
}

export function DashboardSidebar({ 
  navigationItems, 
  className,
  onNavigate 
}: DashboardSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const state = useSidebarState();
  const { toggle, setState } = useSidebarStore();
  const pathname = usePathname();
  
  // Handle aria-hidden and inert for hidden state (accessibility)
  useEffect(() => {
    if (sidebarRef.current) {
      if (state === 'hidden') {
        sidebarRef.current.setAttribute('aria-hidden', 'true');
        sidebarRef.current.setAttribute('inert', '');
      } else {
        sidebarRef.current.removeAttribute('aria-hidden');
        sidebarRef.current.removeAttribute('inert');
      }
    }
  }, [state]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        if (state !== 'hidden') {
          setState('hidden');
        }
        break;
      case '[':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          toggle();
        }
        break;
    }
  };

  const isExpanded = state === 'expanded';
  const isCompact = state === 'compact';
  const isHidden = state === 'hidden';

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'flex flex-col border-r border-border bg-background',
        'transition-all duration-300 ease-out',
        isExpanded && 'w-[280px]',
        isCompact && 'w-[72px]',
        isHidden && 'w-0 overflow-hidden',
        className
      )}
      style={{ 
        width: SIDEBAR_WIDTHS[state],
        minWidth: SIDEBAR_WIDTHS[state],
      }}
      aria-label="Navigazione principale"
      onKeyDown={handleKeyDown}
    >
      {!isHidden && (
        <>
          {/* Header */}
          <SidebarHeader 
            isCompact={isCompact} 
            onToggle={toggle} 
          />
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1" role="list">
              {navigationItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  isCompact={isCompact}
                  isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <SidebarFooter isCompact={isCompact} />
        </>
      )}
    </aside>
  );
}

// Header component
interface SidebarHeaderProps {
  isCompact: boolean;
  onToggle: () => void;
}

function SidebarHeader({ isCompact, onToggle }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/50">
      {!isCompact && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center bg-muted/30">
            <TradeliaLogo size={16} />
          </div>
          <span className="text-sm font-semibold text-foreground">Tradelia</span>
        </div>
      )}
      
      {isCompact && (
        <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center bg-muted/30 mx-auto">
          <TradeliaLogo size={16} />
        </div>
      )}
      
      <button
        onClick={onToggle}
        className={cn(
          'p-2 rounded-lg text-muted-foreground',
          'hover:text-foreground hover:bg-muted/50',
          transitionSubtle,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
          isCompact && 'absolute right-2'
        )}
        aria-label={isCompact ? 'Espandi sidebar' : 'Comprimi sidebar'}
        title={isCompact ? 'Espandi (Ctrl+[)' : 'Comprimi (Ctrl+[)'}
      >
        <ChevronIcon 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isCompact && 'rotate-180'
          )} 
        />
      </button>
    </div>
  );
}

// Navigation item component
interface SidebarNavItemProps {
  item: NavigationItem;
  isCompact: boolean;
  isActive: boolean;
  onNavigate?: ((item: NavigationItem) => void) | undefined;
}

function SidebarNavItem({ item, isCompact, isActive, onNavigate }: SidebarNavItemProps) {
  const IconComponent = item.icon;
  
  const handleClick = () => {
    onNavigate?.(item);
  };

  const content = (
    <>
      <span className="flex-shrink-0">
        <IconComponent className="w-5 h-5" />
      </span>
      {!isCompact && (
        <span className="text-sm font-medium truncate">{item.label}</span>
      )}
      {!isCompact && item.progress !== undefined && (
        <span className="ml-auto text-xs text-muted-foreground">
          {item.progress}%
        </span>
      )}
    </>
  );

  const baseStyles = cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
    transitionSubtle,
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
    isCompact && 'justify-center px-2'
  );

  const activeStyles = 'bg-primary text-white font-medium shadow-sm';
  const inactiveStyles = 'text-muted-foreground hover:text-foreground hover:bg-muted/50';

  return (
    <li className="relative group">
      <Link
        href={item.href}
        onClick={handleClick}
        className={cn(baseStyles, isActive ? activeStyles : inactiveStyles)}
        aria-current={isActive ? 'page' : undefined}
        aria-label={isCompact ? item.label : undefined}
      >
        {content}
      </Link>
      
      {/* Tooltip for compact mode */}
      {isCompact && (
        <div 
          className={cn(
            'absolute left-full ml-2 top-1/2 -translate-y-1/2',
            'px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg',
            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
            'transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50',
            'shadow-lg'
          )}
          role="tooltip"
        >
          {item.label}
          {item.progress !== undefined && ` (${item.progress}%)`}
        </div>
      )}
    </li>
  );
}

// Footer component
interface SidebarFooterProps {
  isCompact: boolean;
}

function SidebarFooter({ isCompact }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t border-border/50">
      <div className={cn(
        'flex items-center',
        isCompact ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/50">
          <span className="text-xs font-medium text-foreground">U</span>
        </div>
        {!isCompact && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Utente</p>
            <p className="text-xs text-muted-foreground truncate">Dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple icons (inline SVG to avoid external dependencies)
function TradeliaLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
      <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))"/>
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
