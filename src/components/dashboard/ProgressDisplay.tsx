import { cn } from '@/utils/Helpers';
import React from 'react';

type ProgressDisplayProps = {
  pathName: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  className?: string;
};

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  pathName,
  completedLessons,
  totalLessons,
  progressPercentage,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Path Name */}
      <span className="whitespace-nowrap text-sm font-medium text-foreground">
        {pathName}
      </span>

      {/* Progress Bar - Premium glassmorphism */}
      <div className="flex items-center gap-3">
        <div className="relative h-2 w-32 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>

        {/* Progress Text - Aligned properly */}
        <div className="flex items-center whitespace-nowrap text-sm text-muted-foreground tabular-nums">
          <span className="font-semibold text-foreground">{completedLessons}</span>
          <span className="mx-1">/</span>
          <span>{totalLessons}</span>
        </div>
      </div>
    </div>
  );
};