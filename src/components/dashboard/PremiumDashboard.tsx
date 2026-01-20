'use client';

import { Award, BarChart3, Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import React from 'react';

import type { LearningPath, ProgressData } from './types';

type PremiumDashboardProps = {
  userProgress: ProgressData;
  learningPaths: LearningPath[];
  className?: string;
};

/**
 * PremiumDashboard - Enhanced analytics and features for premium users
 *
 * Features:
 * - Advanced analytics dashboard
 * - Detailed progress insights
 * - Performance trends
 * - Goal tracking
 * - Study time analytics
 * - Achievement insights
 */
export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({
  userProgress,
  learningPaths,
  className = '',
}) => {
  // Calculate advanced metrics
  const completedPaths = learningPaths.filter(path => path.completionRate === 100);
  const averageProgress = learningPaths.reduce((sum, path) => sum + path.completionRate, 0) / learningPaths.length;
  const totalStudyTime = 1800; // Mock data - in real app this would come from userProgress
  const weeklyGoal = 300; // 5 hours default
  const weeklyProgress = (totalStudyTime / weeklyGoal) * 100;

  // Mock data for demonstration - in real app this would come from analytics service
  const weeklyStats = [
    { day: 'Lun', minutes: 45 },
    { day: 'Mar', minutes: 60 },
    { day: 'Mer', minutes: 30 },
    { day: 'Gio', minutes: 75 },
    { day: 'Ven', minutes: 40 },
    { day: 'Sab', minutes: 90 },
    { day: 'Dom', minutes: 55 },
  ];

  const maxMinutes = Math.max(...weeklyStats.map(stat => stat.minutes));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Premium Badge */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 dark:border-amber-800 dark:from-amber-950 dark:to-orange-950">
        <Award className="size-5 text-amber-600 dark:text-amber-400" />
        <span className="font-medium text-amber-800 dark:text-amber-200">Dashboard Premium</span>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Progress */}
        <div className="rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progresso Medio</p>
              <p className="text-2xl font-bold">
                {Math.round(averageProgress)}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Completed Paths */}
        <div className="rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <Target className="size-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Percorsi Completati</p>
              <p className="text-2xl font-bold">{completedPaths.length}</p>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <Calendar className="size-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Obiettivo Settimanale</p>
              <p className="text-2xl font-bold">
                {Math.round(weeklyProgress)}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Study Time */}
        <div className="rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
              <Clock className="size-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo di Studio</p>
              <p className="text-2xl font-bold">
                {Math.round(totalStudyTime / 60)}
                h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="rounded-lg border border-white/20 bg-white/40 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="size-5 text-primary" />
          <h3 className="text-lg font-semibold">Attività Settimanale</h3>
        </div>

        <div className="flex h-32 items-end justify-between gap-2">
          {weeklyStats.map((stat, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full rounded-t bg-gray-200 dark:bg-gray-700">
                <div
                  className="rounded-t bg-gradient-to-t from-primary to-primary/70 transition-all duration-500"
                  style={{
                    height: `${(stat.minutes / maxMinutes) * 100}px`,
                    minHeight: stat.minutes > 0 ? '4px' : '0px',
                  }}
                >
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">{stat.day}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.minutes}
                  m
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Learning Velocity */}
        <div className="rounded-lg border border-white/20 bg-white/40 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-semibold">Velocità di Apprendimento</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Lezioni completate/settimana</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Tempo medio per lezione</span>
              <span className="font-medium">8 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Tasso di completamento</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
          </div>
        </div>

        {/* Streak Analysis */}
        <div className="rounded-lg border border-white/20 bg-white/40 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-semibold">Analisi Streak</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Streak corrente</span>
              <span className="font-medium">
                {userProgress.currentStreak}
                {' '}
                giorni
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Streak più lungo</span>
              <span className="font-medium">
                {userProgress.longestStreak || 0}
                {' '}
                giorni
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Giorni attivi questo mese</span>
              <span className="font-medium text-blue-600">18/30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Recommendations */}
      <div className="rounded-lg border border-white/20 bg-white/40 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="mb-4 text-lg font-semibold">Raccomandazioni Personalizzate</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <TrendingUp className="size-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Ottimo ritmo di studio!</p>
              <p className="text-xs text-muted-foreground">
                Stai mantenendo una velocità costante. Considera di aumentare la difficoltà.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-950">
            <div className="rounded-full bg-amber-100 p-1 dark:bg-amber-900">
              <Target className="size-3 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Obiettivo settimanale quasi raggiunto</p>
              <p className="text-xs text-muted-foreground">
                Ti mancano solo 45 minuti per completare l'obiettivo di questa settimana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
