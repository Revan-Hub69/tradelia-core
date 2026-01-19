'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { STREAK_MILESTONES, type StreakMilestone } from '@/libs/gamification';

interface StreakIndicatorProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  size?: 'sm' | 'md' | 'lg';
  showMilestones?: boolean;
}

export const StreakIndicator = ({ 
  currentStreak, 
  longestStreak, 
  lastActivityDate,
  size = 'md',
  showMilestones = false 
}: StreakIndicatorProps) => {
  const t = useTranslations('Gamification');
  const isActive = lastActivityDate && 
    new Date().getTime() - lastActivityDate.getTime() < 24 * 60 * 60 * 1000; // Within 24 hours
  
  const nextMilestone = STREAK_MILESTONES.find((m: StreakMilestone) => m.days > currentStreak);
  const achievedMilestones = STREAK_MILESTONES.filter((m: StreakMilestone) => m.days <= currentStreak);
  
  // Responsive size classes using 4px spacing scale
  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8 text-xs',
    md: 'w-10 h-10 sm:w-12 sm:h-12 text-sm',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-base'
  };

  const flameColors = {
    0: '#6B7280', // Gray
    1: '#F59E0B', // Amber
    3: '#EF4444', // Red
    7: '#8B5CF6', // Purple
    14: '#EC4899', // Pink
    30: '#F97316', // Orange
    100: '#DC2626' // Deep Red
  };

  const getFlameColor = (streak: number) => {
    const thresholds = Object.keys(flameColors).map(Number).sort((a, b) => b - a);
    const threshold = thresholds.find(t => streak >= t) || 0;
    return flameColors[threshold as keyof typeof flameColors];
  };

  return (
    <div className="space-y-3">
      {/* Main Streak Display */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Flame Icon */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative`}
          style={{ 
            backgroundColor: isActive ? getFlameColor(currentStreak) : 'hsl(var(--muted))',
            boxShadow: isActive ? `0 0 20px ${getFlameColor(currentStreak)}40` : 'none'
          }}
          animate={isActive && currentStreak > 0 ? {
            scale: [1, 1.1, 1],
            boxShadow: [
              `0 0 20px ${getFlameColor(currentStreak)}40`,
              `0 0 30px ${getFlameColor(currentStreak)}60`,
              `0 0 20px ${getFlameColor(currentStreak)}40`
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg 
            className="w-2/3 h-2/3 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M13.5 0.5C13.5 0.5 21 4.5 21 11.5C21 18.5 16 23.5 9.5 23.5C3 23.5 -2 18.5 2 11.5C6 4.5 13.5 0.5 13.5 0.5Z"/>
            <path d="M9.5 7.5C9.5 7.5 14 9.5 14 13.5C14 17.5 11.5 20.5 8.5 20.5C5.5 20.5 3 17.5 5 13.5C7 9.5 9.5 7.5 9.5 7.5Z" fill="white" opacity="0.7"/>
          </svg>
          
          {/* Streak Number */}
          <div className="absolute -bottom-1 -right-1 bg-card text-foreground rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold border-2 border-border">
            {currentStreak}
          </div>
        </motion.div>
        
        {/* Streak Info */}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-foreground text-sm sm:text-base">
            {currentStreak} {currentStreak === 1 ? t('day') : t('days')}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Record: {longestStreak} {longestStreak === 1 ? t('day') : t('days')}
          </div>
          {!isActive && currentStreak > 0 && (
            <div className="text-xs text-destructive">
              {t('streak_broken')}
            </div>
          )}
        </div>
      </div>
      
      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {t('next_milestone')}
            </span>
            <span className="text-xs text-muted-foreground">
              {nextMilestone.days - currentStreak} {t('days_remaining')}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">
                {nextMilestone.title.it}
              </span>
              <span className="text-sm text-warning font-medium">
                +{nextMilestone.xpBonus} {t('xp')}
              </span>
            </div>
            
            {/* Progress to next milestone */}
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-warning to-destructive"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Milestone History */}
      {showMilestones && achievedMilestones.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            {t('milestones_achieved')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {achievedMilestones.map((milestone: StreakMilestone, milestoneIndex: number) => (
              <motion.div
                key={milestone.days}
                className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg p-2 border border-warning/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: milestoneIndex * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-warning rounded-full flex items-center justify-center">
                    <span className="text-warning-foreground text-xs font-bold">✓</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {milestone.title.it}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {milestone.days} {t('days')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};