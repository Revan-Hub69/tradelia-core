/**
 * Shared tier presentation layer — single source of truth per label, stile e tooltip
 * dei tier broker (Cent / Starter / Standard / ECN / Pro).
 */

import type { BrokerTier } from './brokers';

export const TIER_LABELS: Record<BrokerTier, string> = {
  cent: 'Cent',
  starter: 'Starter',
  standard: 'Standard',
  ecn: 'ECN',
  pro: 'Pro',
};

export const TIER_TOOLTIPS: Record<BrokerTier, string> = {
  cent: 'Conto Cent: lotti micro (0.01) · depositi da €5 · ideale per chi inizia',
  starter: 'Conto Starter: depositi bassi · spread standard · niente commissioni',
  standard: 'Conto Standard: nessun minimo · condizioni bilanciate · solo spread',
  ecn: 'ECN Raw: spread quasi 0 + commissione fissa · conviene con alti volumi',
  pro: 'Conto Pro/VIP: commissioni ridotte · minimo deposit alto (€10k+)',
};

export const TIER_STYLES: Record<BrokerTier, string> = {
  cent: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  starter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  standard: 'bg-primary/10 text-primary border-primary/20',
  ecn: 'bg-accent/10 text-accent border-accent/20',
  pro: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};
