/**
 * Default Commands - Tradelia 2026
 * 
 * Set di comandi predefiniti per la dashboard
 * Seguendo i principi Tradelia 2026: funzionalità chiare, linguaggio neutrale
 */

import type { Command } from '@/entities/command';

export function createDefaultCommands(): Command[] {
  return [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      label: 'Vai alla Dashboard',
      description: 'Visualizza la dashboard principale',
      category: 'navigation',
      keywords: ['dashboard', 'home', 'principale'],
      shortcut: 'cmd+shift+d',
      icon: 'dashboard',
      action: () => {
        window.location.href = '/dashboard';
      }
    },
    {
      id: 'nav-settings',
      label: 'Apri Impostazioni',
      description: 'Configura le preferenze della dashboard',
      category: 'navigation',
      keywords: ['impostazioni', 'settings', 'configurazione', 'preferenze'],
      shortcut: 'cmd+,',
      icon: 'settings',
      action: () => {
        // Navigate to settings
        console.log('Navigate to settings');
      }
    },

    // Action Commands
    {
      id: 'action-refresh',
      label: 'Aggiorna Dati',
      description: 'Ricarica tutti i dati della dashboard',
      category: 'actions',
      keywords: ['aggiorna', 'refresh', 'ricarica', 'reload'],
      shortcut: 'cmd+r',
      icon: 'refresh',
      action: () => {
        window.location.reload();
      }
    },
    {
      id: 'action-export',
      label: 'Esporta Dati',
      description: 'Scarica i dati in formato CSV',
      category: 'actions',
      keywords: ['esporta', 'export', 'scarica', 'download', 'csv'],
      icon: 'download',
      action: () => {
        // Export data logic
        console.log('Export data');
      }
    },
    {
      id: 'action-print',
      label: 'Stampa Dashboard',
      description: 'Stampa la vista corrente',
      category: 'actions',
      keywords: ['stampa', 'print'],
      shortcut: 'cmd+p',
      icon: 'print',
      action: () => {
        window.print();
      }
    },

    // Settings Commands
    {
      id: 'settings-theme-toggle',
      label: 'Cambia Tema',
      description: 'Passa da tema chiaro a scuro',
      category: 'settings',
      keywords: ['tema', 'theme', 'dark', 'light', 'scuro', 'chiaro'],
      shortcut: 'cmd+shift+t',
      icon: 'theme',
      action: () => {
        // Toggle theme logic
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
      }
    },
    {
      id: 'settings-language',
      label: 'Cambia Lingua',
      description: 'Seleziona la lingua dell\'interfaccia',
      category: 'settings',
      keywords: ['lingua', 'language', 'italiano', 'english'],
      icon: 'language',
      action: () => {
        // Language selector logic
        console.log('Open language selector');
      }
    },
    {
      id: 'settings-sidebar-toggle',
      label: 'Mostra/Nascondi Sidebar',
      description: 'Attiva o disattiva la barra laterale',
      category: 'settings',
      keywords: ['sidebar', 'barra', 'laterale', 'menu'],
      shortcut: 'cmd+b',
      icon: 'sidebar',
      action: () => {
        // Toggle sidebar logic
        console.log('Toggle sidebar');
      }
    },

    // Data Commands
    {
      id: 'data-search',
      label: 'Cerca nei Dati',
      description: 'Ricerca avanzata nei dataset',
      category: 'data',
      keywords: ['cerca', 'search', 'trova', 'ricerca'],
      shortcut: 'cmd+f',
      icon: 'search',
      action: () => {
        // Open search modal
        console.log('Open search modal');
      }
    },
    {
      id: 'data-filter',
      label: 'Applica Filtri',
      description: 'Filtra i dati visualizzati',
      category: 'data',
      keywords: ['filtri', 'filter', 'filtra'],
      icon: 'filter',
      action: () => {
        // Open filter panel
        console.log('Open filter panel');
      }
    },
    {
      id: 'data-sort',
      label: 'Ordina Dati',
      description: 'Cambia l\'ordinamento dei dati',
      category: 'data',
      keywords: ['ordina', 'sort', 'ordinamento'],
      icon: 'sort',
      action: () => {
        // Open sort options
        console.log('Open sort options');
      }
    },

    // Help Commands
    {
      id: 'help-shortcuts',
      label: 'Mostra Scorciatoie',
      description: 'Visualizza tutte le scorciatoie da tastiera',
      category: 'help',
      keywords: ['scorciatoie', 'shortcuts', 'hotkeys', 'tastiera'],
      shortcut: 'cmd+/',
      icon: 'help',
      action: () => {
        // Show shortcuts modal
        console.log('Show shortcuts modal');
      }
    },
    {
      id: 'help-documentation',
      label: 'Apri Documentazione',
      description: 'Accedi alla guida completa',
      category: 'help',
      keywords: ['documentazione', 'docs', 'guida', 'help', 'aiuto'],
      icon: 'book',
      action: () => {
        window.open('/docs', '_blank');
      }
    },
    {
      id: 'help-support',
      label: 'Contatta Supporto',
      description: 'Richiedi assistenza tecnica',
      category: 'help',
      keywords: ['supporto', 'support', 'aiuto', 'assistenza'],
      icon: 'support',
      action: () => {
        // Open support modal
        console.log('Open support modal');
      }
    }
  ];
}

// Utility function to create custom commands
export function createCommand(
  id: string,
  label: string,
  action: () => void | Promise<void>,
  options: Partial<Omit<Command, 'id' | 'label' | 'action'>> = {}
): Command {
  return {
    id,
    label,
    action,
    category: 'actions',
    keywords: [],
    ...options
  };
}