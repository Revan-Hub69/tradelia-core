/**
 * Locale Switcher Component - Tradelia 2026
 * 
 * Componente per cambiare lingua senza reload della pagina.
 * Persiste la preferenza nel localStorage.
 */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/src/i18n/routing';

interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    // Persist locale preference
    localStorage.setItem('tradelia-locale', newLocale);
    
    // Replace current locale in pathname
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace locale segment
    const newPathname = segments.join('/');
    
    // Navigate without reload
    router.push(newPathname);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Lingua
      </span>
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
          </option>
        ))}
      </select>
    </div>
  );
}