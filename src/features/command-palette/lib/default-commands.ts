import { Command } from '../store/command-store';
import { 
  HomeIcon, 
  SettingsIcon, 
  SearchIcon, 
  HelpIcon,
  LogOutIcon,
  UserIcon,
  ChartIcon,
  BellIcon
} from '@/components/icons/TradeliaIcons';

export function getDefaultCommands(
  navigate: (path: string) => void,
  toggleSidebar: () => void,
  toggleTheme: () => void,
  openNotifications: () => void
): Command[] {
  return [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'Vai alla dashboard principale',
      category: 'Navigazione',
      keywords: ['home', 'dashboard', 'principale'],
      shortcut: 'Ctrl+H',
      icon: HomeIcon,
      action: () => {
        const locale = document.documentElement.lang || 'it'
        navigate(`/${locale}/dashboard`)
      }
    },
    {
      id: 'nav-settings',
      label: 'Impostazioni',
      description: 'Configura le preferenze',
      category: 'Navigazione',
      keywords: ['settings', 'impostazioni', 'config', 'preferenze'],
      shortcut: 'Ctrl+,',
      icon: SettingsIcon,
      action: () => {
        const locale = document.documentElement.lang || 'it'
        navigate(`/${locale}/dashboard/settings`)
      }
    },
    {
      id: 'nav-profile',
      label: 'Profilo',
      description: 'Gestisci il tuo profilo',
      category: 'Navigazione',
      keywords: ['profile', 'profilo', 'account', 'utente'],
      icon: UserIcon,
      action: () => {
        const locale = document.documentElement.lang || 'it'
        navigate(`/${locale}/dashboard/profile`)
      }
    },
    {
      id: 'nav-analytics',
      label: 'Analytics',
      description: 'Visualizza metriche e statistiche',
      category: 'Navigazione',
      keywords: ['analytics', 'metriche', 'statistiche', 'dati'],
      icon: ChartIcon,
      action: () => {
        const locale = document.documentElement.lang || 'it'
        navigate(`/${locale}/dashboard/analytics`)
      }
    },

    // UI Actions
    {
      id: 'ui-toggle-sidebar',
      label: 'Attiva/Disattiva Sidebar',
      description: 'Mostra o nascondi la barra laterale',
      category: 'Interfaccia',
      keywords: ['sidebar', 'barra', 'laterale', 'toggle', 'nascondi'],
      shortcut: 'Ctrl+[',
      icon: SearchIcon,
      action: toggleSidebar
    },
    {
      id: 'ui-toggle-theme',
      label: 'Cambia Tema',
      description: 'Passa tra tema chiaro e scuro',
      category: 'Interfaccia',
      keywords: ['theme', 'tema', 'dark', 'light', 'scuro', 'chiaro'],
      shortcut: 'Ctrl+Shift+T',
      icon: SettingsIcon,
      action: toggleTheme
    },
    {
      id: 'ui-notifications',
      label: 'Notifiche',
      description: 'Apri il centro notifiche',
      category: 'Interfaccia',
      keywords: ['notifications', 'notifiche', 'alerts', 'avvisi'],
      shortcut: 'Ctrl+N',
      icon: BellIcon,
      action: openNotifications
    },

    // Help & Support
    {
      id: 'help-docs',
      label: 'Documentazione',
      description: 'Consulta la guida utente',
      category: 'Aiuto',
      keywords: ['help', 'aiuto', 'docs', 'documentazione', 'guida'],
      shortcut: 'F1',
      icon: HelpIcon,
      action: () => {
        const locale = document.documentElement.lang || 'it'
        navigate(`/${locale}/dashboard/help`)
      }
    },
    {
      id: 'help-shortcuts',
      label: 'Scorciatoie Tastiera',
      description: 'Visualizza tutte le scorciatoie disponibili',
      category: 'Aiuto',
      keywords: ['shortcuts', 'scorciatoie', 'keyboard', 'tastiera', 'hotkeys'],
      shortcut: 'Ctrl+/',
      icon: HelpIcon,
      action: () => {
        const locale = document.documentElement.lang || 'it'
        navigate(`/${locale}/dashboard/shortcuts`)
      }
    },

    // Account
    {
      id: 'account-logout',
      label: 'Disconnetti',
      description: 'Esci dal tuo account',
      category: 'Account',
      keywords: ['logout', 'disconnetti', 'esci', 'sign out'],
      icon: LogOutIcon,
      action: () => {
        // Handle logout logic
        window.location.href = '/auth/logout';
      }
    }
  ];
}