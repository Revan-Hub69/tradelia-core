import * as React from 'react';

import { badgeVariants } from '@/components/ui/badgeVariants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/Helpers';

export type PathCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  difficultyLabel: string; // i18n - passato dal parent
  hoursLabel?: string; // i18n - default "h"
  progress?: number; // 0-100, undefined se non iscritto
  onClick?: () => void;
  className?: string;
};

const difficultyVariants = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
} as const;

export function PathCard({
  title,
  description,
  icon,
  difficulty,
  estimatedHours,
  difficultyLabel,
  hoursLabel = 'h',
  progress,
  onClick,
  className,
}: PathCardProps) {
  const isEnrolled = progress !== undefined;

  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className={cn('flex h-full flex-col', className)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <span className={cn(badgeVariants({ variant: difficultyVariants[difficulty] }), 'shrink-0')}>
            {difficultyLabel}
          </span>
        </div>
        <CardTitle className="mt-4 line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="tabular-nums">
            {estimatedHours}
            {hoursLabel}
          </span>
          {isEnrolled && (
            <span className="tabular-nums">
              {progress}
              %
            </span>
          )}
        </div>
        {isEnrolled && (
          <Progress value={progress} className="mt-2" size="sm" />
        )}
      </CardContent>
    </Card>
  );
}
