/*
 * COMMAND PALETTE - Desktop Enterprise Feature
 *
 * Cmd+K / Ctrl+K command palette for quick navigation and actions
 * Enterprise-level productivity feature
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { DynamicIcon, type IconName } from '@/components/icons';
import { getVisibleNavigationItems } from '@/data/navigation.config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type CommandPaletteProps = {
  className?: string;
};

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: IconName;
  action: () => void;
  category: 'navigation' | 'actions' | 'settings';
  keywords: string[];
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const t = useTranslations();
  const router = useRouter();
  const navigationItems = getVisibleNavigationItems();

  // Generate commands from navigation items and actions
  const commands: Command[] = [
    // Navigation commands
    ...navigationItems.map((item, index) => ({
      id: `nav-${item.id}`,
      label: t(item.labelKey as any),
      description: t(`Dashboard.nav_${item.id}_desc` as any, { defaultValue: '' }),
      icon: item.iconName as IconName,
      action: () => {
        router.push(item.href);
        setOpen(false);
      },
      category: 'navigation' as const,
      keywords: [t(item.labelKey as any).toLowerCase(), item.id, `alt+${index + 1}`],
    })),

    // Action commands
    {
      id: 'theme-toggle',
      label: t('Dashboard.toggle_theme' as any),
      description: t('Dashboard.toggle_theme_desc' as any),
      icon: 'SettingsIcon' as IconName,
      action: () => {
        // Theme toggle logic would go here
        setOpen(false);
      },
      category: 'settings',
      keywords: ['theme', 'dark', 'light', 'appearance'],
    },
    {
      id: 'focus-mode',
      label: t('Dashboard.enable_focus_mode' as any),
      description: t('Dashboard.focus_mode_desc' as any),
      icon: 'HomeIcon' as IconName,
      action: () => {
        // Focus mode logic would go here
        setOpen(false);
      },
      category: 'actions',
      keywords: ['focus', 'concentration', 'distraction'],
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(search.toLowerCase())
    || command.keywords.some((keyword) => keyword.includes(search.toLowerCase())),
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command palette
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      // Close on Escape
      if (e.key === 'Escape' && open) {
        setOpen(false);
        return;
      }

      // Navigation within palette
      if (open) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1,
          );
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Reset search when opening
  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open]);

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category]!.push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          'max-w-2xl p-0 gap-0 glass-surface layer-modal',
          className,
        )}
        aria-describedby="command-palette-description"
      >
        <DialogHeader className="px-4 py-3 border-b border-border/20">
          <DialogTitle className="text-sm font-medium text-left">
            {t('Dashboard.command_palette_title' as any)}
          </DialogTitle>
          <p id="command-palette-description" className="sr-only">
            {t('Dashboard.command_palette_description' as any)}
          </p>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-4 py-3 border-b border-border/20">
          <Input
            placeholder={t('Dashboard.command_palette_placeholder' as any)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <div key={category} className="p-2">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t(`Dashboard.command_category_${category}` as any)}
              </div>

              {categoryCommands.map((command) => {
                const globalIndex = filteredCommands.indexOf(command);
                const isSelected = globalIndex === selectedIndex;

                return (
                  <button
                    key={command.id}
                    type="button"
                    onClick={command.action}
                    className={cn(
                      'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left',
                      'hover:bg-white/60 dark:hover:bg-white/10 transition-colors',
                      'focus:outline-none focus:bg-white/60 dark:focus:bg-white/10',
                      isSelected && 'bg-primary/10 text-primary',
                    )}
                  >
                    <DynamicIcon
                      name={command.icon}
                      size={16}
                      className="shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {command.label}
                      </div>
                      {command.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {command.description}
                        </div>
                      )}
                    </div>

                    {/* Keyboard shortcut hint */}
                    {command.keywords.find((k) => k.startsWith('alt+')) && (
                      <div className="text-xs text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                        {command.keywords.find((k) => k.startsWith('alt+'))?.toUpperCase()}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <DynamicIcon name="HomeIcon" size={24} className="mx-auto mb-2 opacity-50" />
              <div className="text-sm">
                {t('Dashboard.command_palette_no_results' as any)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/20 bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                ↑↓ {t('Dashboard.navigate' as any)}
              </span>
              <span>
                ↵ {t('Dashboard.select' as any)}
              </span>
              <span>
                esc {t('Dashboard.close' as any)}
              </span>
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
              </kbd>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};