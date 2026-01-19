import { createClient } from '@/libs/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type UserDropdownProps = {
  userName: string;
  userEmail: string;
};

export const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  userEmail,
}) => {
  const router = useRouter();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-10 items-center gap-3 px-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all backdrop-blur-sm"
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

          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border-border/50">
        {/* User Info */}
        <div className="px-3 py-2">
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
          onClick={() => router.push('/dashboard/user-profile')}
          className="flex cursor-pointer items-center gap-2"
        >
          <User className="size-4" />
          <span>Profilo</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings')}
          className="flex cursor-pointer items-center gap-2"
        >
          <Settings className="size-4" />
          <span>Impostazioni</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Esci</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};