'use client';

import { useUserData } from '@/hooks/useUserData';
import { Logo } from '@/templates/Logo';
import { cn } from '@/utils/Helpers';

import { ProgressDisplay } from './ProgressDisplay';
import { UserDropdown } from './UserDropdown';

type SimpleDashboardHeaderProps = {
  className?: string;
};

export const SimpleDashboardHeader = ({
  className,
}: SimpleDashboardHeaderProps) => {
  const { userData, isLoading } = useUserData();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 md:h-16 md:px-6">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo size="sm" />
        </div>

        {/* Center: Progress (Desktop only) */}
        <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {isLoading
            ? (
                <div className="h-8 w-48 animate-pulse rounded-lg bg-white/20" />
              )
            : userData
              ? (
                  <ProgressDisplay
                    pathName={userData.progress.pathName}
                    completedLessons={userData.progress.completedLessons}
                    totalLessons={userData.progress.totalLessons}
                    progressPercentage={userData.progress.progressPercentage}
                  />
                )
              : null}
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center">
          {isLoading
            ? (
                <div className="size-8 animate-pulse rounded-full bg-white/20" />
              )
            : userData
              ? (
                  <UserDropdown
                    userName={userData.name || userData.email.split('@')[0] || 'Utente'}
                    userEmail={userData.email}
                  />
                )
              : (
                  <div className="text-xs text-muted-foreground">Non autenticato</div>
                )}
        </div>
      </div>

      {/* Mobile Progress Section - Inside header height */}
      {userData && (
        <div className="border-t border-border/50 bg-background/60 backdrop-blur-sm lg:hidden">
          <div className="mx-auto max-w-screen-xl px-4 py-3">
            <ProgressDisplay
              pathName={userData.progress.pathName}
              completedLessons={userData.progress.completedLessons}
              totalLessons={userData.progress.totalLessons}
              progressPercentage={userData.progress.progressPercentage}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </header>
  );
};