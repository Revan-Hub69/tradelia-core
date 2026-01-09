'use client';

import { useTranslations } from 'next-intl';
import { Command } from '../store/command-store';
import { CommandItem } from './CommandItem';

interface CommandListProps {
  commands: Command[];
  selectedIndex: number;
  query: string;
  onSelect: (command: Command, index: number) => void;
  showRecent?: boolean;
}

export function CommandList({ 
  commands, 
  selectedIndex, 
  query, 
  onSelect, 
  showRecent = false 
}: CommandListProps) {
  const t = useTranslations('dashboard.commandPalette');

  if (commands.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {query ? t('noResults') : t('noCommands')}
        </p>
      </div>
    );
  }

  // Group commands by category
  const groupedCommands = commands.reduce((acc, command, index) => {
    const category = command.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ command, originalIndex: index });
    return acc;
  }, {} as Record<string, Array<{ command: Command; originalIndex: number }>>);

  return (
    <div className="max-h-80 overflow-y-auto">
      {showRecent && (
        <div className="px-4 py-2 border-b border-border/50">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('recent')}
          </p>
        </div>
      )}
      
      {Object.entries(groupedCommands).map(([category, items]) => (
        <div key={category}>
          {!showRecent && Object.keys(groupedCommands).length > 1 && (
            <div className="px-4 py-2 border-b border-border/50">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {category}
              </p>
            </div>
          )}
          
          <div>
            {items.map(({ command, originalIndex }) => (
              <CommandItem
                key={command.id}
                command={command}
                isSelected={selectedIndex === originalIndex}
                query={query}
                onSelect={() => onSelect(command, originalIndex)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}