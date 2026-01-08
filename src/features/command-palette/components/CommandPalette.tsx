/**
 * Command Palette Component - Tradelia 2026
 * 
 * Componente principale della command palette
 * Design ispirato a VS Code/Linear ma seguendo i principi Tradelia 2026
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import * as Dialog from '@radix-ui/react-dialog';
import { useCommandStore } from '../store/command-store';
import { CommandInput, type CommandInputRef } from './CommandInput';
import { CommandList } from './CommandList';
import { useHotkey } from '@/shared/hooks/useHotkey';
import { cn } from '@/shared/ui/utils';
import type { Command } from '@/entities/command';

interface CommandPaletteProps {
  commands: Command[];
  className?: string;
}

export function CommandPalette({ commands, className }: CommandPaletteProps) {
  const t = useTranslations('dashboard.commandPalette');
  const inputRef = useRef<CommandInputRef>(null);
  
  const {
    isOpen,
    query,
    selectedIndex,
    filteredCommands,
    setOpen,
    setQuery,
    selectNext,
    selectPrevious,
    executeSelected,
    executeCommand,
    setAllCommands
  } = useCommandStore();

  // Update commands when prop changes
  useEffect(() => {
    setAllCommands(commands);
  }, [commands, setAllCommands]);

  // Global hotkey to open/close
  useHotkey('cmd+k', useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]));

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure dialog is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectNext();
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectPrevious();
        break;
      case 'Enter':
        event.preventDefault();
        executeSelected();
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
    }
  }, [selectNext, selectPrevious, executeSelected, setOpen]);

  const handleSelectCommand = useCallback((command: Command) => {
    executeCommand(command);
  }, [executeCommand]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className={cn(
            'fixed inset-0 z-50',
            'bg-background/80 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/3 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
            'bg-background border-2 border-border rounded-lg shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            className
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="border-b border-border/50">
            <CommandInput
              ref={inputRef}
              value={query}
              onChange={setQuery}
              placeholder={t('placeholder')}
            />
          </div>

          {/* Command List */}
          <CommandList
            commands={filteredCommands}
            selectedIndex={selectedIndex}
            onSelectCommand={handleSelectCommand}
            query={query}
          />

          {/* Footer */}
          <div className="border-t border-border/50 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑↓</kbd>
                  {t('shortcuts.navigate')}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd>
                  {t('shortcuts.select')}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd>
                  {t('shortcuts.close')}
                </span>
              </div>
              {filteredCommands.length > 0 && (
                <span>
                  {filteredCommands.length} comando{filteredCommands.length !== 1 ? 'i' : ''}
                </span>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}