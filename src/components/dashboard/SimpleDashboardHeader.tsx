'use client';

import { useUserData } from '@/hooks/useUserData';
import { Logo } from '@/templates/Logo';
import { cn } from '@/utils/Helpers';
import { 
  Settings, 
  User, 
  Crown, 
  Bell,
  Search,
  HelpCircle,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { StreakIcon, XPIcon } from '@/components/icons';

import { ProgressDisplay } from './ProgressDisplay';
import { UserDropdown } from './UserDropdown';

type SimpleDashboardHeaderProps = {
  className?: string;
  showGamification?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  showQuickActions?: boolean;
};

export const SimpleDashboardHeader = ({
  className,
  showGamification = true,
  showNotifications = true,
  showSearch = true,
  showQuickActions = true,
}: SimpleDashboardHeaderProps) => {
  const { userData, isLoading } = useUserData();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationCount] = useState(3); // Mock notifications

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPremium = false; // TODO: Add subscription field to userData type
  const level = userData ? Math.floor(userData.progress.totalXP / 100) + 1 : 1;

  return (
    <header
      className={cn(
        // Enhanced glassmorphism with better depth
        'sticky top-0 z-50 border-b border-white/10 dark:border-white/5',
        'bg-white/80 dark:bg-slate-900/80',
        'backdrop-blur-2xl backdrop-saturate-150',
        // Advanced shadows for premium feel
        'shadow-lg shadow-black/5 dark:shadow-black/20',
        'supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-900/60',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:h-18 md:px-6">
        {/* Left Section: Logo + Navigation */}
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          
          {/* Breadcrumb separator */}
          <div className="hidden md:block h-6 w-px bg-border/50" />
          
          {/* Current page indicator */}
          <nav className="hidden md:block">
            <div className="text-sm font-medium text-muted-foreground">
              Dashboard
            </div>
          </nav>
        </div>

        {/* Center Section: Progress + Gamification (Desktop) */}
        <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {/* Progress Display */}
          {isLoading ? (
            <div className="h-8 w-48 animate-pulse rounded-xl bg-white/20 dark:bg-white/10" />
          ) : userData ? (
            <ProgressDisplay
              pathName={userData.progress.pathName}
              completedLessons={userData.progress.completedLessons}
              totalLessons={userData.progress.totalLessons}
              progressPercentage={userData.progress.progressPercentage}
            />
          ) : null}

          {/* Gamification Elements */}
          {showGamification && userData && (
            <div className="flex items-center gap-3">
              {/* Streak Counter */}
              <div className="group relative flex items-center gap-2 rounded-xl bg-white/40 dark:bg-white/10 px-3 py-2 backdrop-blur-sm transition-all hover:bg-white/60 dark:hover:bg-white/20 border border-white/20 dark:border-white/10">
                <StreakIcon size={16} className="text-orange-500" />
                <div className="text-sm font-semibold">
                  <span className="sr-only">Streak corrente:</span>
                  {userData.progress.currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">giorni</div>
              </div>

              {/* XP and Level */}
              <div className="flex items-center gap-2 rounded-xl bg-white/40 dark:bg-white/10 px-3 py-2 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <XPIcon size={16} className="text-primary" />
                <div className="text-sm">
                  <span className="font-semibold">{userData.progress.totalXP}</span>
                  <span className="text-muted-foreground text-xs ml-1">XP</span>
                </div>
                <div className="text-xs text-muted-foreground ml-2 pl-2 border-l border-white/20">
                  Lv. {level}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Actions + User */}
        <div className="flex items-center gap-2">
          
          {/* Premium Badge */}
          {isPremium && (
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-xs font-medium text-white shadow-lg">
              <Crown className="size-3" />
              Premium
            </div>
          )}

          {/* Mobile Gamification */}
          {showGamification && userData && (
            <div className="flex lg:hidden items-center gap-2 rounded-lg bg-white/40 dark:bg-white/10 px-2 py-1 backdrop-blur-sm border border-white/20 dark:border-white/10">
              <StreakIcon size={14} className="text-orange-500" />
              <span className="text-xs font-medium">{userData.progress.currentStreak}</span>
              <div className="hidden sm:flex lg:hidden items-center gap-1 ml-2 pl-2 border-l border-white/20">
                <XPIcon size={12} className="text-primary" />
                <span className="text-xs font-medium">{userData.progress.totalXP}</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {showQuickActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-9 w-9 p-0 rounded-xl',
                    'bg-white/40 dark:bg-white/10',
                    'hover:bg-white/60 dark:hover:bg-white/20',
                    'border border-white/20 dark:border-white/10',
                    'backdrop-blur-sm transition-all duration-200'
                  )}
                >
                  <Zap className="size-4" />
                  <span className="sr-only">Azioni rapide</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm">
                <DropdownMenuItem className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="size-4" />
                    <span>Cerca lezioni</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">⌘K</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="size-4 mr-2" />
                  <span>Continua lezione</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4 mr-2" />
                  <span>Visualizza progresso</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Search Button */}
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'hidden md:flex h-9 w-9 p-0 rounded-xl',
                'bg-white/40 dark:bg-white/10',
                'hover:bg-white/60 dark:hover:bg-white/20',
                'border border-white/20 dark:border-white/10',
                'backdrop-blur-sm transition-all duration-200'
              )}
            >
              <Search className="size-4" />
              <span className="sr-only">Cerca</span>
            </Button>
          )}

          {/* Notifications */}
          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'relative h-9 w-9 p-0 rounded-xl',
                'bg-white/40 dark:bg-white/10',
                'hover:bg-white/60 dark:hover:bg-white/20',
                'border border-white/20 dark:border-white/10',
                'backdrop-blur-sm transition-all duration-200'
              )}
            >
              <Bell className="size-4" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifiche</span>
            </Button>
          )}

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'h-9 w-9 p-0 rounded-xl',
                'bg-white/40 dark:bg-white/10',
                'hover:bg-white/60 dark:hover:bg-white/20',
                'border border-white/20 dark:border-white/10',
                'backdrop-blur-sm transition-all duration-200'
              )}
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              <span className="sr-only">Cambia tema</span>
            </Button>
          )}

          {/* Help */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 w-9 p-0 rounded-xl',
              'bg-white/40 dark:bg-white/10',
              'hover:bg-white/60 dark:hover:bg-white/20',
              'border border-white/20 dark:border-white/10',
              'backdrop-blur-sm transition-all duration-200'
            )}
          >
            <HelpCircle className="size-4" />
            <span className="sr-only">Aiuto</span>
          </Button>

          {/* User Menu */}
          <div className="ml-2">
            {isLoading ? (
              <div className="size-9 animate-pulse rounded-full bg-white/20 dark:bg-white/10" />
            ) : userData ? (
              <UserDropdown
                userName={userData.name || userData.email.split('@')[0] || 'Utente'}
                userEmail={userData.email}
              />
            ) : (
              <div className="text-xs text-muted-foreground">Non autenticato</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Progress Section */}
      {userData && (
        <div className="border-t border-white/10 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-sm lg:hidden">
          <div className="mx-auto max-w-screen-xl px-4 py-3">
            <ProgressDisplay
              pathName={userData.progress.pathName}
              completedLessons={userData.progress.completedLessons}
              totalLessons={userData.progress.totalLessons}
              progressPercentage={userData.progress.progressPercentage}
              className="flex-1"
            />
            
            {/* Mobile Gamification Row */}
            {showGamification && (
              <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <StreakIcon size={16} className="text-orange-500" />
                  <span className="font-medium">{userData.progress.currentStreak} giorni</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <XPIcon size={16} className="text-primary" />
                  <span className="font-medium">{userData.progress.totalXP} XP</span>
                  <span className="text-muted-foreground">• Lv. {level}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};