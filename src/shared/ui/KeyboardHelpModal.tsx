/**
 * KeyboardHelpModal - Tradelia 2026
 * 
 * Modal that displays all available keyboard shortcuts.
 * Opened with the '?' key.
 * 
 * @see Requirements: 16.6, 8.7
 */

'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useDismissableLayer } from '@/src/shared/hooks/useDismissableLayer';
import { cn } from './utils';
import { CloseIcon } from '@/components/icons/TradeliaIcons';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: { en: string; it: string };
  shortcuts: Array<{
    keys: string[];
    description: { en: string; it: string };
  }>;
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: { en: 'General', it: 'Generale' },
    shortcuts: [
      {
        keys: ['Ctrl', 'K'],
        description: { en: 'Open command palette', it: 'Apri palette comandi' },
      },
      {
        keys: ['?'],
        description: { en: 'Show keyboard shortcuts', it: 'Mostra scorciatoie tastiera' },
      },
      {
        keys: ['Esc'],
        description: { en: 'Close modal/drawer', it: 'Chiudi modal/drawer' },
      },
      {
        keys: ['t'],
        description: { en: 'Toggle theme', it: 'Cambia tema' },
      },
      {
        keys: ['/'],
        description: { en: 'Focus search', it: 'Focus ricerca' },
      },
    ],
  },
  {
    title: { en: 'Navigation', it: 'Navigazione' },
    shortcuts: [
      {
        keys: ['g', 'h'],
        description: { en: 'Go to Home', it: 'Vai a Home' },
      },
      {
        keys: ['g', 'e'],
        description: { en: 'Go to Emergency', it: 'Vai a Emergency' },
      },
      {
        keys: ['g', 'l'],
        description: { en: 'Go to Longterm', it: 'Vai a Longterm' },
      },
      {
        keys: ['g', 'p'],
        description: { en: 'Go to Speculation', it: 'Vai a Speculation' },
      },
      {
        keys: ['g', 'a'],
        description: { en: 'Go to Passive', it: 'Vai a Passive' },
      },
      {
        keys: ['g', 's'],
        description: { en: 'Go to Settings', it: 'Vai a Impostazioni' },
      },
    ],
  },
  {
    title: { en: 'Command Palette', it: 'Palette Comandi' },
    shortcuts: [
      {
        keys: ['↑', '↓'],
        description: { en: 'Navigate commands', it: 'Naviga comandi' },
      },
      {
        keys: ['Enter'],
        description: { en: 'Execute command', it: 'Esegui comando' },
      },
      {
        keys: ['Home'],
        description: { en: 'Go to first command', it: 'Vai al primo comando' },
      },
      {
        keys: ['End'],
        description: { en: 'Go to last command', it: 'Vai all\'ultimo comando' },
      },
    ],
  },
  {
    title: { en: 'Accessibility', it: 'Accessibilità' },
    shortcuts: [
      {
        keys: ['Tab'],
        description: { en: 'Move to next element', it: 'Vai all\'elemento successivo' },
      },
      {
        keys: ['Shift', 'Tab'],
        description: { en: 'Move to previous element', it: 'Vai all\'elemento precedente' },
      },
      {
        keys: ['Space'],
        description: { en: 'Activate button/checkbox', it: 'Attiva bottone/checkbox' },
      },
      {
        keys: ['Enter'],
        description: { en: 'Activate link/button', it: 'Attiva link/bottone' },
      },
    ],
  },
];

export function KeyboardHelpModal({ isOpen, onClose }: KeyboardHelpModalProps) {
  const locale = useLocale();
  const layerRef = useDismissableLayer<HTMLDivElement>(isOpen, onClose);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus close button when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="presentation">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div
        ref={layerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-help-title"
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-2xl max-h-[80vh] mx-4',
          'bg-background border-2 border-border rounded-xl shadow-2xl',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          'overflow-hidden flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 id="keyboard-help-title" className="text-lg font-semibold">
            {locale === 'it' ? 'Scorciatoie Tastiera' : 'Keyboard Shortcuts'}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg text-muted-foreground',
              'hover:bg-muted/50 hover:text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'transition-colors'
            )}
            aria-label={locale === 'it' ? 'Chiudi' : 'Close'}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-6 md:grid-cols-2">
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.title.en} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {group.title[locale as 'en' | 'it']}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.description.en}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm text-foreground">
                        {shortcut.description[locale as 'en' | 'it']}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={key} className="flex items-center gap-1">
                            <kbd className={cn(
                              'inline-flex items-center justify-center',
                              'min-w-[24px] h-6 px-2',
                              'rounded bg-muted border border-border/50',
                              'text-xs font-mono text-muted-foreground'
                            )}>
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground/50 text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            {locale === 'it' 
              ? 'Premi ESC per chiudere • Le scorciatoie non funzionano nei campi di input'
              : 'Press ESC to close • Shortcuts don\'t work in input fields'}
          </p>
        </div>
      </div>
    </div>
  );
}
