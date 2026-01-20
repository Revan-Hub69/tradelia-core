import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { ChevronDownIcon, LogoutIcon, ProfileIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFocusTrap } from '@/hooks/useFocusManagement';
import { useRouter } from '@/libs/i18nNavigation';
import { createClient } from '@/libs/supabase/client';
import { cn } from '@/utils/Helpers';

type UserDropdownProps = {
  userName: string;
  userEmail: string;
};

export const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  userEmail,
}) => {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex h-10 items-center gap-3 px-3 rounded-xl',
            'glass-surface hover:bg-white/60 dark:hover:bg-white/10',
            'press-depth focus-ring touch-optimized',
          )}
          aria-label={t('nav_open_user_menu')}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {/* Avatar - Premium styling */}
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-lg">
            {getInitials(userName)}
          </div>

          {/* User Info - Hidden on mobile */}
          <div className="hidden text-left sm:block">
            <div className="max-w-32 truncate text-sm font-medium text-foreground">
              {userName}
            </div>
          </div>

          <ChevronDownIcon
            size={16}
            className={cn(
              'text-muted-foreground motion-fast',
              isOpen && 'rotate-180',
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={focusTrapRef as React.RefObject<HTMLDivElement>}
        align="end"
        className="glass-surface layer-popover w-56"
        onCloseAutoFocus={(e) => {
          // Prevent default to handle focus restoration manually
          e.preventDefault();
        }}
      >
        {/* User Info */}
        <div className="px-3 py-2" role="presentation">
          <div className="truncate text-sm font-medium text-foreground">
            {userName}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {userEmail}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/profile')}
          className="focus-ring flex cursor-pointer items-center gap-2"
        >
          <ProfileIcon size={16} />
          <span>{t('profile')}</span>
        </DropdownMenuItem>

        {/* Settings temporaneamente rimosso - route non esiste */}
        {/*
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings')}
          className="flex cursor-pointer items-center gap-2 focus-ring"
        >
          <SettingsIcon size={16} />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        */}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="focus-ring flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
        >
          <LogoutIcon size={16} />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
