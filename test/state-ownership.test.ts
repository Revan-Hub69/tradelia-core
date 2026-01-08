/**
 * State Ownership Tests - Tradelia Dashboard
 * 
 * Test per verificare che le regole di state ownership siano rispettate
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

describe('State Ownership Map - Documentation', () => {
  const docPath = join(process.cwd(), 'docs/state-ownership-map.md');
  
  it('should have state ownership documentation', () => {
    expect(existsSync(docPath)).toBe(true);
  });

  it('should document React Query responsibilities', () => {
    const content = readFileSync(docPath, 'utf-8');
    expect(content).toContain('React Query');
    expect(content).toContain('Server State');
  });

  it('should document Zustand responsibilities', () => {
    const content = readFileSync(docPath, 'utf-8');
    expect(content).toContain('Zustand');
    expect(content).toContain('UI State');
  });

  it('should document IndexedDB responsibilities', () => {
    const content = readFileSync(docPath, 'utf-8');
    expect(content).toContain('IndexedDB');
    expect(content).toContain('Offline');
  });

  it('should include anti-patterns', () => {
    const content = readFileSync(docPath, 'utf-8');
    expect(content).toContain('Anti-Pattern');
    expect(content).toContain('❌');
  });

  it('should include decision matrix', () => {
    const content = readFileSync(docPath, 'utf-8');
    expect(content).toContain('Decision Matrix');
  });
});

describe('State Ownership - Zustand Stores', () => {
  it('should have sidebar store following naming convention', async () => {
    const storePath = join(process.cwd(), 'src/features/sidebar-state/store.ts');
    if (existsSync(storePath)) {
      const content = readFileSync(storePath, 'utf-8');
      expect(content).toContain('useSidebarStore');
      expect(content).toContain('create');
    }
  });

  it('should use persist middleware for preferences', async () => {
    const storePath = join(process.cwd(), 'src/features/sidebar-state/store.ts');
    if (existsSync(storePath)) {
      const content = readFileSync(storePath, 'utf-8');
      expect(content).toContain('persist');
      expect(content).toContain('tradelia-');
    }
  });
});

describe('State Ownership - No Server Data in Zustand', () => {
  it('should not import fetch or axios in Zustand stores', async () => {
    const storeFiles = await glob('src/**/store.ts', { cwd: process.cwd() });
    
    for (const file of storeFiles) {
      const content = readFileSync(join(process.cwd(), file), 'utf-8');
      // Zustand stores should not make API calls directly
      expect(content).not.toContain('fetch(');
      expect(content).not.toContain('axios');
    }
  });
});

describe('State Ownership - React Query Configuration', () => {
  it('should have QueryProvider configured', () => {
    const providerPath = join(process.cwd(), 'src/shared/providers/QueryProvider.tsx');
    if (existsSync(providerPath)) {
      const content = readFileSync(providerPath, 'utf-8');
      expect(content).toContain('QueryClient');
      expect(content).toContain('QueryClientProvider');
    }
  });
});

describe('State Ownership - LocalStorage Keys', () => {
  it('should use tradelia- prefix for localStorage keys', async () => {
    const files = await glob('src/**/*.{ts,tsx}', { cwd: process.cwd() });
    
    for (const file of files) {
      const content = readFileSync(join(process.cwd(), file), 'utf-8');
      
      // Check for localStorage usage
      const localStorageMatches = content.match(/localStorage\.(get|set)Item\s*\(\s*['"]([^'"]+)['"]/g);
      
      if (localStorageMatches) {
        for (const match of localStorageMatches) {
          // Extract the key
          const keyMatch = match.match(/['"]([^'"]+)['"]/);
          if (keyMatch) {
            const key = keyMatch[1];
            // Keys should start with tradelia- or be standard browser keys
            const isTradeliaKey = key.startsWith('tradelia-');
            const isStandardKey = ['theme', 'locale', 'NEXT_LOCALE'].includes(key);
            expect(isTradeliaKey || isStandardKey).toBe(true);
          }
        }
      }
    }
  });
});

describe('State Ownership - Type Safety', () => {
  it('should have types for sidebar state', () => {
    const typesPath = join(process.cwd(), 'src/features/sidebar-state/types.ts');
    if (existsSync(typesPath)) {
      const content = readFileSync(typesPath, 'utf-8');
      expect(content).toContain('SidebarState');
    }
  });

  it('should have types for theme state', () => {
    const typesPath = join(process.cwd(), 'src/shared/ui/types.ts');
    if (existsSync(typesPath)) {
      const content = readFileSync(typesPath, 'utf-8');
      expect(content).toContain('Theme');
      expect(content).toContain('ThemeContextType');
    }
  });
});

describe('State Ownership - No Duplicate State', () => {
  it('should not have multiple theme stores', async () => {
    const files = await glob('src/**/*.{ts,tsx}', { cwd: process.cwd() });
    
    let themeStoreCount = 0;
    for (const file of files) {
      const content = readFileSync(join(process.cwd(), file), 'utf-8');
      if (content.includes('useThemeStore') && content.includes('create(')) {
        themeStoreCount++;
      }
    }
    
    // Should have at most one theme store definition
    expect(themeStoreCount).toBeLessThanOrEqual(1);
  });

  it('should not have multiple sidebar stores', async () => {
    const files = await glob('src/**/*.{ts,tsx}', { cwd: process.cwd() });
    
    let sidebarStoreCount = 0;
    for (const file of files) {
      const content = readFileSync(join(process.cwd(), file), 'utf-8');
      if (content.includes('useSidebarStore') && content.includes('create(')) {
        sidebarStoreCount++;
      }
    }
    
    // Should have at most one sidebar store definition
    expect(sidebarStoreCount).toBeLessThanOrEqual(1);
  });
});

describe('State Ownership - Barrel Exports', () => {
  it('should export stores from feature index', () => {
    const indexPath = join(process.cwd(), 'src/features/sidebar-state/index.ts');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      expect(content).toContain('export');
      expect(content).toContain('useSidebarStore');
    }
  });
});
