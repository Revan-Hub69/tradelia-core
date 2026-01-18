'use client';

import React from 'react';

import { Home, BookOpen, BarChart3, User } from 'lucide-react';

type MobileNavigationProps = {
  activeSection: 'overview' | 'paths' | 'progress' | 'settings';
  onSectionChange: (section: 'overview' | 'paths' | 'progress' | 'settings') => void;
  className?: string;
};

/**
 * MobileNavigation - Bottom navigation for mobile devices
 * 
 * Features:
 * - Fixed bottom navigation
 * - Glassmorphism styling
 * - Touch-optimized buttons
 * - Consistent with existing spacing system
 * - Premium design aesthetic
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange,
  className = '',
}) => {
  const navItems = [
    {
      id: 'overview' as const,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'paths' as const,
      label: 'Percorsi',
      icon: BookOpen,
    },
    {
      id: 'progress' as const,
      label: 'Progresso',
      icon: BarChart3,
    },
    {
      id: 'settings' as const,
      label: 'Profilo',
      icon: User,
    },
  ];

  return (
    <nav className={`
      fixed bottom-0 left-0 right-0 z-50 
      border-t border-white/10 bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5
      dark:border-white/5 dark:bg-slate-900/80 dark:shadow-black/20
      ${className}
    `}>
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all duration-200
                  ${isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10'
                  }
                `}
                aria-label={item.label}
              >
                <Icon className={`size-5 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                <span className="text-xs font-medium">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};