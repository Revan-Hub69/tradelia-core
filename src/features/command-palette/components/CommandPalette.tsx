'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import * as Dialog from '@radix-ui/react-dialog';
import { useCommandStore } from '../store/command-store';
import type { Command } from '../store/command-store';
import { fuzzySearch } from '../lib/fuzzy-search';
import { CommandList } from './CommandList';
import { CommandInput } from './CommandInput';
import { useHotkey } from '@/shared/hooks/useHotkey';
import { cn } from '@/shared/ui/utils';

interface CommandPaletteProps {
  commands: Command[];
}

export function CommandPalette({ commands }: CommandPaletteProps) {
  const t = useTranslations('dashboard.commandPalette');
  const {
    isOpen,
    query,
    selectedIndex,
    recentCommands,
    setOpen,
    setQuery,
    setSelectedIndex,
    addToRecent,
    addToHistory
  } = useCommandStore();

  const filteredCommands = query 
    ? fuzzySearch(query, commands)
    : recentCommands.length > 0 
      ? recentCommands 
      : commands.slice(0, 8);

  // Command palette toggle hotkey
  useHotkey(
    'command-palette-toggle',
    'k',
    () => setOpen(!isOpen),
    {
      metaKey: true, // Cmd on Mac
      ctrlKey: true, // Ctrl on Windows/Linux
      description: 'Toggle command palette'
    }
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, filteredCommands.length - 1));
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
        break;
        
      case 'Enter':
        event.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          selectedCommand.action();
          addToRecent(selectedCommand);
          addToHistory(query);
          setOpen(false);
        }
        break;
    }
  }, [isOpen, selectedIndex, filteredCommands, query, setOpen, setSelectedIndex, addToRecent, addToHistory]);

  // Reset selected index when commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length, setSelectedIndex]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-in fade-in-0 duration-200" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-lg rounded border-2 border-border bg-background shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
          onKeyDown={handleKeyDown}
        >
          <div className="flex flex-col max-h-96">
            <CommandInput
              value={query}
              onChange={setQuery}
              placeholder={t('placeholder')}
            />
            
            <CommandList
              commands={filteredCommands}
              selectedIndex={selectedIndex}
              query={query}
              onSelect={(command) => {
                command.action();
                addToRecent(command);
                addToHistory(query);
                setOpen(false);
              }}
              showRecent={!query && recentCommands.length > 0}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}