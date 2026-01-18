'use client';

import React, { useState } from 'react';
import { Trophy, Star, Target, Award, ChevronRight, Sparkles, Plus } from 'lucide-react';

import { cn } from '@/utils/Helpers';
import { useXPSystem } from '@/hooks/useXPSystem';
import { LevelUpAnimation, XPGainAnimation } from './LevelUpAnimation';
import type { GamificationPanelProps, Badge, Achievement } from './types';

/**
 * GamificationPanel - Badges and achievements display component with XP system
 * 
 * Requirements: 3.2, 3.3, 3.5
 * - Mostrare XP corrente e progress verso next level
 * - Implementare level-up animations
 * - Utilizzare micro-interazioni premium esistenti
 * - Creare sezione dedicata per achievements
 * - Implementare animation per nuovi badges
 * 
 * Features:
 * - Integrated XP and level system with animations
 * - Glass card styling consistent with existing design system
 * - Premium micro-interactions and animations
 * - Badge rarity system with visual distinctions
 * - Achievement progress tracking
 * - Expandable sections for better organization
 */

type GamificationPanelWithXPProps = Omit<GamificationPanelProps, 'xp' | 'level'> & {
  initialXP?: number;
  onXPChange?: (xp: number, level: number) => void;
};

export const GamificationPanel: React.FC<GamificationPanelWithXPProps> = ({
  streak,
  initialXP = 0,
  badges,
  achievements,
  showLeaderboard = false,
  onXPChange,
}) => {
  const [expandedSection, setExpandedSection] = useState<'badges' | 'achievements' | null>('badges');
  
  // XP System integration
  const { xpState, addXP, triggerLevelUpAnimation, clearRecentXPGain, isAnimating } = useXPSystem(initialXP);

  // Notify parent of XP changes
  React.useEffect(() => {
    onXPChange?.(xpState.currentXP, xpState.level);
  }, [xpState.currentXP, xpState.level, onXPChange]);

  // Get rarity colors and effects
  const getRarityStyles = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return {
          bg: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
          border: 'border-yellow-400/50',
          glow: 'shadow-lg shadow-yellow-500/25',
          text: 'text-yellow-100',
        };
      case 'epic':
        return {
          bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600',
          border: 'border-purple-400/50',
          glow: 'shadow-lg shadow-purple-500/25',
          text: 'text-purple-100',
        };
      case 'rare':
        return {
          bg: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600',
          border: 'border-blue-400/50',
          glow: 'shadow-lg shadow-blue-500/25',
          text: 'text-blue-100',
        };
      case 'common':
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600',
          border: 'border-slate-400/50',
          glow: 'shadow-lg shadow-slate-500/25',
          text: 'text-slate-100',
        };
    }
  };

  // Format date for badge unlock
  const formatUnlockDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Oggi';
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays} giorni fa`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`;
    return date.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
  };

  // Recent badges (unlocked in last 7 days)
  const recentBadges = badges.filter((badge) => {
    const daysSinceUnlock = (Date.now() - badge.unlockedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUnlock <= 7;
  });

  // Active achievements (not yet unlocked)
  const activeAchievements = achievements.filter(achievement => !achievement.isUnlocked);
  const completedAchievements = achievements.filter(achievement => achievement.isUnlocked);

  // Demo function to add XP (for testing)
  const handleAddXP = (amount: number) => {
    addXP(amount, 'manual');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Level and XP Overview with Interactive Elements */}
        <div className={cn(
          'relative overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm shadow-black/5',
          'dark:border-white/10 dark:bg-white/10 dark:shadow-black/20',
          isAnimating && 'ring-2 ring-primary/50 ring-offset-2'
        )}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 transition-all duration-300',
                xpState.isLevelingUp && 'animate-pulse scale-110 shadow-lg shadow-primary/50'
              )}>
                <Trophy className="size-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Livello
                  {' '}
                  {xpState.level}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {xpState.currentXP.toLocaleString()}
                  {' '}
                  XP totali
                </p>
              </div>
            </div>

            {/* Demo XP buttons (remove in production) */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAddXP(50)}
                className="flex items-center gap-1 rounded-lg bg-primary/20 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
              >
                <Plus className="size-3" />
                50 XP
              </button>
              <button
                type="button"
                onClick={() => handleAddXP(200)}
                className="flex items-center gap-1 rounded-lg bg-primary/20 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
              >
                <Plus className="size-3" />
                200 XP
              </button>
            </div>
          </div>

          {/* XP Progress Bar with Enhanced Animations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">
                Progresso al Livello
                {' '}
                {xpState.level + 1}
              </span>
              <span className="font-semibold tabular-nums">
                {Math.round(xpState.progressToNextLevel)}
                %
              </span>
            </div>
            
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
              <div
                className={cn(
                  'relative h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out',
                  isAnimating && 'animate-pulse'
                )}
                style={{ width: `${xpState.progressToNextLevel}%` }}
              >
                {/* Enhanced shimmer effect */}
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                {/* Glow effect when animating */}
                {isAnimating && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary/50 to-primary/30" />
                )}
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {(xpState.currentXP - xpState.xpForCurrentLevel).toLocaleString()}
                {' '}
                XP
              </span>
              <span>
                {(xpState.xpForNextLevel - xpState.currentXP).toLocaleString()}
                {' '}
                XP rimanenti
              </span>
            </div>
          </div>

          {/* Streak Display with Special Effects */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                'text-2xl transition-all duration-300',
                streak >= 7 && 'animate-bounce'
              )}>
                🔥
              </div>
              <div>
                <div className="text-sm font-medium">
                  Streak Attuale:
                  {' '}
                  {streak}
                  {' '}
                  giorni
                </div>
                <div className="text-xs text-muted-foreground">
                  Continua così per mantenere il ritmo!
                </div>
              </div>
            </div>
            {streak >= 7 && (
              <div className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                <Sparkles className="size-3" />
                <span>In fiamme!</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Badges Highlight */}
        {recentBadges.length > 0 && (
          <div className={cn(
            'relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-6 shadow-sm shadow-black/5',
            'dark:border-primary/30 dark:from-primary/20 dark:to-primary/10'
          )}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/20">
                <Sparkles className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nuovi Traguardi!</h3>
                <p className="text-sm text-muted-foreground">
                  Badge sbloccati di recente
                </p>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentBadges.map((badge) => {
                const styles = getRarityStyles(badge.rarity);
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      'group relative flex-shrink-0 rounded-xl border p-4 transition-all duration-300 hover:scale-105',
                      styles.bg,
                      styles.border,
                      styles.glow,
                      'animate-bounce-in'
                    )}
                  >
                    <div className="text-center">
                      <div className="mb-2 text-2xl">{badge.icon}</div>
                      <div className={cn('text-sm font-medium', styles.text)}>
                        {badge.name}
                      </div>
                      <div className="text-xs opacity-80">
                        {formatUnlockDate(badge.unlockedAt)}
                      </div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/90 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {badge.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badges Section */}
        <div className={cn(
          'relative overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm shadow-sm shadow-black/5',
          'dark:border-white/10 dark:bg-white/10 dark:shadow-black/20'
        )}>
          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === 'badges' ? null : 'badges')}
            className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/80 dark:hover:bg-white/20"
          >
            <div className="flex items-center gap-3">
              <Award className="size-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Badge Collection</h3>
                <p className="text-sm text-muted-foreground">
                  {badges.length}
                  {' '}
                  badge sbloccati
                </p>
              </div>
            </div>
            <ChevronRight className={cn(
              'size-5 text-muted-foreground transition-transform',
              expandedSection === 'badges' && 'rotate-90'
            )} />
          </button>

          {expandedSection === 'badges' && (
            <div className="border-t border-white/20 p-6 dark:border-white/10">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {badges.map((badge) => {
                  const styles = getRarityStyles(badge.rarity);
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        'group relative rounded-xl border p-4 transition-all duration-300 hover:scale-105',
                        styles.bg,
                        styles.border,
                        styles.glow
                      )}
                    >
                      <div className="text-center">
                        <div className="mb-2 text-2xl">{badge.icon}</div>
                        <div className={cn('text-sm font-medium', styles.text)}>
                          {badge.name}
                        </div>
                        <div className="mt-1 text-xs opacity-80">
                          {badge.rarity}
                        </div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/90 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="font-medium">{badge.name}</div>
                        <div className="mt-1">{badge.description}</div>
                        <div className="mt-1 text-xs opacity-75">
                          Sbloccato:
                          {' '}
                          {formatUnlockDate(badge.unlockedAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className={cn(
          'relative overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm shadow-sm shadow-black/5',
          'dark:border-white/10 dark:bg-white/10 dark:shadow-black/20'
        )}>
          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === 'achievements' ? null : 'achievements')}
            className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/80 dark:hover:bg-white/20"
          >
            <div className="flex items-center gap-3">
              <Target className="size-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Obiettivi</h3>
                <p className="text-sm text-muted-foreground">
                  {completedAchievements.length}
                  /
                  {achievements.length}
                  {' '}
                  completati
                </p>
              </div>
            </div>
            <ChevronRight className={cn(
              'size-5 text-muted-foreground transition-transform',
              expandedSection === 'achievements' && 'rotate-90'
            )} />
          </button>

          {expandedSection === 'achievements' && (
            <div className="border-t border-white/20 p-6 dark:border-white/10">
              <div className="space-y-4">
                {/* Active Achievements */}
                {activeAchievements.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">In Corso</h4>
                    <div className="space-y-3">
                      {activeAchievements.slice(0, 3).map((achievement) => (
                        <div
                          key={achievement.id}
                          className="rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h5 className="font-medium">{achievement.title}</h5>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              
                              {/* Progress Bar */}
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Progresso</span>
                                  <span className="tabular-nums">
                                    {achievement.progress}
                                    /
                                    {achievement.maxProgress}
                                  </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
                                  <div
                                    className="h-1.5 rounded-full bg-primary transition-all duration-500 ease-out"
                                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Achievements */}
                {completedAchievements.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">Completati</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {completedAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="rounded-lg border border-green-200/50 bg-green-50/50 p-3 backdrop-blur-sm dark:border-green-800/50 dark:bg-green-950/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h5 className="text-sm font-medium">{achievement.title}</h5>
                              <p className="text-xs text-muted-foreground">
                                {achievement.unlockedAt && formatUnlockDate(achievement.unlockedAt)}
                              </p>
                            </div>
                            <Star className="size-4 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Level Up Animation */}
      <LevelUpAnimation
        isVisible={xpState.isLevelingUp}
        newLevel={xpState.level}
        onComplete={() => {
          // Level up animation completed
        }}
      />

      {/* XP Gain Animation */}
      <XPGainAnimation
        amount={xpState.recentXPGain || 0}
        isVisible={xpState.recentXPGain !== null}
        onComplete={clearRecentXPGain}
      />
    </>
  );
};