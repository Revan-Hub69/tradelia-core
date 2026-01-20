import * as React from 'react';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/Helpers';

export type LevelIndicatorProps = {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  levelName: string; // i18n - passato dal parent
  showProgress?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

export function LevelIndicator({
  level,
  currentXP,
  xpForNextLevel,
  levelName,
  showProgress = true,
  size = 'md',
  className,
}: LevelIndicatorProps) {
  const progressPercent = Math.min(100, Math.round((currentXP / xpForNextLevel) * 100));

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className={cn('flex items-center justify-between', sizeClasses[size])}>
        <span className="font-medium">
          <span className="tabular-nums">
            Lv.
            {level}
          </span>
          {' '}
          {levelName}
        </span>
        {showProgress && (
          <span className="tabular-nums text-muted-foreground">
            {currentXP.toLocaleString('it-IT')}
            /
            {xpForNextLevel.toLocaleString('it-IT')}
          </span>
        )}
      </div>
      {showProgress && (
        <Progress value={progressPercent} variant="primary" size="sm" />
      )}
    </div>
  );
}
