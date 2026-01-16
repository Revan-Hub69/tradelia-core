'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ToggleMenuButton } from '@/components/ToggleMenuButton';
import { cn } from '@/utils/Helpers';

export const CenteredMenu = (props: {
  logo: React.ReactNode;
  children: React.ReactNode;
  rightMenu: React.ReactNode;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu(prev => !prev);
  };

  // Blocca scroll quando menu è aperto
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMenu]);

  // Chiudi menu quando si clicca un link
  const handleLinkClick = () => {
    setShowMenu(false);
  };

  return (
    <div className="flex items-center justify-between">
      <Link href="/" className="relative z-50">
        {props.logo}
      </Link>

      {/* Hamburger button - sempre visibile su mobile */}
      <div className="relative z-50 lg:hidden">
        <ToggleMenuButton onClick={handleToggleMenu} isOpen={showMenu} />
      </div>

      {/* Desktop menu */}
      <nav className="hidden lg:block">
        <ul className="flex gap-x-6 text-sm font-medium [&_a:hover]:text-foreground [&_a]:text-muted-foreground [&_a]:transition-colors">
          {props.children}
        </ul>
      </nav>

      {/* Desktop right menu */}
      <div className="hidden lg:block">
        <ul className="flex items-center gap-x-4 text-sm font-medium [&_li[data-fade]:hover]:text-foreground [&_li[data-fade]]:text-muted-foreground [&_li[data-fade]]:transition-colors">
          {props.rightMenu}
        </ul>
      </div>

      {/* Mobile menu - Fullscreen overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 lg:hidden',
          showMenu
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {/* Mobile nav links */}
          <nav>
            <ul
              className="flex flex-col items-center gap-6 text-xl font-medium"
              onClick={handleLinkClick}
              onKeyDown={e => e.key === 'Enter' && handleLinkClick()}
              role="presentation"
            >
              {props.children}
            </ul>
          </nav>

          {/* Mobile right menu */}
          <div className="flex flex-col items-center gap-4">
            <ul
              className="flex flex-col items-center gap-4 text-lg font-medium"
              onClick={handleLinkClick}
              onKeyDown={e => e.key === 'Enter' && handleLinkClick()}
              role="presentation"
            >
              {props.rightMenu}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
