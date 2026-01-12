/**
 * Core Commands - Tradelia 2026
 * 
 * Default commands for the command palette.
 * Includes navigation, actions, settings, and help commands.
 * 
 * @see Requirements: 16.2, 16.5
 */

import type { Command } from '@/src/shared/ui/CommandProvider';
import {
  HomeIcon,
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  SearchIcon,
  BookOpenIcon,
  HelpIcon,
  SunIcon,
  MoonIcon
} from '@/components/icons/TradeliaIcons';

interface CoreCommandsOptions {
  /** Navigate to a path */
  navigate: (path: string) => void;
  /** Current locale */
  locale: string;
  /** Toggle theme */
  toggleTheme?: (() => void) | undefined;
  /** Current theme */
  currentTheme?: 'light' | 'dark' | undefined;
  /** Toggle density */
  toggleDensity?: (() => void) | undefined;
  /** Open help modal */
  openHelp?: (() => void) | undefined;
  /** Logout function */
  logout?: (() => void) | undefined;
}

/**
 * Get core commands for the command palette
 * Returns 15-25 commands covering navigation, actions, settings, and help
 */
export function getCoreCommands(options: CoreCommandsOptions): Command[] {
  const { navigate, locale, toggleTheme, currentTheme, toggleDensity, openHelp, logout } = options;

  const commands: Command[] = [
    // ============================================
    // NAVIGATION COMMANDS (g + key shortcuts)
    // ============================================
    {
      id: 'go-home',
      label: locale === 'it' ? 'Vai a Home' : 'Go to Home',
      description: locale === 'it' ? 'Torna alla dashboard principale' : 'Return to main dashboard',
      category: 'navigation',
      keywords: ['home', 'dashboard', 'principale', 'main', 'start'],
      shortcut: 'g h',
      icon: HomeIcon,
      action: () => navigate(`/${locale}/dashboard`),
    },
    {
      id: 'go-emergency',
      label: locale === 'it' ? 'Vai a Emergency' : 'Go to Emergency',
      description: locale === 'it' ? 'Sezione fondo di emergenza' : 'Emergency fund section',
      category: 'navigation',
      keywords: ['emergency', 'emergenza', 'fondo', 'fund', 'crisis'],
      shortcut: 'g e',
      icon: ShieldIcon,
      action: () => navigate(`/${locale}/dashboard/emergency`),
    },
    {
      id: 'go-longterm',
      label: locale === 'it' ? 'Vai a Longterm' : 'Go to Longterm',
      description: locale === 'it' ? 'Sezione investimenti a lungo termine' : 'Long-term investments section',
      category: 'navigation',
      keywords: ['longterm', 'lungo termine', 'investimenti', 'investments', 'hold'],
      shortcut: 'g l',
      icon: TrendingUpIcon,
      action: () => navigate(`/${locale}/dashboard/longterm`),
    },
    {
      id: 'go-speculation',
      label: locale === 'it' ? 'Vai a Speculation' : 'Go to Speculation',
      description: locale === 'it' ? 'Sezione trading speculativo' : 'Speculative trading section',
      category: 'navigation',
      keywords: ['speculation', 'speculazione', 'trading', 'trade', 'short'],
      shortcut: 'g p',
      icon: BoltIcon,
      action: () => navigate(`/${locale}/dashboard/speculation`),
    },
    {
      id: 'go-passive',
      label: locale === 'it' ? 'Vai a Passive' : 'Go to Passive',
      description: locale === 'it' ? 'Sezione rendite passive' : 'Passive income section',
      category: 'navigation',
      keywords: ['passive', 'passivo', 'rendite', 'income', 'yield', 'staking'],
      shortcut: 'g a',
      icon: RefreshIcon,
      action: () => navigate(`/${locale}/dashboard/passive`),
    },
    {
      id: 'go-settings',
      label: locale === 'it' ? 'Vai a Impostazioni' : 'Go to Settings',
      description: locale === 'it' ? 'Configura le tue preferenze' : 'Configure your preferences',
      category: 'navigation',
      keywords: ['settings', 'impostazioni', 'config', 'preferenze', 'preferences'],
      shortcut: 'g s',
      icon: SettingsIcon,
      action: () => navigate(`/${locale}/dashboard/settings`),
    },

    // ============================================
    // ACTION COMMANDS
    // ============================================
    {
      id: 'toggle-theme',
      label: locale === 'it' 
        ? (currentTheme === 'dark' ? 'Passa a tema chiaro' : 'Passa a tema scuro')
        : (currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'),
      description: locale === 'it' ? 'Cambia il tema dell\'interfaccia' : 'Change interface theme',
      category: 'actions',
      keywords: ['theme', 'tema', 'dark', 'light', 'scuro', 'chiaro', 'mode'],
      shortcut: 't',
      icon: currentTheme === 'dark' ? SunIcon : MoonIcon,
      action: () => toggleTheme?.(),
      disabled: !toggleTheme,
    },
    {
      id: 'search-dashboard',
      label: locale === 'it' ? 'Cerca nella dashboard' : 'Search dashboard',
      description: locale === 'it' ? 'Cerca contenuti e strumenti' : 'Search content and tools',
      category: 'actions',
      keywords: ['search', 'cerca', 'find', 'trova', 'query'],
      shortcut: '/',
      icon: SearchIcon,
      action: () => {
        // Focus on search input if available
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        searchInput?.focus();
      },
    },

    // ============================================
    // SETTINGS COMMANDS
    // ============================================
    {
      id: 'toggle-density',
      label: locale === 'it' ? 'Cambia densità UI' : 'Toggle UI density',
      description: locale === 'it' ? 'Passa tra modalità compatta e comoda' : 'Switch between compact and comfortable mode',
      category: 'settings',
      keywords: ['density', 'densità', 'compact', 'compatto', 'comfortable', 'comodo', 'ui'],
      icon: SettingsIcon,
      action: () => toggleDensity?.(),
      disabled: !toggleDensity,
    },
    {
      id: 'edit-profile',
      label: locale === 'it' ? 'Modifica profilo' : 'Edit profile',
      description: locale === 'it' ? 'Gestisci le informazioni del tuo account' : 'Manage your account information',
      category: 'settings',
      keywords: ['profile', 'profilo', 'account', 'user', 'utente', 'edit', 'modifica'],
      icon: UserIcon,
      action: () => navigate(`/${locale}/dashboard/settings`),
    },
    {
      id: 'notification-settings',
      label: locale === 'it' ? 'Impostazioni notifiche' : 'Notification settings',
      description: locale === 'it' ? 'Configura le notifiche' : 'Configure notifications',
      category: 'settings',
      keywords: ['notifications', 'notifiche', 'alerts', 'avvisi', 'settings'],
      icon: SettingsIcon,
      action: () => navigate(`/${locale}/dashboard/settings`),
    },

    // ============================================
    // HELP COMMANDS
    // ============================================
    {
      id: 'open-help',
      label: locale === 'it' ? 'Apri aiuto' : 'Open help',
      description: locale === 'it' ? 'Visualizza la guida e le scorciatoie' : 'View guide and shortcuts',
      category: 'help',
      keywords: ['help', 'aiuto', 'guide', 'guida', 'support', 'supporto'],
      shortcut: '?',
      icon: HelpIcon,
      action: () => openHelp?.(),
      disabled: !openHelp,
    },
    {
      id: 'keyboard-shortcuts',
      label: locale === 'it' ? 'Scorciatoie tastiera' : 'Keyboard shortcuts',
      description: locale === 'it' ? 'Visualizza tutte le scorciatoie disponibili' : 'View all available shortcuts',
      category: 'help',
      keywords: ['shortcuts', 'scorciatoie', 'keyboard', 'tastiera', 'hotkeys', 'keys'],
      shortcut: '?',
      icon: HelpIcon,
      action: () => openHelp?.(),
      disabled: !openHelp,
    },
    {
      id: 'documentation',
      label: locale === 'it' ? 'Documentazione' : 'Documentation',
      description: locale === 'it' ? 'Consulta la documentazione completa' : 'View full documentation',
      category: 'help',
      keywords: ['docs', 'documentation', 'documentazione', 'manual', 'manuale'],
      icon: BookOpenIcon,
      action: () => {
        // Open documentation in new tab
        window.open('https://docs.tradelia.com', '_blank');
      },
    },
    {
      id: 'report-issue',
      label: locale === 'it' ? 'Segnala un problema' : 'Report an issue',
      description: locale === 'it' ? 'Segnala bug o suggerisci miglioramenti' : 'Report bugs or suggest improvements',
      category: 'help',
      keywords: ['report', 'segnala', 'bug', 'issue', 'problema', 'feedback'],
      icon: HelpIcon,
      action: () => {
        // Open feedback form or email
        window.open('mailto:support@tradelia.com?subject=Feedback', '_blank');
      },
    },

    // ============================================
    // ACCOUNT COMMANDS
    // ============================================
    {
      id: 'logout',
      label: locale === 'it' ? 'Disconnetti' : 'Log out',
      description: locale === 'it' ? 'Esci dal tuo account' : 'Sign out of your account',
      category: 'actions',
      keywords: ['logout', 'disconnetti', 'esci', 'signout', 'exit'],
      icon: LogOutIcon,
      action: () => logout?.(),
      disabled: !logout,
    },
  ];

  // Filter out disabled commands that don't have their handler
  return commands.filter(cmd => !cmd.disabled);
}

/**
 * Get navigation shortcuts for Gmail-style navigation
 * These are two-key sequences like "g h" for go home
 */
export const NAVIGATION_SHORTCUTS: Record<string, string> = {
  'g h': 'go-home',
  'g e': 'go-emergency',
  'g l': 'go-longterm',
  'g p': 'go-speculation',
  'g a': 'go-passive',
  'g s': 'go-settings',
};

/**
 * Get single-key shortcuts
 */
export const SINGLE_KEY_SHORTCUTS: Record<string, string> = {
  't': 'toggle-theme',
  '/': 'search-dashboard',
  '?': 'open-help',
};
