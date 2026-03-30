'use client';

/**
 * MY CHALLENGE DRAWER - Enterprise Premium 2026 Edition
 *
 * Design Principles (Tier 1 Research):
 * - Tradelia Color Palette: Scale di blu, grigi-celesti e accenti
 * - iOS 26 Glass Morphism: Translucency, depth, premium feel
 * - HEADER SCROLL-COMPACT: Si riduce allo scroll mostrando solo titolo e close
 * - Modular architecture with dedicated sections
 * - Enhanced cognitive hierarchy and readability
 * - Advanced motion design with spring physics
 *
 * Features:
 * - Scroll-compact header with smooth spring animation
 * - Consistent glass morphism design system
 * - Staggered content animations
 * - Premium micro-interactions
 * - Enhanced data visualization cards
 */

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigationContext } from '@/components/navigation/useNavigationContext';
import { cn } from '@/utils/Helpers';

import type { EnrollmentStatus } from './EnrollmentStatusCard';
import { ExternalLinkIcon } from '@/components/icons/unified';

type Enrollment = {
  id: string;
  status: EnrollmentStatus;
  currentPhaseNumber?: number | null;
  currentPhaseStatus?: string | null;
  currentPhaseStartedAt?: string | null;
  currentPhaseCompletedAt?: string | null;
  phaseUpdatedAt?: string | null;
  program: {
    id: string;
    name: string;
    organizerName?: string;
    officialUrl?: string;
  };
  offer: {
    id: string;
    name?: string;
    accountSize?: number | string | null;
    accountCurrency?: string | null;
    durationDays?: number;
  };
  createdAt?: string;
};

type MyChallengeDrawerProps = {
  enrollment: Enrollment | null;
  isOpen: boolean;
  onClose: () => void;
  onActivate?: (enrollmentId: string) => Promise<void>;
  onRemove?: (enrollmentId: string) => Promise<void>;
};

type ContextSession = 'EU' | 'US' | 'ASIA' | 'OFF';
type ContextEventRisk = 'NONE' | 'SCHEDULED' | 'LIVE';
type ContextVolatility = 'LOW' | 'NORMAL' | 'HIGH';
type TradeGate = 'OPEN' | 'RESTRICTED' | 'CLOSED';

type OpenPosition = {
  id: string;
  enrollment_id: string;
  program_id?: string | null;
  offer_id?: string | null;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entry_price?: number | null;
  opened_at?: string | null;
  stop_loss?: number | null;
  take_profit?: number | null;
  unrealized_pnl?: number | null;
  notional_value?: number | null;
  leverage?: number | null;
  broker_position_id?: string | null;
  is_open?: boolean | null;
  created_at?: string | null;
};

type OpenPositionDraft = {
  symbol: string;
  side: 'long' | 'short';
  size: string;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  openedAt: string;
  unrealizedPnl: string;
};

type MyChallengeRecord = {
  enrollment_id: string;
  challenge_ref?: {
    challenge_id?: string;
    account_size_selected?: number;
    started_at?: string | null;
    rule_snapshot?: {
      target_pct?: number | null;
      max_dd_pct?: number | null;
      daily_loss_pct?: number | null;
      min_days?: number | null;
      ea_allowed?: boolean | null;
      news_trading?: boolean | null;
      consistency_required?: boolean | null;
      best_day_max_pct?: number | null;
    } | null;
  };
  account_state?: {
    balance_start?: number | null;
    equity_now?: number | null;
    peak_equity?: number | null;
    profit_progress_pct?: number | null;
    max_dd_used_pct?: number | null;
    daily_loss_used_pct_today?: number | null;
    days_traded?: number | null;
    last_trade_at?: string | null;
    today_trade_count?: number | null;
    today_realized_pnl?: number | null;
  };
  context_lite?: {
    session?: ContextSession;
    event_risk?: ContextEventRisk;
    volatility_hint?: ContextVolatility;
  };
  operating_envelope?: {
    automation_policy?: 'MANUAL_ONLY';
    trade_gate?: TradeGate;
    risk_budget?: {
      daily_risk_cap_pct?: number;
      risk_per_trade_pct?: number;
      max_trades?: number;
    };
    stop_rules?: string[];
    notes_short?: string;
  };
};

type RulesetSpec = {
  id?: string | null;
  phase_number: number;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  min_trading_days: number | null;
  ea_allowed?: boolean | null;
  news_trading?: boolean | null;
  consistency_required?: boolean | null;
  best_day_max_pct?: number | null;
};

type CompetitionRulesSpec = {
  min_trading_days?: number | null;
};

const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className || 'size-5'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const parseAccountSize = (value: Enrollment['offer']['accountSize']) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

// Status configuration for visual styling
const getStatusConfig = (status: EnrollmentStatus) => {
  switch (status) {
    case 'active':
      return {
        bg: 'bg-emerald-100',
        darkBg: 'dark:bg-emerald-950/50',
        color: 'text-emerald-700 dark:text-emerald-300',
      };
    case 'pending_confirmation':
      return {
        bg: 'bg-amber-100',
        darkBg: 'dark:bg-amber-950/50',
        color: 'text-amber-700 dark:text-amber-300',
      };
    case 'completed':
      return {
        bg: 'bg-green-100',
        darkBg: 'dark:bg-green-950/50',
        color: 'text-green-700 dark:text-green-300',
      };
    case 'failed':
    case 'abandoned':
      return {
        bg: 'bg-red-100',
        darkBg: 'dark:bg-red-950/50',
        color: 'text-red-700 dark:text-red-300',
      };
    default:
      return {
        bg: 'bg-slate-100',
        darkBg: 'dark:bg-slate-800',
        color: 'text-slate-700 dark:text-slate-300',
      };
  }
};

