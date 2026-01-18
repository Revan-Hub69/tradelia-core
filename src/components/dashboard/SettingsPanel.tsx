'use client';

import React from 'react';
import { User, Bell, Shield, Palette, Check, AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { UserSettings } from './types';
import { useAutoSaveSettings } from '@/hooks/useAutoSaveSettings';
import { useModalKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

type SettingsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onSaveSettings?: (settings: UserSettings) => Promise<void>;
};

/**
 * SettingsPanel - User settings management
 *
 * Features:
 * - Modal/drawer with glassmorphism styling
 * - Sections: Account, Preferenze, Notifiche, Privacy
 * - Auto-save functionality
 * - Mobile-responsive design
 * - Maintains z-index hierarchy
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onSaveSettings,
}) => {
  // Auto-save functionality
  const { saveStatus } = useAutoSaveSettings(
    settings,
    onSaveSettings || (async () => {
      // Default no-op save function
      await new Promise(resolve => setTimeout(resolve, 100));
    })
  );

  // Keyboard navigation
  const keyboardRef = useModalKeyboardNavigation(isOpen, onClose);

  const handleSettingChange = (section: keyof UserSettings, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    };
    onSettingsChange(newSettings);
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="size-2 animate-spin" />;
      case 'saved':
        return <Check className="size-2 text-green-500" />;
      case 'error':
        return <AlertCircle className="size-2 text-red-500" />;
      default:
        return <div className="size-2 rounded-full bg-green-500"></div>;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Salvataggio in corso...';
      case 'saved':
        return 'Modifiche salvate';
      case 'error':
        return 'Errore nel salvataggio, riprovo...';
      default:
        return 'Le modifiche vengono salvate automaticamente';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={keyboardRef as React.RefObject<HTMLDivElement>}
        className="max-h-[80vh] max-w-2xl overflow-y-auto border-white/20 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-5" />
            Impostazioni
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <User className="size-5" />
              Account
            </div>
            <div className="rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-muted-foreground">
                Le impostazioni dell'account possono essere gestite nella sezione Profilo.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Vai al Profilo
              </Button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Palette className="size-5" />
              Preferenze
            </div>
            <div className="space-y-4">
              {/* Language */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Lingua</div>
                  <div className="text-sm text-muted-foreground">Lingua dell'interfaccia</div>
                </div>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  className="rounded-md border border-white/20 bg-white/60 px-3 py-1 text-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/10"
                >
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Tema</div>
                  <div className="text-sm text-muted-foreground">Aspetto dell'interfaccia</div>
                </div>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                  className="rounded-md border border-white/20 bg-white/60 px-3 py-1 text-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/10"
                >
                  <option value="system">Sistema</option>
                  <option value="light">Chiaro</option>
                  <option value="dark">Scuro</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Difficoltà</div>
                  <div className="text-sm text-muted-foreground">Livello di difficoltà delle lezioni</div>
                </div>
                <select
                  value={settings.preferences.difficulty}
                  onChange={(e) => handleSettingChange('preferences', 'difficulty', e.target.value)}
                  className="rounded-md border border-white/20 bg-white/60 px-3 py-1 text-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/10"
                >
                  <option value="adaptive">Adattiva</option>
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzato</option>
                </select>
              </div>

              {/* Auto Play */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Riproduzione Automatica</div>
                  <div className="text-sm text-muted-foreground">Avvia automaticamente i contenuti multimediali</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Riproduzione Automatica</span>
                  <input
                    type="checkbox"
                    checked={settings.preferences.autoPlay}
                    onChange={e => handleSettingChange('preferences', 'autoPlay', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Bell className="size-5" />
              Notifiche
            </div>
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notifiche Email</div>
                  <div className="text-sm text-muted-foreground">Ricevi aggiornamenti via email</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Notifiche Email</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={e => handleSettingChange('notifications', 'email', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notifiche Push</div>
                  <div className="text-sm text-muted-foreground">Notifiche sul dispositivo</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Notifiche Push</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={e => handleSettingChange('notifications', 'push', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>

              {/* Daily Reminder */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Promemoria Giornaliero</div>
                  <div className="text-sm text-muted-foreground">Ricorda di studiare ogni giorno</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Promemoria Giornaliero</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.dailyReminder}
                    onChange={e => handleSettingChange('notifications', 'dailyReminder', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>

              {/* Streak Reminder */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Promemoria Streak</div>
                  <div className="text-sm text-muted-foreground">Avviso quando il streak è a rischio</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Promemoria Streak</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.streakReminder}
                    onChange={e => handleSettingChange('notifications', 'streakReminder', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="size-5" />
              Privacy
            </div>
            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Profilo Pubblico</div>
                  <div className="text-sm text-muted-foreground">Rendi visibile il tuo profilo ad altri utenti</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Profilo Pubblico</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.profileVisible}
                    onChange={e => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>

              {/* Progress Visibility */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Progresso Visibile</div>
                  <div className="text-sm text-muted-foreground">Mostra il tuo progresso ad altri utenti</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Progresso Visibile</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.progressVisible}
                    onChange={e => handleSettingChange('privacy', 'progressVisible', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>

              {/* Leaderboard Visibility */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Partecipa alla Classifica</div>
                  <div className="text-sm text-muted-foreground">Appari nelle classifiche pubbliche</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Partecipa alla Classifica</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.leaderboardVisible}
                    onChange={e => handleSettingChange('privacy', 'leaderboardVisible', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {getSaveStatusIcon()}
            {getSaveStatusText()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};