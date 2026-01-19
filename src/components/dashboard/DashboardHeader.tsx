'use client';

import React from 'react';
import Link from 'next/link';

import { Settings, User, LogOut, Crown } from 'lucide-react';
import { StreakIcon, XPIcon } from '@/components/icons';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/templates/Logo';

import type { DashboardHeaderProps } from './types';

/**
 * DashboardHeader - Enhanced header extending LessonHeader patterns
 * 
 * Features:
 * - Glassmorphism styling consistent with LessonHeader
 * - User menu dropdown in top-right corner (Requirement 4.1)
 * - Streak counter integration in header (Requirement 3.1)
 * - Premium subscription indicators
 * - Mobile-responsive design (Requirement 5.2, 9.4)
 * - Maintains same z-index hierarchy as LessonHeader (Requirement 9.2)
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  currentStreak,
  totalXP,
  onSettingsClick,
  showGamification = true,
}) => {
  const isPremium = user.subscription === 'premium';
  const level = Math.floor(totalXP / 100) + 1; // Simple level calculation

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 md:h-16 md:px-6">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center gap-4">
          <Logo size="sm" href="/dashboard" />
          
          <div className="hidden md:block h-6 w-px bg-border" />
          
          <nav className="hidden md:block">
            <div className="text-sm font-medium text-muted-foreground">
              Dashboard
            </div>
          </nav>
        </div>

        {/* Center Section - Gamification (Desktop) - Requirement 3.1 */}
        {showGamification && (
          <div className="hidden lg:flex items-center gap-4 md:gap-6">
            {/* Streak Counter - Glassmorphism styling matching LessonHeader pattern */}
            <div className="group relative flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 backdrop-blur-sm transition-all hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20">
              <StreakIcon size={18} className="text-orange-500" />
              <div className="text-sm font-semibold">
                <span className="sr-only">Streak corrente:</span>
                {currentStreak} giorni
              </div>
            </div>

            {/* XP and Level - Consistent glassmorphism */}
            <div className="flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 backdrop-blur-sm dark:bg-white/10">
              <XPIcon size={18} className="text-primary" />
              <div className="text-sm">
                <span className="font-semibold">{totalXP}</span>
                <span className="text-muted-foreground"> XP</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Lv. {level}
              </div>
            </div>
          </div>
        )}

        {/* Right Section - User Menu - Requirement 4.1 */}
        <div className="flex items-center gap-3">
          {/* Premium Badge */}
          {isPremium && (
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-xs font-medium text-white">
              <Crown className="size-3" />
              Premium
            </div>
          )}

          {/* Mobile Gamification - Requirement 5.2 - Optimized for viewport < 768px */}
          {showGamification && (
            <div className="flex lg:hidden items-center gap-2 rounded-lg bg-white/60 px-2 py-1 backdrop-blur-sm dark:bg-white/10 transition-all hover:bg-white/80 dark:hover:bg-white/20">
              <StreakIcon size={14} className="text-orange-500" />
              <span className="text-xs font-medium">{currentStreak}</span>
              {/* Show XP on larger mobile screens */}
              <div className="hidden sm:flex lg:hidden items-center gap-1 ml-2 pl-2 border-l border-white/20">
                <XPIcon size={12} className="text-primary" />
                <span className="text-xs font-medium">{totalXP}</span>
              </div>
            </div>
          )}

          {/* User Dropdown - Top-right corner as per Requirement 4.1 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 rounded-full hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                aria-label={`Menu utente per ${user.name || user.email}`}
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                {/* Hide username on mobile to save space - Requirement 5.2 */}
                <span className="hidden md:inline text-sm font-medium">
                  {user.name || user.email.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm">
              {/* User Info */}
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name || 'Utente'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {isPremium && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                    <Crown className="size-3" />
                    Premium attivo
                  </div>
                )}
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Menu Items */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/user-profile" className="flex items-center gap-2">
                  <User className="size-4" />
                  Profilo
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={onSettingsClick} className="flex items-center gap-2">
                <Settings className="size-4" />
                Impostazioni
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Esci
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};