export function MyChallengeDrawer({
  enrollment,
  isOpen,
  onClose,
  onActivate,
  onRemove,
}: MyChallengeDrawerProps) {
  const t = useTranslations('MyChallenges') as any;
  const { setOverlayOpen } = useNavigationContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll-based header compaction - Premium mobile-like effect
  const { scrollY } = useScroll({ container: contentRef });

  // Smooth spring animation for header compaction
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.5,
  });

  // Transform values for header compaction
  const headerHeight = useTransform(smoothScrollY, [0, 80], [140, 72]);
  const headerPadding = useTransform(smoothScrollY, [0, 80], [20, 12]);
  const subtitleOpacity = useTransform(smoothScrollY, [0, 40], [1, 0]);
  const organizerOpacity = useTransform(smoothScrollY, [0, 30], [1, 0]);
  const titleScale = useTransform(smoothScrollY, [0, 80], [1, 0.95]);
  const headerBorderOpacity = useTransform(smoothScrollY, [0, 40], [0.6, 1]);

  const [isWorking, setIsWorking] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [myChallenge, setMyChallenge] = useState<MyChallengeRecord | null>(null);
  const [loadingMyChallenge, setLoadingMyChallenge] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<MyChallengeRecord | null>(null);
  const [rulesets, setRulesets] = useState<RulesetSpec[]>([]);
  const [competitionRules, setCompetitionRules] = useState<CompetitionRulesSpec | null>(null);
  const [loadingSpec, setLoadingSpec] = useState(false);
  const [phaseDraftNumber, setPhaseDraftNumber] = useState<number | null>(null);
  const [phaseDraftStatus, setPhaseDraftStatus] = useState<'not_started' | 'active' | 'passed' | 'failed' | null>(null);
  const [phaseUpdating, setPhaseUpdating] = useState(false);
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [loadingOpenPositions, setLoadingOpenPositions] = useState(false);
  const [openPositionsError, setOpenPositionsError] = useState<string | null>(null);
  const [isEditingPositions, setIsEditingPositions] = useState(false);
  const [positionDraft, setPositionDraft] = useState<OpenPositionDraft>({
    symbol: '',
    side: 'long',
    size: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    openedAt: '',
    unrealizedPnl: '',
  });

  useEffect(() => {
    setOverlayOpen(isOpen);
    return () => {
      setOverlayOpen(false);
    };
  }, [isOpen, setOverlayOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
      document.body.style.removeProperty('--scrollbar-width');
    }

    return () => {
      document.body.classList.remove('scroll-locked');
      document.body.style.removeProperty('--scrollbar-width');
    };
  }, [isOpen]);

  useEffect(() => {
    let active = true;
    if (!isOpen || !enrollment) {
      setMyChallenge(null);
      setDraft(null);
      setIsEditing(false);
      setRulesets([]);
      setCompetitionRules(null);
      setOpenPositions([]);
      setIsEditingPositions(false);
      setOpenPositionsError(null);
      return;
    }

    const fetchMyChallenge = async () => {
      try {
        setLoadingMyChallenge(true);
        const response = await fetch(`/api/my-challenges?enrollmentId=${enrollment.id}`);
        const data = await response.json();
        if (active && response.ok && data?.success) {
          setMyChallenge(data.data ?? null);
          setDraft(data.data ?? null);
        }
      } catch {
        if (active) {
          setMyChallenge(null);
          setDraft(null);
        }
      } finally {
        if (active) {
          setLoadingMyChallenge(false);
        }
      }
    };

    fetchMyChallenge();
    return () => {
      active = false;
    };
  }, [isOpen, enrollment]);

  useEffect(() => {
    let active = true;
    if (!isOpen || !enrollment) {
      return;
    }
    const fetchSpec = async () => {
      try {
        setLoadingSpec(true);
        const response = await fetch(`/api/challenge-spec?enrollmentId=${enrollment.id}`);
        const data = await response.json();
        if (active && response.ok && data?.success) {
          setRulesets((data.data?.rulesets ?? []) as RulesetSpec[]);
          setCompetitionRules((data.data?.competitionRules ?? null) as CompetitionRulesSpec | null);
        }
      } catch {
        if (active) {
          setRulesets([]);
          setCompetitionRules(null);
        }
      } finally {
        if (active) {
          setLoadingSpec(false);
        }
      }
    };
    fetchSpec();
    return () => {
      active = false;
    };
  }, [isOpen, enrollment]);

  useEffect(() => {
    let active = true;
    if (!isOpen || !enrollment) {
      setOpenPositions([]);
      setOpenPositionsError(null);
      return;
    }
    setIsEditingPositions(false);

    const fetchOpenPositions = async () => {
      try {
        setLoadingOpenPositions(true);
        setOpenPositionsError(null);
        const response = await fetch(`/api/open-positions?enrollmentId=${enrollment.id}`);
        const data = await response.json();
        if (active && response.ok && data?.success) {
          setOpenPositions(data.data ?? []);
        } else if (active) {
          setOpenPositions([]);
          setOpenPositionsError(t('drawer.open_positions_error_load'));
        }
      } catch {
        if (active) {
          setOpenPositions([]);
          setOpenPositionsError(t('drawer.open_positions_error_load'));
        }
      } finally {
        if (active) {
          setLoadingOpenPositions(false);
        }
      }
    };

    fetchOpenPositions();
    return () => {
      active = false;
    };
  }, [isOpen, enrollment, t]);

  useEffect(() => {
    if (!enrollment) {
      setPhaseDraftNumber(null);
      setPhaseDraftStatus(null);
      return;
    }
    setPhaseDraftNumber(enrollment.currentPhaseNumber ?? 1);
    const nextStatus = ['not_started', 'active', 'passed', 'failed'].includes(enrollment.currentPhaseStatus ?? '')
      ? (enrollment.currentPhaseStatus as 'not_started' | 'active' | 'passed' | 'failed')
      : 'active';
    setPhaseDraftStatus(nextStatus);
  }, [enrollment]);

  const auditContext = useMemo(() => {
    if (!enrollment) {
      return null;
    }

    const tradeGate = enrollment.status === 'active'
      ? 'OPEN'
      : ['pending_confirmation', 'pending_redirect', 'interested'].includes(enrollment.status)
        ? 'RESTRICTED'
        : 'CLOSED';

    return {
      challengeRef: {
        challengeId: myChallenge?.challenge_ref?.challenge_id ?? enrollment.program.id,
        accountSizeSelected: myChallenge?.challenge_ref?.account_size_selected
          ?? parseAccountSize(enrollment.offer.accountSize),
        startedAt: myChallenge?.challenge_ref?.started_at ?? enrollment.createdAt ?? null,
      },
      accountState: {
        balanceStart: myChallenge?.account_state?.balance_start ?? null,
        equityNow: myChallenge?.account_state?.equity_now ?? null,
        peakEquity: myChallenge?.account_state?.peak_equity ?? null,
        profitProgressPct: myChallenge?.account_state?.profit_progress_pct ?? null,
        maxDdUsedPct: myChallenge?.account_state?.max_dd_used_pct ?? null,
        dailyLossUsedPctToday: myChallenge?.account_state?.daily_loss_used_pct_today ?? null,
        daysTraded: myChallenge?.account_state?.days_traded ?? null,
        lastTradeAt: myChallenge?.account_state?.last_trade_at ?? null,
        todayTradeCount: myChallenge?.account_state?.today_trade_count ?? null,
        todayRealizedPnl: myChallenge?.account_state?.today_realized_pnl ?? null,
      },
      contextLite: {
        session: myChallenge?.context_lite?.session ?? 'OFF',
        eventRisk: myChallenge?.context_lite?.event_risk ?? 'NONE',
        volatilityHint: myChallenge?.context_lite?.volatility_hint ?? 'NORMAL',
      },
      operatingEnvelope: {
        automationPolicy: myChallenge?.operating_envelope?.automation_policy ?? 'MANUAL_ONLY',
        tradeGate: myChallenge?.operating_envelope?.trade_gate ?? tradeGate,
        riskBudget: {
          dailyRiskCapPct: myChallenge?.operating_envelope?.risk_budget?.daily_risk_cap_pct ?? 2.0,
          riskPerTradePct: myChallenge?.operating_envelope?.risk_budget?.risk_per_trade_pct ?? 0.5,
          maxTrades: myChallenge?.operating_envelope?.risk_budget?.max_trades ?? 2,
        },
        stopRules: myChallenge?.operating_envelope?.stop_rules ?? ['STOP_AFTER_2_LOSSES', 'STOP_IF_EVENT_RISK_LIVE'],
        notesShort: myChallenge?.operating_envelope?.notes_short
          ?? (tradeGate === 'OPEN'
            ? t('drawer.notes_open')
            : tradeGate === 'RESTRICTED'
              ? t('drawer.notes_restricted')
              : t('drawer.notes_closed')),
      },
    };
  }, [enrollment, myChallenge, t]);

  if (!enrollment) {
    return null;
  }
  if (!auditContext) {
    return null;
  }

  const accountSize = parseAccountSize(enrollment.offer.accountSize);
  const accountCurrency = enrollment.offer.accountCurrency ?? 'USD';
  const statusConfig = getStatusConfig(enrollment.status);

  const formatMoney = (value: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: accountCurrency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${accountCurrency} ${Math.round(value).toLocaleString()}`.trim();
    }
  };
  const formatPct = (value: number | null) => {
    if (value === null || Number.isNaN(value)) {
      return t('drawer.value_missing');
    }
    return `${value.toFixed(1)}%`;
  };

  const parseNumberInput = (value: string) => {
    if (value.trim() === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const formatNumber = (value?: number | null) => {
    if (value == null || Number.isNaN(value)) {
      return t('drawer.value_missing');
    }
    return value.toLocaleString();
  };

  const formatDate = (value: string | null) => {
    if (!value) {
      return t('drawer.value_missing');
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return t('drawer.value_missing');
    }
    return parsed.toLocaleDateString();
  };

  const canActivate = enrollment.status === 'pending_confirmation';
  const canRemove = ['interested', 'pending_redirect', 'pending_confirmation', 'abandoned'].includes(enrollment.status);
  const canAbandon = enrollment.status === 'active';
  const canChangePhase = enrollment.status === 'active';

  const ensureDraft = () => {
    if (draft) {
      return draft;
    }
    const seeded: MyChallengeRecord = {
      enrollment_id: enrollment.id,
      challenge_ref: {
        challenge_id: enrollment.program.id,
        account_size_selected: parseAccountSize(enrollment.offer.accountSize) ?? undefined,
        started_at: enrollment.createdAt ?? null,
      },
      account_state: {},
      context_lite: {},
      operating_envelope: {},
    };
    setDraft(seeded);
    return seeded;
  };

  const updateDraft = (updater: (current: MyChallengeRecord) => MyChallengeRecord) => {
    setDraft(prev => updater(prev ?? ensureDraft()));
  };

  const handleActivate = async () => {
    if (!onActivate) {
      return;
    }
    setIsWorking(true);
    await onActivate(enrollment.id);
    setIsWorking(false);
  };

  const handleAbandon = async () => {
    if (!enrollment) {
      return;
    }
    setIsWorking(true);
    await fetch(`/api/enrollments/${enrollment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'abandoned' }),
    });
    setIsWorking(false);
  };

  const computeEnvelope = (
    specRulesets: RulesetSpec[],
    accountState: MyChallengeRecord['account_state'],
    contextLite: MyChallengeRecord['context_lite'],
    fallbackGate: 'OPEN' | 'RESTRICTED' | 'CLOSED',
  ) => {
    const phase1 = specRulesets.find(r => r.phase_number === 1) ?? specRulesets[0];
    const maxDaily = phase1?.max_daily_loss_pct ?? null;
    const maxDd = phase1?.max_drawdown_pct ?? null;
    const consistencyRequired = phase1?.consistency_required ?? false;
    const bestDayMaxPct = phase1?.best_day_max_pct ?? null;
    const dailyUsed = accountState?.daily_loss_used_pct_today ?? null;
    const ddUsed = accountState?.max_dd_used_pct ?? null;
    const balanceStart = accountState?.balance_start ?? null;
    const todayRealized = accountState?.today_realized_pnl ?? null;
    const eventRisk = contextLite?.event_risk ?? 'NONE';

    let tradeGate: 'OPEN' | 'RESTRICTED' | 'CLOSED' = fallbackGate;
    if (typeof maxDaily === 'number' && typeof dailyUsed === 'number') {
      if (dailyUsed >= maxDaily) {
        tradeGate = 'CLOSED';
      } else if (dailyUsed >= maxDaily * 0.75) {
        tradeGate = 'RESTRICTED';
      }
    }
    if (typeof maxDd === 'number' && typeof ddUsed === 'number' && ddUsed >= maxDd) {
      tradeGate = 'CLOSED';
    }
    if (eventRisk === 'LIVE' && tradeGate !== 'CLOSED') {
      tradeGate = 'RESTRICTED';
    }

    let consistencyRisk = false;
    if (consistencyRequired && typeof bestDayMaxPct === 'number' && Number.isFinite(bestDayMaxPct)) {
      if (typeof todayRealized === 'number' && Number.isFinite(todayRealized)
        && typeof balanceStart === 'number' && Number.isFinite(balanceStart) && balanceStart > 0) {
        const todayPct = (todayRealized / balanceStart) * 100;
        consistencyRisk = todayPct > bestDayMaxPct;
      }
    }

    if (consistencyRisk && tradeGate === 'OPEN') {
      tradeGate = 'RESTRICTED';
    }

    const dailyRiskCapPct = typeof maxDaily === 'number' && Number.isFinite(maxDaily)
      ? Math.max(0.5, maxDaily * 0.5)
      : 2.0;
    const riskPerTradePct = typeof maxDaily === 'number' && Number.isFinite(maxDaily)
      ? Math.min(0.5, maxDaily / 8)
      : 0.5;
    const maxTrades = eventRisk === 'LIVE' ? 1 : eventRisk === 'SCHEDULED' ? 2 : 4;

    return {
      automation_policy: 'MANUAL_ONLY' as const,
      trade_gate: tradeGate,
      risk_budget: {
        daily_risk_cap_pct: Number(dailyRiskCapPct.toFixed(2)),
        risk_per_trade_pct: Number(riskPerTradePct.toFixed(2)),
        max_trades: maxTrades,
      },
      stop_rules: [
        'STOP_AFTER_2_LOSSES',
        'STOP_IF_EVENT_RISK_LIVE',
        ...(consistencyRisk ? ['STOP_IF_CONSISTENCY_RISK'] : []),
      ],
      notes_short: tradeGate === 'OPEN'
        ? t('drawer.notes_open')
        : tradeGate === 'RESTRICTED'
          ? t('drawer.notes_restricted')
          : t('drawer.notes_closed'),
    };
  };

  const handleSave = async () => {
    if (!enrollment || !draft) {
      return;
    }
    setIsWorking(true);

    const nextAccountState = { ...(draft.account_state ?? {}) };
    const balanceStart = nextAccountState.balance_start;
    const equityNow = nextAccountState.equity_now;
    const peakEquity = nextAccountState.peak_equity;
    if (typeof balanceStart === 'number' && Number.isFinite(balanceStart)
      && typeof equityNow === 'number' && Number.isFinite(equityNow) && balanceStart > 0) {
      if (nextAccountState.profit_progress_pct == null) {
        nextAccountState.profit_progress_pct = ((equityNow - balanceStart) / balanceStart) * 100;
      }
    }
    if (nextAccountState.max_dd_used_pct == null) {
      const ddBase = typeof peakEquity === 'number' && Number.isFinite(peakEquity) && peakEquity > 0
        ? peakEquity
        : (typeof balanceStart === 'number' && Number.isFinite(balanceStart) && balanceStart > 0
          ? balanceStart
          : null);
      if (ddBase && typeof equityNow === 'number' && Number.isFinite(equityNow)) {
        nextAccountState.max_dd_used_pct = Math.max(0, ((ddBase - equityNow) / ddBase) * 100);
      }
    }

    const computedEnvelope = computeEnvelope(
      rulesets,
      nextAccountState,
      draft.context_lite,
      (draft.operating_envelope?.trade_gate as 'OPEN' | 'RESTRICTED' | 'CLOSED') ?? 'RESTRICTED',
    );
    const mergedEnvelope = {
      ...computedEnvelope,
      ...draft.operating_envelope,
      risk_budget: {
        ...computedEnvelope.risk_budget,
        ...(draft.operating_envelope?.risk_budget ?? {}),
      },
    };

    const phase1 = rulesets.find(r => r.phase_number === 1) ?? rulesets[0];
    const ruleSnapshot = phase1
      ? {
        target_pct: phase1.profit_target_pct ?? null,
        max_dd_pct: phase1.max_drawdown_pct ?? null,
        daily_loss_pct: phase1.max_daily_loss_pct ?? null,
        min_days: phase1.min_trading_days ?? competitionRules?.min_trading_days ?? null,
        ea_allowed: phase1.ea_allowed ?? null,
        news_trading: phase1.news_trading ?? null,
        consistency_required: phase1.consistency_required ?? null,
        best_day_max_pct: phase1.best_day_max_pct ?? null,
      }
      : null;

    const payload = {
      enrollmentId: enrollment.id,
      programId: enrollment.program.id,
      offerId: enrollment.offer.id,
      challengeRef: {
        ...(draft.challenge_ref ?? {}),
        rule_snapshot: ruleSnapshot,
      },
      accountState: nextAccountState,
      contextLite: draft.context_lite ?? {},
      operatingEnvelope: mergedEnvelope,
    };

    const endpoint = myChallenge
      ? `/api/my-challenges/${enrollment.id}`
      : '/api/my-challenges';

    const method = myChallenge ? 'PATCH' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.success) {
        setMyChallenge(data.data ?? null);
        setDraft(data.data ?? null);
        setIsEditing(false);
      }
    }

    setIsWorking(false);
  };

  const handlePositionCreate = async () => {
    if (!enrollment) {
      return;
    }
    if (!positionDraft.symbol.trim() || positionDraft.size.trim() === '') {
      setOpenPositionsError(t('drawer.open_positions_error_required'));
      return;
    }

    const sizeValue = parseNumberInput(positionDraft.size);
    if (sizeValue == null) {
      setOpenPositionsError(t('drawer.open_positions_error_required'));
      return;
    }

    setOpenPositionsError(null);
    setIsWorking(true);
    const payload = {
      enrollmentId: enrollment.id,
      programId: enrollment.program.id,
      offerId: enrollment.offer.id,
      symbol: positionDraft.symbol.trim().toUpperCase(),
      side: positionDraft.side,
      size: sizeValue,
      entryPrice: parseNumberInput(positionDraft.entryPrice),
      stopLoss: parseNumberInput(positionDraft.stopLoss),
      takeProfit: parseNumberInput(positionDraft.takeProfit),
      openedAt: positionDraft.openedAt ? new Date(positionDraft.openedAt).toISOString() : null,
      unrealizedPnl: parseNumberInput(positionDraft.unrealizedPnl),
    };

    const response = await fetch('/api/open-positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.success && data.data) {
        setOpenPositions(prev => [data.data as OpenPosition, ...prev]);
        setPositionDraft({
          symbol: '',
          side: 'long',
          size: '',
          entryPrice: '',
          stopLoss: '',
          takeProfit: '',
          openedAt: '',
          unrealizedPnl: '',
        });
      }
    }

    setIsWorking(false);
  };

  const handlePositionClose = async (positionId: string) => {
    setIsWorking(true);
    const response = await fetch(`/api/open-positions/${positionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen: false }),
    });

    if (response.ok) {
      setOpenPositions(prev => prev.filter(position => position.id !== positionId));
    }
    setIsWorking(false);
  };

  const handlePositionDelete = async (positionId: string) => {
    setIsWorking(true);
    const response = await fetch(`/api/open-positions/${positionId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setOpenPositions(prev => prev.filter(position => position.id !== positionId));
    }
    setIsWorking(false);
  };

  const handlePhaseUpdate = async () => {
    if (!enrollment || !canChangePhase || !phaseDraftNumber) {
      return;
    }
    setPhaseUpdating(true);

    const rulesetId = rulesets.find(r => r.phase_number === phaseDraftNumber)?.id;
    await fetch(`/api/enrollments/${enrollment.id}/phase`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phaseNumber: phaseDraftNumber,
        phaseStatus: phaseDraftStatus ?? 'active',
        rulesetId: rulesetId ?? null,
      }),
    });

    setPhaseUpdating(false);
  };

  const handleRemove = async () => {
    if (!onRemove) {
      return;
    }
    setIsWorking(true);
    await onRemove(enrollment.id);
    setIsWorking(false);
    setShowRemoveConfirm(false);
    onClose();
  };

  // Section component for consistent styling
  const Section = ({
    children,
    title,
    icon,
    delay = 0,
    className,
  }: {
    children: React.ReactNode;
    title: string;
    icon?: React.ReactNode;
    delay?: number;
    className?: string;
  }) => (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'space-y-4 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-sm',
        'dark:border-slate-800/80 dark:bg-slate-900/50',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-500 dark:text-slate-400">{icon}</span>}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      {children}
    </motion.section>
  );

  // Data card component
  const DataCard = ({
    label,
    value,
    highlight = false,
    positive = false,
    negative = false,
  }: {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
    positive?: boolean;
    negative?: boolean;
  }) => (
    <div className={cn(
      'rounded-xl border px-3 py-2.5 transition-all duration-200',
      highlight
        ? 'border-blue-200/50 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/30'
        : positive
          ? 'border-emerald-200/50 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/30'
          : negative
            ? 'border-red-200/50 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/30'
            : 'border-slate-200/60 bg-white/50 dark:border-slate-800/60 dark:bg-slate-800/50',
    )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Tradelia blur with premium depth */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Drawer - Tradelia Glass */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 35,
              stiffness: 400,
              mass: 0.8,
            }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden sm:w-[560px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-challenge-drawer-title"
          >
            {/* Tradelia Glass Background with depth layers */}
            <div className="from-white/98 dark:from-slate-950/98 absolute inset-0 bg-gradient-to-br via-white/95 to-slate-50/95 backdrop-blur-2xl dark:via-slate-950/95 dark:to-slate-900/95" />

            {/* Ambient glow effect */}
            <div className="absolute -left-32 top-0 size-64 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-400/5" />
            <div className="absolute -right-32 bottom-32 size-64 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-400/5" />

            {/* Tradelia Hairline Border */}
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />

            {/* Header - Enterprise Premium Glass with scroll compaction */}
            <motion.header
              style={{
                height: headerHeight,
                paddingTop: headerPadding,
                paddingBottom: headerPadding,
              }}
              className="relative z-10 shrink-0 border-b border-slate-200/80 bg-white/70 px-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70"
            >
              <motion.div
                style={{ opacity: headerBorderOpacity }}
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent dark:via-slate-700/50"
              />

              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Subtitle - Fades on scroll */}
                    <motion.p
                      style={{ opacity: subtitleOpacity }}
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {t('drawer.subtitle')}
                    </motion.p>

                    {/* Title - Scales slightly on scroll */}
                    <motion.h2
                      id="my-challenge-drawer-title"
                      style={{ scale: titleScale }}
                      className="mt-1 origin-left text-lg font-semibold text-slate-900 dark:text-slate-100"
                    >
                      {enrollment.program.name}
                    </motion.h2>

                    {/* Organizer - Fades on scroll */}
                    <motion.p
                      style={{ opacity: organizerOpacity }}
                      className="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
                    >
                      {enrollment.program.organizerName || '--'}
                    </motion.p>
                  </div>

                  {/* Status Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={cn(
                      'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                      statusConfig.bg,
                      statusConfig.darkBg,
                      statusConfig.color,
                    )}
                  >
                    {enrollment.status}
                  </motion.div>
                </div>

                {/* Close Button - Premium Glass */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'absolute right-4 top-4 rounded-full p-2',
                    'bg-slate-100/80 text-slate-500',
                    'transition-all duration-200',
                    'hover:bg-slate-200/80 hover:text-slate-700',
                    'dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700/80 dark:hover:text-slate-200',
                    'shadow-sm hover:shadow-md',
                  )}
                  aria-label="Close"
                  type="button"
                >
                  <CloseIcon />
                </motion.button>
              </div>
            </motion.header>

            {/* Content - Scrollable container */}
            <div
              ref={contentRef}
              className="relative flex-1 overflow-y-auto overscroll-contain scroll-smooth"
            >
              <div className="space-y-5 p-6 pb-32">
                {/* Challenge Ref Section */}
                <Section
                  title={t('drawer.challenge_ref_title')}
                  delay={0.1}
                  icon={(
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                  )}
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <DataCard
                      label={t('drawer.challenge_id_label')}
                      value={auditContext?.challengeRef.challengeId ?? t('drawer.value_missing')}
                      highlight
                    />
                    <DataCard
                      label={t('drawer.account_size_selected_label')}
                      value={accountSize ? formatMoney(accountSize) : t('drawer.value_missing')}
                      positive
                    />
                    <DataCard
                      label={t('drawer.started_at_label')}
                      value={formatDate(auditContext?.challengeRef.startedAt ?? null)}
                    />
                  </div>
                  {loadingMyChallenge && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <div className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      {t('drawer.loading')}
                    </motion.div>
                  )}
                </Section>

                {/* Phase Section */}
                <Section
                  title={t('drawer.phase_title')}
                  delay={0.15}
                  icon={(
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  )}
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <DataCard
                      label={t('drawer.phase_number_label')}
                      value={enrollment.currentPhaseNumber ?? 1}
                      highlight
                    />
                    <DataCard
                      label={t('drawer.phase_status_label')}
                      value={(
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-semibold',
                          enrollment.currentPhaseStatus === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' :
                          enrollment.currentPhaseStatus === 'passed' ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300' :
                          enrollment.currentPhaseStatus === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                        )}
                        >
                          {enrollment.currentPhaseStatus ?? 'not_started'}
                        </span>
                      )}
                    />
                    <DataCard
                      label={t('drawer.phase_updated_label')}
                      value={formatDate(enrollment.phaseUpdatedAt ?? null)}
                    />
                  </div>

                  {canChangePhase && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 grid gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/30"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.phase_number_label')}</span>
                          <select
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={phaseDraftNumber ?? 1}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setPhaseDraftNumber(Number.isNaN(value) ? 1 : value);
                            }}
                          >
                            {Array.from({ length: Math.max(1, rulesets.length || 1) }, (_, i) => i + 1)
                              .map(phaseNumber => (
                                <option key={phaseNumber} value={phaseNumber}>{phaseNumber}</option>
                              ))}
                          </select>
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.phase_status_label')}</span>
                          <select
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={phaseDraftStatus ?? 'active'}
                            onChange={(e) => {
                              setPhaseDraftStatus(e.target.value as 'not_started' | 'active' | 'passed' | 'failed');
                            }}
                          >
                            {['not_started', 'active', 'passed', 'failed'].map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <motion.button
                        type="button"
                        onClick={handlePhaseUpdate}
                        disabled={phaseUpdating}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {t('drawer.phase_update_action')}
                      </motion.button>
                    </motion.div>
                  )}
                </Section>

                {/* Challenge Spec Section */}
                <Section
                  title={t('drawer.challenge_spec_title')}
                  delay={0.2}
                  icon={(
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                  )}
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <DataCard
                      label={t('drawer.target_label')}
                      value={rulesets[0]?.profit_target_pct != null ? `${rulesets[0].profit_target_pct}%` : t('drawer.value_missing')}
                      positive
                    />
                    <DataCard
                      label={t('drawer.max_dd_label')}
                      value={rulesets[0]?.max_drawdown_pct != null ? `${rulesets[0].max_drawdown_pct}%` : t('drawer.value_missing')}
                      negative
                    />
                    <DataCard
                      label={t('drawer.daily_loss_label')}
                      value={rulesets[0]?.max_daily_loss_pct != null ? `${rulesets[0].max_daily_loss_pct}%` : t('drawer.value_missing')}
                      negative
                    />
                    <DataCard
                      label={t('drawer.min_days_label')}
                      value={rulesets[0]?.min_trading_days ?? competitionRules?.min_trading_days ?? t('drawer.value_missing')}
                      highlight
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <DataCard
                      label={t('drawer.automation_policy_label')}
                      value={rulesets[0]?.ea_allowed === false ? t('drawer.automation_manual') : t('drawer.automation_check')}
                    />
                    <DataCard
                      label={t('drawer.consistency_label')}
                      value={rulesets[0]?.consistency_required ? t('drawer.consistency_on') : t('drawer.consistency_off')}
                    />
                  </div>

                  {rulesets[0]?.best_day_max_pct != null && (
                    <DataCard
                      label={t('drawer.best_day_label')}
                      value={`${rulesets[0].best_day_max_pct}%`}
                    />
                  )}

                  {loadingSpec && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <div className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      {t('drawer.loading_spec')}
                    </motion.div>
                  )}
                </Section>

                {/* Account State Section */}
                <Section
                  title={t('drawer.account_state_title')}
                  delay={0.25}
                  icon={(
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" x2="12" y1="2" y2="22" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  )}
                >
                  {isEditing ? (
                    <div className="grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          { key: 'balance_start', label: t('drawer.balance_start_label'), step: '0.01' },
                          { key: 'equity_now', label: t('drawer.equity_now_label'), step: '0.01' },
                          { key: 'peak_equity', label: t('drawer.peak_equity_label'), step: '0.01' },
                        ].map(field => (
                          <label key={field.key} className="grid gap-1.5">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{field.label}</span>
                            <input
                              type="number"
                              step={field.step}
                              className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                              value={draft?.account_state?.[field.key as keyof typeof draft.account_state] ?? ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? null : Number(e.target.value);
                                updateDraft(current => ({
                                  ...current,
                                  account_state: {
                                    ...current.account_state,
                                    [field.key]: Number.isNaN(value as number) ? null : value,
                                  },
                                }));
                              }}
                            />
                          </label>
                        ))}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { key: 'profit_progress_pct', label: t('drawer.profit_progress_label'), step: '0.1' },
                          { key: 'max_dd_used_pct', label: t('drawer.max_dd_used_label'), step: '0.1' },
                          { key: 'daily_loss_used_pct_today', label: t('drawer.daily_loss_used_label'), step: '0.1' },
                          { key: 'days_traded', label: t('drawer.days_traded_label'), step: '1' },
                        ].map(field => (
                          <label key={field.key} className="grid gap-1.5">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{field.label}</span>
                            <input
                              type="number"
                              step={field.step}
                              className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                              value={draft?.account_state?.[field.key as keyof typeof draft.account_state] ?? ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? null : Number(e.target.value);
                                updateDraft(current => ({
                                  ...current,
                                  account_state: {
                                    ...current.account_state,
                                    [field.key]: Number.isNaN(value as number) ? null : value,
                                  },
                                }));
                              }}
                            />
                          </label>
                        ))}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.today_trade_count_label')}</span>
                          <input
                            type="number"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={draft?.account_state?.today_trade_count ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : Number(e.target.value);
                              updateDraft(current => ({
                                ...current,
                                account_state: {
                                  ...current.account_state,
                                  today_trade_count: Number.isNaN(value as number) ? null : value,
                                },
                              }));
                            }}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.today_realized_pnl_label')}</span>
                          <input
                            type="number"
                            step="0.01"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={draft?.account_state?.today_realized_pnl ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : Number(e.target.value);
                              updateDraft(current => ({
                                ...current,
                                account_state: {
                                  ...current.account_state,
                                  today_realized_pnl: Number.isNaN(value as number) ? null : value,
                                },
                              }));
                            }}
                          />
                        </label>
                      </div>
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.last_trade_at_label')}</span>
                        <input
                          type="date"
                          className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                          value={draft?.account_state?.last_trade_at?.slice(0, 10) ?? ''}
                          onChange={(e) => {
                            const value = e.target.value ? `${e.target.value}T00:00:00.000Z` : null;
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                last_trade_at: value,
                              },
                            }));
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <DataCard
                          label={t('drawer.balance_start_label')}
                          value={auditContext?.accountState.balanceStart !== null ? formatMoney(auditContext.accountState.balanceStart) : t('drawer.value_missing')}
                        />
                        <DataCard
                          label={t('drawer.equity_now_label')}
                          value={auditContext?.accountState.equityNow !== null ? formatMoney(auditContext.accountState.equityNow) : t('drawer.value_missing')}
                          highlight
                        />
                        <DataCard
                          label={t('drawer.peak_equity_label')}
                          value={auditContext?.accountState.peakEquity !== null ? formatMoney(auditContext.accountState.peakEquity) : t('drawer.value_missing')}
                          positive
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <DataCard
                          label={t('drawer.profit_progress_label')}
                          value={formatPct(auditContext?.accountState.profitProgressPct ?? null)}
                          positive={!!auditContext?.accountState.profitProgressPct && auditContext.accountState.profitProgressPct > 0}
                          negative={!!auditContext?.accountState.profitProgressPct && auditContext.accountState.profitProgressPct < 0}
                        />
                        <DataCard
                          label={t('drawer.max_dd_used_label')}
                          value={formatPct(auditContext?.accountState.maxDdUsedPct ?? null)}
                          negative={!!auditContext?.accountState.maxDdUsedPct && auditContext.accountState.maxDdUsedPct > 0}
                        />
                        <DataCard
                          label={t('drawer.daily_loss_used_label')}
                          value={formatPct(auditContext?.accountState.dailyLossUsedPctToday ?? null)}
                          negative={!!auditContext?.accountState.dailyLossUsedPctToday && auditContext.accountState.dailyLossUsedPctToday > 0}
                        />
                        <DataCard
                          label={t('drawer.days_traded_label')}
                          value={auditContext?.accountState.daysTraded ?? t('drawer.value_missing')}
                          highlight
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <DataCard
                          label={t('drawer.today_trade_count_label')}
                          value={auditContext?.accountState.todayTradeCount ?? t('drawer.value_missing')}
                        />
                        <DataCard
                          label={t('drawer.today_realized_pnl_label')}
                          value={auditContext?.accountState.todayRealizedPnl !== null ? formatMoney(auditContext.accountState.todayRealizedPnl) : t('drawer.value_missing')}
                          positive={!!auditContext?.accountState.todayRealizedPnl && auditContext.accountState.todayRealizedPnl > 0}
                          negative={!!auditContext?.accountState.todayRealizedPnl && auditContext.accountState.todayRealizedPnl < 0}
                        />
                      </div>
                      <DataCard
                        label={t('drawer.last_trade_at_label')}
                        value={formatDate(auditContext?.accountState.lastTradeAt ?? null)}
                      />
                    </div>
                  )}
                </Section>

                {/* Open Positions Section */}
                <Section
                  title={t('drawer.open_positions_title')}
                  delay={0.3}
                  icon={(
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {openPositions.length}
{' '}
{openPositions.length === 1 ? 'position' : 'positions'}
                    </span>
                    <motion.button
                      type="button"
                      onClick={() => setIsEditingPositions(prev => !prev)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {isEditingPositions ? t('drawer.open_positions_manage_done') : t('drawer.open_positions_manage')}
                    </motion.button>
                  </div>

                  {loadingOpenPositions ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      {t('drawer.open_positions_loading')}
                    </div>
                  ) : openPositionsError ? (
                    <p className="text-xs text-red-500">{openPositionsError}</p>
                  ) : openPositions.length === 0 ? (
                    <p className="text-xs text-slate-500">{t('drawer.open_positions_empty')}</p>
                  ) : (
                    <div className="space-y-2">
                      {openPositions.map((position, index) => (
                        <motion.div
                          key={position.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-white/50 p-3 dark:border-slate-800/60 dark:bg-slate-800/30"
                        >
                          <div className="min-w-[100px]">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{position.symbol}</p>
                            <p className="text-xs text-slate-500">
                              <span className={cn(
                                'rounded px-1.5 py-0.5 text-[10px] font-medium',
                                position.side === 'long' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
                              )}
                              >
                                {position.side.toUpperCase()}
                              </span>
                              <span className="ml-2">{formatNumber(position.size)}</span>
                            </p>
                          </div>
                          <div className="flex gap-4 text-xs">
                            <div>
                              <p className="text-slate-500">{t('drawer.open_positions_entry')}</p>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(position.entry_price ?? null)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">{t('drawer.open_positions_sl')}</p>
                              <p className="font-semibold text-red-600 dark:text-red-400">{formatNumber(position.stop_loss ?? null)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">{t('drawer.open_positions_tp')}</p>
                              <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formatNumber(position.take_profit ?? null)}</p>
                            </div>
                          </div>
                          {isEditingPositions && (
                            <div className="flex items-center gap-2">
                              <motion.button
                                type="button"
                                onClick={() => handlePositionClose(position.id)}
                                disabled={isWorking}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                              >
                                {t('drawer.open_positions_close')}
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={() => handlePositionDelete(position.id)}
                                disabled={isWorking}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                              >
                                {t('drawer.open_positions_remove')}
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {isEditingPositions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 grid gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/30"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_symbol')}</span>
                          <input
                            type="text"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.symbol}
                            onChange={e => setPositionDraft(prev => ({ ...prev, symbol: e.target.value }))}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_side')}</span>
                          <select
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.side}
                            onChange={e => setPositionDraft(prev => ({ ...prev, side: e.target.value as 'long' | 'short' }))}
                          >
                            <option value="long">{t('drawer.open_positions_long')}</option>
                            <option value="short">{t('drawer.open_positions_short')}</option>
                          </select>
                        </label>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_size')}</span>
                          <input
                            type="number"
                            step="0.01"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.size}
                            onChange={e => setPositionDraft(prev => ({ ...prev, size: e.target.value }))}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_entry')}</span>
                          <input
                            type="number"
                            step="0.0001"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.entryPrice}
                            onChange={e => setPositionDraft(prev => ({ ...prev, entryPrice: e.target.value }))}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_unrealized')}</span>
                          <input
                            type="number"
                            step="0.01"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.unrealizedPnl}
                            onChange={e => setPositionDraft(prev => ({ ...prev, unrealizedPnl: e.target.value }))}
                          />
                        </label>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_sl')}</span>
                          <input
                            type="number"
                            step="0.0001"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.stopLoss}
                            onChange={e => setPositionDraft(prev => ({ ...prev, stopLoss: e.target.value }))}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_tp')}</span>
                          <input
                            type="number"
                            step="0.0001"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.takeProfit}
                            onChange={e => setPositionDraft(prev => ({ ...prev, takeProfit: e.target.value }))}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.open_positions_opened')}</span>
                          <input
                            type="date"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={positionDraft.openedAt}
                            onChange={e => setPositionDraft(prev => ({ ...prev, openedAt: e.target.value }))}
                          />
                        </label>
                      </div>
                      {openPositionsError && (
                        <p className="text-xs text-red-500">{openPositionsError}</p>
                      )}
                      <motion.button
                        type="button"
                        onClick={handlePositionCreate}
                        disabled={isWorking}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {t('drawer.open_positions_add')}
                      </motion.button>
                    </motion.div>
                  )}
                </Section>

                {/* Context Lite Section */}
                <Section
                  title={t('drawer.context_lite_title')}
                  delay={0.35}
                  icon={(
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" x2="22" y1="12" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  )}
                >
                  {isEditing ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.session_label')}</span>
                        <select
                          className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                          value={draft?.context_lite?.session ?? 'OFF'}
                          onChange={(e) => {
                            updateDraft(current => ({
                              ...current,
                              context_lite: {
                                ...current.context_lite,
                                session: e.target.value as ContextSession,
                              },
                            }));
                          }}
                        >
                          {['OFF', 'ASIA', 'EU', 'US'].map(session => (
                            <option key={session} value={session}>{session}</option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.event_risk_label')}</span>
                        <select
                          className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                          value={draft?.context_lite?.event_risk ?? 'NONE'}
                          onChange={(e) => {
                            updateDraft(current => ({
                              ...current,
                              context_lite: {
                                ...current.context_lite,
                                event_risk: e.target.value as ContextEventRisk,
                              },
                            }));
                          }}
                        >
                          {['NONE', 'SCHEDULED', 'LIVE'].map(risk => (
                            <option key={risk} value={risk}>{risk}</option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.volatility_hint_label')}</span>
                        <select
                          className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                          value={draft?.context_lite?.volatility_hint ?? 'NORMAL'}
                          onChange={(e) => {
                            updateDraft(current => ({
                              ...current,
                              context_lite: {
                                ...current.context_lite,
                                volatility_hint: e.target.value as ContextVolatility,
                              },
                            }));
                          }}
                        >
                          {['LOW', 'NORMAL', 'HIGH'].map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <DataCard
                        label={t('drawer.session_label')}
                        value={(
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-semibold',
                            auditContext?.contextLite.session === 'OFF' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                            auditContext?.contextLite.session === 'ASIA' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                            auditContext?.contextLite.session === 'EU' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
                          )}
                          >
                            {auditContext?.contextLite.session}
                          </span>
                        )}
                      />
                      <DataCard
                        label={t('drawer.event_risk_label')}
                        value={(
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-semibold',
                            auditContext?.contextLite.eventRisk === 'NONE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' :
                            auditContext?.contextLite.eventRisk === 'SCHEDULED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                            'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
                          )}
                          >
                            {auditContext?.contextLite.eventRisk}
                          </span>
                        )}
                      />
                      <DataCard
                        label={t('drawer.volatility_hint_label')}
                        value={(
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-semibold',
                            auditContext?.contextLite.volatilityHint === 'LOW' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' :
                            auditContext?.contextLite.volatilityHint === 'NORMAL' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
                          )}
                          >
                            {auditContext?.contextLite.volatilityHint}
                          </span>
                        )}
                      />
                    </div>
                  )}
                </Section>

                {/* Operating Envelope Section */}
                <Section
                  title={t('drawer.operating_envelope_title')}
                  delay={0.4}
                  icon={(
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  )}
                >
                  {isEditing ? (
                    <div className="grid gap-4">
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.trade_gate_label')}</span>
                        <select
                          className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                          value={draft?.operating_envelope?.trade_gate ?? auditContext?.operatingEnvelope.tradeGate ?? 'RESTRICTED'}
                          onChange={(e) => {
                            updateDraft(current => ({
                              ...current,
                              operating_envelope: {
                                ...current.operating_envelope,
                                trade_gate: e.target.value as TradeGate,
                              },
                            }));
                          }}
                        >
                          {['OPEN', 'RESTRICTED', 'CLOSED'].map(gate => (
                            <option key={gate} value={gate}>{gate}</option>
                          ))}
                        </select>
                      </label>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.daily_risk_cap_label')}</span>
                          <input
                            type="number"
                            step="0.1"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={draft?.operating_envelope?.risk_budget?.daily_risk_cap_pct ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              updateDraft(current => ({
                                ...current,
                                operating_envelope: {
                                  ...current.operating_envelope,
                                  risk_budget: {
                                    ...current.operating_envelope?.risk_budget,
                                    daily_risk_cap_pct: Number.isNaN(value as number) ? undefined : value,
                                  },
                                },
                              }));
                            }}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.risk_per_trade_pct_label')}</span>
                          <input
                            type="number"
                            step="0.1"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={draft?.operating_envelope?.risk_budget?.risk_per_trade_pct ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              updateDraft(current => ({
                                ...current,
                                operating_envelope: {
                                  ...current.operating_envelope,
                                  risk_budget: {
                                    ...current.operating_envelope?.risk_budget,
                                    risk_per_trade_pct: Number.isNaN(value as number) ? undefined : value,
                                  },
                                },
                              }));
                            }}
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.max_trades_label')}</span>
                          <input
                            type="number"
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                            value={draft?.operating_envelope?.risk_budget?.max_trades ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              updateDraft(current => ({
                                ...current,
                                operating_envelope: {
                                  ...current.operating_envelope,
                                  risk_budget: {
                                    ...current.operating_envelope?.risk_budget,
                                    max_trades: Number.isNaN(value as number) ? undefined : value,
                                  },
                                },
                              }));
                            }}
                          />
                        </label>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('drawer.stop_rules_label')}</p>
                        <div className="flex flex-wrap gap-3">
                          {['STOP_AFTER_2_LOSSES', 'STOP_IF_EVENT_RISK_LIVE'].map(rule => (
                            <label key={rule} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <input
                                type="checkbox"
                                checked={draft?.operating_envelope?.stop_rules?.includes(rule) ?? false}
                                onChange={(e) => {
                                  updateDraft((current) => {
                                    const existing = new Set(current.operating_envelope?.stop_rules ?? []);
                                    if (e.target.checked) {
                                      existing.add(rule);
                                    } else {
                                      existing.delete(rule);
                                    }
                                    return {
                                      ...current,
                                      operating_envelope: {
                                        ...current.operating_envelope,
                                        stop_rules: Array.from(existing),
                                      },
                                    };
                                  });
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{t(`drawer.stop_rules.${rule}`)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.notes_short_label')}</span>
                        <textarea
                          rows={2}
                          className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                          value={draft?.operating_envelope?.notes_short ?? ''}
                          onChange={(e) => {
                            updateDraft(current => ({
                              ...current,
                              operating_envelope: {
                                ...current.operating_envelope,
                                notes_short: e.target.value,
                              },
                            }));
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/50 px-4 py-3 dark:border-slate-800/60 dark:bg-slate-800/30">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.automation_policy_label')}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{auditContext?.operatingEnvelope.automationPolicy}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/50 px-4 py-3 dark:border-slate-800/60 dark:bg-slate-800/30">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.trade_gate_label')}</span>
                        <span className={cn(
                          'rounded-full px-3 py-1 text-xs font-semibold',
                          auditContext?.operatingEnvelope.tradeGate === 'OPEN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' :
                          auditContext?.operatingEnvelope.tradeGate === 'RESTRICTED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
                        )}
                        >
                          {auditContext?.operatingEnvelope.tradeGate}
                        </span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <DataCard
                          label={t('drawer.daily_risk_cap_label')}
                          value={formatPct(auditContext?.operatingEnvelope.riskBudget.dailyRiskCapPct ?? null)}
                        />
                        <DataCard
                          label={t('drawer.risk_per_trade_pct_label')}
                          value={formatPct(auditContext?.operatingEnvelope.riskBudget.riskPerTradePct ?? null)}
                        />
                        <DataCard
                          label={t('drawer.max_trades_label')}
                          value={auditContext?.operatingEnvelope.riskBudget.maxTrades}
                          highlight
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('drawer.stop_rules_label')}</p>
                        <div className="flex flex-wrap gap-2">
                          {auditContext?.operatingEnvelope.stopRules.map(rule => (
                            <span
                              key={rule}
                              className="rounded-full border border-slate-200/60 bg-white/50 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-800/60 dark:bg-slate-800/30 dark:text-slate-400"
                            >
                              {t(`drawer.stop_rules.${rule}`)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200/60 bg-white/50 px-4 py-3 dark:border-slate-800/60 dark:bg-slate-800/30">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('drawer.notes_short_label')}</p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{auditContext?.operatingEnvelope.notesShort}</p>
                      </div>
                    </div>
                  )}
                </Section>
              </div>
            </div>

            {/* Footer - Enterprise Premium Glass Sticky */}
            <footer className="relative shrink-0 border-t border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
              {/* Gradient overlay for depth */}
              <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-950/90" />

              <div className="relative flex flex-wrap items-center gap-2">
                {/* Edit Button */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsEditing(prev => !prev);
                    if (!draft) {
                      ensureDraft();
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50/80 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800/80"
                >
                  {isEditing ? t('drawer.edit_cancel') : t('drawer.edit')}
                </motion.button>

                {/* Save Button */}
                {isEditing && (
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={isWorking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {t('drawer.save')}
                  </motion.button>
                )}

                {/* Open Signals Link */}
                <motion.a
                  href="/dashboard/signals"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50/80 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800/80"
                >
                  {t('drawer.open_signals')}
                </motion.a>

                {/* Abandon Button */}
                {canAbandon && (
                  <motion.button
                    type="button"
                    onClick={handleAbandon}
                    disabled={isWorking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-all hover:bg-amber-100/80 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  >
                    {t('drawer.abandon')}
                  </motion.button>
                )}

                {/* Official Link */}
                {enrollment.program.officialUrl && (
                  <motion.a
                    href={enrollment.program.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50/80 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800/80"
                  >
                    <ExternalLinkIcon size={16} />
                    {t('drawer.official_link')}
                  </motion.a>
                )}

                {/* Activate Button */}
                {canActivate && (
                  <motion.button
                    type="button"
                    onClick={handleActivate}
                    disabled={isWorking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {t('drawer.confirm_start')}
                  </motion.button>
                )}

                {/* Remove Button */}
                {canRemove && (
                  <motion.button
                    type="button"
                    onClick={() => setShowRemoveConfirm(true)}
                    disabled={isWorking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100/80 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    {t('drawer.remove')}
                  </motion.button>
                )}
              </div>
            </footer>
          </motion.aside>

          {/* Remove Confirmation Modal */}
          <AnimatePresence>
            {showRemoveConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-confirm-title"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                  className="glass-panel w-full max-w-sm rounded-2xl border border-slate-200/50 bg-white/95 p-6 shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/95"
                >
                  <h3 id="remove-confirm-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {t('drawer.remove_confirm_title')}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t('drawer.remove_confirm_description')}
                  </p>
                  <div className="mt-5 flex items-center justify-end gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setShowRemoveConfirm(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-lg border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      {t('drawer.remove_confirm_cancel')}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleRemove}
                      disabled={isWorking}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t('drawer.remove_confirm_action')}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
