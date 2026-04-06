/**
 * PREMIUM SVG ICONS - Tradelia Design System 2026
 *
 * Redesigned with:
 * - 1.5px stroke weight (more refined than 2px)
 * - Tighter geometry, reduced visual noise
 * - Tradelia-branded proportions (not off-the-shelf Lucide)
 * - NO EMOJI — pure SVG
 *
 * Categories:
 * - Feature Icons (profit, drawdown, payout, etc.)
 * - Badge Icons (verified, featured, new)
 * - Platform Icons (MT4, MT5, cTrader, DXTrade, TradingView)
 * - Utility & Status Icons
 */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// ============================================================================
// FEATURE ICONS — Challenge Metrics
// ============================================================================

// Profit Target: rising arrow through vertical axis
export const ProfitTargetIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 19h18" />
    <path d="M5 19V9" />
    <path d="M19 19V5" />
    <path d="M12 19v-7" />
    <path d="M19 5l-3 3-4-3-4 4" />
  </svg>
);

// Drawdown: descending step with floor line
export const DrawdownIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 5h18" />
    <path d="M3 5v4h4" />
    <path d="M7 9v4h4" />
    <path d="M11 13v4h4" />
    <path d="M15 17v2h4" />
  </svg>
);

// Daily Loss: clock with downward arrow
export const DailyLossIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 12" />
    <path d="M12 17v-1.5" />
    <path d="M10.5 17l1.5 1.5 1.5-1.5" />
  </svg>
);

// Payout: card with upward arrow
export const PayoutIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
    <path d="M9 15h3m3 0h-1" />
  </svg>
);

// Scaling: three stacked layers with upward arrow
export const ScalingIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 3L3 8l9 5 9-5-9-5z" />
    <path d="M3 13l9 5 9-5" />
    <path d="M17 11.5l2.5 2-2.5 2" />
  </svg>
);

// Time Limit: hourglass
export const TimeLimitIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M5 3h14" />
    <path d="M5 21h14" />
    <path d="M5 3c0 7 3 9 7 9s7-2 7-9" />
    <path d="M5 21c0-7 3-9 7-9s7 2 7 9" />
  </svg>
);

// Min Days: calendar with check
export const MinDaysIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <rect width="18" height="17" x="3" y="4" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 16l2 2 4-4" />
  </svg>
);

// Refund: coin with circular arrow
export const RefundIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <path d="M10 12h4" />
  </svg>
);

// ============================================================================
// BADGE ICONS
// ============================================================================

// Verified: solid shield with check
export const VerifiedIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z" />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Featured: diamond shape
export const FeaturedIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 2l3.5 7H22l-5.5 5 2 7L12 17l-6.5 4 2-7L2 9h6.5L12 2z" />
  </svg>
);

// New Badge: lightning bolt
export const NewBadgeIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// Freshness: refresh arrows
export const FreshnessIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

// ============================================================================
// PLATFORM ICONS
// ============================================================================

// MT4: terminal with 4-grid layout
export const MT4Icon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 12h18" />
    <path d="M12 3v18" />
    <path d="M7.5 16.5V15l-1.5 1.5V15" />
    <path d="M16 16.5h-2v-3l2 1.5" />
  </svg>
);

// MT5: terminal with 5 indicator
export const MT5Icon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 12h18" />
    <path d="M8 8h3l-1.5 3H11a1.5 1.5 0 0 1 0 3H8" />
    <path d="M14 8l2 4 2-4" />
    <path d="M14 12h4" />
  </svg>
);

// cTrader: cube/3D box
export const CTraderIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 3L3 8v8l9 5 9-5V8l-9-5z" />
    <path d="M3 8l9 5M12 13v8M21 8l-9 5" />
  </svg>
);

// DXTrade: candlestick chart
export const DXTradeIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 20h18" />
    <path d="M7 20V12" />
    <rect width="4" height="5" x="5" y="7" rx="0.5" />
    <path d="M12 20V8" />
    <rect width="4" height="7" x="10" y="4" rx="0.5" />
    <path d="M17 20V10" />
    <rect width="4" height="4" x="15" y="6" rx="0.5" />
  </svg>
);

// TradingView: waveform / pulse
export const TradingViewIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <polyline points="2 12 6 12 8 5 10 19 13 9 15 15 17 12 22 12" />
  </svg>
);

// ============================================================================
// UTILITY ICONS
// ============================================================================

export const ChevronDownIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ExternalLinkIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const InfoIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

// ============================================================================
// STATUS ICONS
// ============================================================================

export const CalendarIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <rect width="18" height="17" x="3" y="4" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const CheckCircleIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const StarIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l2.8 6.2L22 9.2l-5 5 1.2 7L12 17.8 5.8 21.2 7 14.2 2 9.2l7.2-.9L12 2z" />
  </svg>
);

export const TrendingUpIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const TrophyIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export const TargetIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const BotIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <rect width="18" height="11" x="3" y="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v3" />
    <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
    <path d="M9.5 18.5h5" />
  </svg>
);

export const NewsIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <rect width="8" height="4" x="10" y="6" rx="1" />
  </svg>
);

export const WeekendIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <rect width="18" height="17" x="3" y="4" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </svg>
);

export const LiveAccountIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

export const PaperTradingIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const LeverageIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 20h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

export const CommissionIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export const ClockIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const UsersIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const LightbulbIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.9 10 19 8.6 19 7a7 7 0 0 0-14 0c0 1.6 1 3 2.5 4.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

// ============================================================================
// ENROLLMENT STATUS ICONS
// ============================================================================

export const PendingIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const HelpCircleIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

export const PlayIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const XCircleIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export const ArchiveIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect width="22" height="5" x="1" y="3" rx="1" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);
