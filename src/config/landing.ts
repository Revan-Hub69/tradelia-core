import { AppConfig } from '@/utils/AppConfig';

export const landingSections = [
  { id: 'simulator',    navbarLabelKey: 'nav_simulator', footerLabelKey: 'nav_simulator' },
  { id: 'problem',      navbarLabelKey: 'nav_problem',   footerLabelKey: 'nav_problem' },
  { id: 'how-it-works', navbarLabelKey: 'nav_mechanism', footerLabelKey: 'nav_mechanism' },
  { id: 'faq',          navbarLabelKey: 'nav_faq',       footerLabelKey: 'nav_faq' },
] as const;

export type LandingSectionId = (typeof landingSections)[number]['id'];

// ─── TradeHero.tsx (legacy chart / monitor data) ──────────────────────────────
// Kept for backward-compat; TradeHero now renders InteractiveSimulator in-fold.
// Remove these once the old SVG chart block is fully retired.

export const heroContextChipKeys = ['chip_asset', 'chip_strategy', 'chip_horizon'] as const;

export const heroChartAxisTicks = [
  { label: '0',  y: 173 },
  { label: '25', y: 133 },
  { label: '50', y: 93 },
  { label: '75', y: 53 },
] as const;

export const heroChartBars = [
  { key: 'cfd',     subKey: 'cfd_sub',     x: 84,  dragHeight: 54, dragFill: '#F97316', netY: 105, netHeight: 65,  netFill: '#38BDF8' },
  { key: 'futures', subKey: 'futures_sub', x: 184, dragHeight: 21, dragFill: '#F59E0B', netY: 72,  netHeight: 98,  netFill: '#818CF8' },
  { key: 'options', subKey: 'options_sub', x: 284, dragHeight: 38, dragFill: '#FB923C', netY: 89,  netHeight: 81,  netFill: '#A78BFA' },
  { key: 'cash',    subKey: 'cash_sub',    x: 384, dragHeight: 12, dragFill: '#F97316', netY: 63,  netHeight: 107, netFill: '#34D399' },
] as const;

export const heroMonitorRows = [
  { labelKey: 'monitor_row_1_label', metaKey: 'monitor_row_1_meta', noteKey: 'monitor_row_1_note', dominantKey: 'monitor_dominant_execution', intensity: 83, barClass: 'bg-sky-400' },
  { labelKey: 'monitor_row_2_label', metaKey: 'monitor_row_2_meta', noteKey: 'monitor_row_2_note', dominantKey: 'monitor_dominant_holding',   intensity: 57, barClass: 'bg-amber-400' },
  { labelKey: 'monitor_row_3_label', metaKey: 'monitor_row_3_meta', noteKey: 'monitor_row_3_note', dominantKey: 'monitor_dominant_structure', intensity: 42, barClass: 'bg-emerald-400' },
] as const;

export const scenarioLeverageRange = { min: 1, max: 12 } as const;

export function getLandingSectionHref(
  locale: string,
  pathname: string,
  sectionId: LandingSectionId,
): string {
  if (pathname === AppConfig.routes.home) return `#${sectionId}`;
  const localePrefix = locale !== AppConfig.defaultLocale ? `/${locale}` : '';
  return `${localePrefix}${AppConfig.routes.home}#${sectionId}`;
}
