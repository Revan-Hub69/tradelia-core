/**
 * Shared Configuration - Tradelia 2026
 * 
 * Configurazioni condivise che non dipendono da layer superiori
 */

// Theme configuration
export { ThemeProvider, useTheme } from './theme-provider';

// Constants and environment
export { ENV_CONFIG } from './env';
export { TRADELIA_CONSTANTS } from '../lib/constants';

// Types
export type { Theme, ThemeContextType } from '../ui/types';