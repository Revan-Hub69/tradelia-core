'use client';

import { useUserData } from '@/hooks/useUserData';
import { Logo } from '@/templates/Logo';
import { cn } from '@/utils/Helpers';

import { UserDropdown } from './UserDropdown';

type MinimalDashboardHeaderProps = {
  className?: string;
};

export const MinimalDashboardHeader = ({ className }: MinimalDashboardHeaderProps) => {
  const { userData, isLoading } = useUserData();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border/20',
        'bg-background/95 backdrop-blur-sm',
        'shadow-sm',
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        {/* Left: Logo only */}
        <Logo size="sm" />

        {/* Right: User only */}
        <div className="flex items-center">
          {isLoading
            ? (
                <div className="size-8 animate-pulse rounded-full bg-muted" />
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
    </header>
  );
};
