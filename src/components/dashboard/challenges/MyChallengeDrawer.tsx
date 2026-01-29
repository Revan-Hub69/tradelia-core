'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { useNavigationContext } from '@/components/navigation/useNavigationContext';

import type { EnrollmentStatus } from './EnrollmentStatusCard';
import { ExternalLinkIcon } from './PremiumIcons';

type Enrollment = {
  id: string;
  status: EnrollmentStatus;
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

export function MyChallengeDrawer({
  enrollment,
  isOpen,
  onClose,
  onActivate,
  onRemove,
}: MyChallengeDrawerProps) {
  const t = useTranslations('MyChallenges') as any;
  const { setOverlayOpen } = useNavigationContext();
  const [isWorking, setIsWorking] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [myChallenge, setMyChallenge] = useState<MyChallengeRecord | null>(null);
  const [loadingMyChallenge, setLoadingMyChallenge] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<MyChallengeRecord | null>(null);
  const [rulesets, setRulesets] = useState<RulesetSpec[]>([]);
  const [competitionRules, setCompetitionRules] = useState<CompetitionRulesSpec | null>(null);
  const [loadingSpec, setLoadingSpec] = useState(false);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden sm:w-[520px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-challenge-drawer-title"
          >
            <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl dark:bg-slate-950/95" />

            <div className="relative flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('drawer.subtitle')}
                </p>
                <h2 id="my-challenge-drawer-title" className="text-lg font-semibold">
                  {enrollment.program.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {enrollment.program.organizerName || '--'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full border border-border/60 bg-white/60 p-2 text-muted-foreground transition hover:text-foreground"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="relative flex-1 space-y-6 overflow-y-auto px-5 py-6">
              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.challenge_ref_title')}</h3>
                <div className="grid gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                    <span>{t('drawer.challenge_id_label')}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {auditContext?.challengeRef.challengeId ?? t('drawer.value_missing')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                    <span>{t('drawer.account_size_selected_label')}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {accountSize ? formatMoney(accountSize) : t('drawer.value_missing')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                    <span>{t('drawer.started_at_label')}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatDate(auditContext?.challengeRef.startedAt ?? null)}
                    </span>
                  </div>
                </div>
                {loadingMyChallenge && (
                  <p className="text-xs text-muted-foreground">{t('drawer.loading')}</p>
                )}
              </section>

              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.challenge_spec_title')}</h3>
                <div className="grid gap-2 text-xs text-muted-foreground">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <p>{t('drawer.target_label')}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {rulesets[0]?.profit_target_pct != null
                          ? `${rulesets[0].profit_target_pct}%`
                          : t('drawer.value_missing')}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <p>{t('drawer.max_dd_label')}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {rulesets[0]?.max_drawdown_pct != null
                          ? `${rulesets[0].max_drawdown_pct}%`
                          : t('drawer.value_missing')}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <p>{t('drawer.daily_loss_label')}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {rulesets[0]?.max_daily_loss_pct != null
                          ? `${rulesets[0].max_daily_loss_pct}%`
                          : t('drawer.value_missing')}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <p>{t('drawer.min_days_label')}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {rulesets[0]?.min_trading_days ?? competitionRules?.min_trading_days ?? t('drawer.value_missing')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                    <span>{t('drawer.automation_policy_label')}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {rulesets[0]?.ea_allowed === false
                        ? t('drawer.automation_manual')
                        : t('drawer.automation_check')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                    <span>{t('drawer.consistency_label')}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {rulesets[0]?.consistency_required ? t('drawer.consistency_on') : t('drawer.consistency_off')}
                    </span>
                  </div>
                  {rulesets[0]?.best_day_max_pct != null && (
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.best_day_label')}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {`${rulesets[0].best_day_max_pct}%`}
                      </span>
                    </div>
                  )}
                </div>
                {loadingSpec && (
                  <p className="text-xs text-muted-foreground">{t('drawer.loading_spec')}</p>
                )}
              </section>

              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.account_state_title')}</h3>
                {isEditing ? (
                  <div className="grid gap-3 text-xs text-muted-foreground">
                    <div className="grid grid-cols-3 gap-2">
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.balance_start_label')}</span>
                        <input
                          type="number"
                          step="0.01"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.balance_start ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                balance_start: Number.isNaN(value as number) ? null : value,
                              },
                            }));
                          }}
                        />
                      </label>
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.equity_now_label')}</span>
                        <input
                          type="number"
                          step="0.01"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.equity_now ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                equity_now: Number.isNaN(value as number) ? null : value,
                              },
                            }));
                          }}
                        />
                      </label>
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.peak_equity_label')}</span>
                        <input
                          type="number"
                          step="0.01"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.peak_equity ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                peak_equity: Number.isNaN(value as number) ? null : value,
                              },
                            }));
                          }}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.profit_progress_label')}</span>
                        <input
                          type="number"
                          step="0.1"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.profit_progress_pct ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                profit_progress_pct: Number.isNaN(value as number) ? null : value,
                              },
                            }));
                          }}
                        />
                      </label>
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.max_dd_used_label')}</span>
                        <input
                          type="number"
                          step="0.1"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.max_dd_used_pct ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                max_dd_used_pct: Number.isNaN(value as number) ? null : value,
                              },
                            }));
                          }}
                        />
                      </label>
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.daily_loss_used_label')}</span>
                        <input
                          type="number"
                          step="0.1"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.daily_loss_used_pct_today ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                daily_loss_used_pct_today: Number.isNaN(value as number) ? null : value,
                              },
                            }));
                          }}
                        />
                      </label>
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.days_traded_label')}</span>
                        <input
                          type="number"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.days_traded ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              account_state: {
                                ...current.account_state,
                                days_traded: Number.isNaN(value as number) ? null : value,
                              },
                            }));
                          }}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.today_trade_count_label')}</span>
                        <input
                          type="number"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.today_trade_count ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
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
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.today_realized_pnl_label')}</span>
                        <input
                          type="number"
                          step="0.01"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.account_state?.today_realized_pnl ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
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
                    <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.last_trade_at_label')}</span>
                      <input
                        type="date"
                        className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                        value={draft?.account_state?.last_trade_at?.slice(0, 10) ?? ''}
                        onChange={(event) => {
                          const value = event.target.value ? `${event.target.value}T00:00:00.000Z` : null;
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
                  <div className="grid gap-2 text-xs text-muted-foreground">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.balance_start_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {auditContext?.accountState.balanceStart !== null
                            ? formatMoney(auditContext.accountState.balanceStart)
                            : t('drawer.value_missing')}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.equity_now_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {auditContext?.accountState.equityNow !== null
                            ? formatMoney(auditContext.accountState.equityNow)
                            : t('drawer.value_missing')}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.peak_equity_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {auditContext?.accountState.peakEquity !== null
                            ? formatMoney(auditContext.accountState.peakEquity)
                            : t('drawer.value_missing')}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.profit_progress_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPct(auditContext?.accountState.profitProgressPct ?? null)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.max_dd_used_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPct(auditContext?.accountState.maxDdUsedPct ?? null)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.daily_loss_used_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPct(auditContext?.accountState.dailyLossUsedPctToday ?? null)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.days_traded_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {auditContext?.accountState.daysTraded ?? t('drawer.value_missing')}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.today_trade_count_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {auditContext?.accountState.todayTradeCount ?? t('drawer.value_missing')}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.today_realized_pnl_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {auditContext?.accountState.todayRealizedPnl !== null
                            ? formatMoney(auditContext.accountState.todayRealizedPnl)
                            : t('drawer.value_missing')}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <p>{t('drawer.last_trade_at_label')}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatDate(auditContext?.accountState.lastTradeAt ?? null)}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.context_lite_title')}</h3>
                {isEditing ? (
                  <div className="grid gap-2 text-xs text-muted-foreground">
                    <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.session_label')}</span>
                      <select
                        className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                        value={draft?.context_lite?.session ?? 'OFF'}
                        onChange={(event) => {
                          updateDraft(current => ({
                            ...current,
                            context_lite: {
                              ...current.context_lite,
                              session: event.target.value as ContextSession,
                            },
                          }));
                        }}
                      >
                        {['OFF', 'ASIA', 'EU', 'US'].map(session => (
                          <option key={session} value={session}>{session}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.event_risk_label')}</span>
                      <select
                        className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                        value={draft?.context_lite?.event_risk ?? 'NONE'}
                        onChange={(event) => {
                          updateDraft(current => ({
                            ...current,
                            context_lite: {
                              ...current.context_lite,
                              event_risk: event.target.value as ContextEventRisk,
                            },
                          }));
                        }}
                      >
                        {['NONE', 'SCHEDULED', 'LIVE'].map(risk => (
                          <option key={risk} value={risk}>{risk}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.volatility_hint_label')}</span>
                      <select
                        className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                        value={draft?.context_lite?.volatility_hint ?? 'NORMAL'}
                        onChange={(event) => {
                          updateDraft(current => ({
                            ...current,
                            context_lite: {
                              ...current.context_lite,
                              volatility_hint: event.target.value as ContextVolatility,
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
                  <div className="grid gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.session_label')}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {auditContext?.contextLite.session}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.event_risk_label')}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {auditContext?.contextLite.eventRisk}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.volatility_hint_label')}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {auditContext?.contextLite.volatilityHint}
                      </span>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.operating_envelope_title')}</h3>
                {isEditing ? (
                  <div className="grid gap-3 text-xs text-muted-foreground">
                    <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.trade_gate_label')}</span>
                      <select
                        className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                        value={draft?.operating_envelope?.trade_gate ?? auditContext?.operatingEnvelope.tradeGate ?? 'RESTRICTED'}
                        onChange={(event) => {
                          updateDraft(current => ({
                            ...current,
                            operating_envelope: {
                              ...current.operating_envelope,
                              trade_gate: event.target.value as TradeGate,
                            },
                          }));
                        }}
                      >
                        {['OPEN', 'RESTRICTED', 'CLOSED'].map(gate => (
                          <option key={gate} value={gate}>{gate}</option>
                        ))}
                      </select>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.daily_risk_cap_label')}</span>
                        <input
                          type="number"
                          step="0.1"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.operating_envelope?.risk_budget?.daily_risk_cap_pct ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              operating_envelope: {
                                ...current.operating_envelope,
                                risk_budget: {
                                  ...current.operating_envelope?.risk_budget,
                                  daily_risk_cap_pct: Number.isNaN(value as number) ? null : value,
                                },
                              },
                            }));
                          }}
                        />
                      </label>
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.risk_per_trade_pct_label')}</span>
                        <input
                          type="number"
                          step="0.1"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.operating_envelope?.risk_budget?.risk_per_trade_pct ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              operating_envelope: {
                                ...current.operating_envelope,
                                risk_budget: {
                                  ...current.operating_envelope?.risk_budget,
                                  risk_per_trade_pct: Number.isNaN(value as number) ? null : value,
                                },
                              },
                            }));
                          }}
                        />
                      </label>
                      <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <span>{t('drawer.max_trades_label')}</span>
                        <input
                          type="number"
                          className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                          value={draft?.operating_envelope?.risk_budget?.max_trades ?? ''}
                          onChange={(event) => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            updateDraft(current => ({
                              ...current,
                              operating_envelope: {
                                ...current.operating_envelope,
                                risk_budget: {
                                  ...current.operating_envelope?.risk_budget,
                                  max_trades: Number.isNaN(value as number) ? null : value,
                                },
                              },
                            }));
                          }}
                        />
                      </label>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('drawer.stop_rules_label')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {['STOP_AFTER_2_LOSSES', 'STOP_IF_EVENT_RISK_LIVE'].map(rule => (
                          <label key={rule} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={draft?.operating_envelope?.stop_rules?.includes(rule) ?? false}
                              onChange={(event) => {
                                updateDraft(current => {
                                  const existing = new Set(current.operating_envelope?.stop_rules ?? []);
                                  if (event.target.checked) {
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
                            />
                            <span>{t(`drawer.stop_rules.${rule}`)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <label className="grid gap-1 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.notes_short_label')}</span>
                      <textarea
                        rows={2}
                        className="rounded-md border border-border/60 bg-white px-2 py-1 text-sm text-foreground"
                        value={draft?.operating_envelope?.notes_short ?? ''}
                        onChange={(event) => {
                          updateDraft(current => ({
                            ...current,
                            operating_envelope: {
                              ...current.operating_envelope,
                              notes_short: event.target.value,
                            },
                          }));
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="grid gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.automation_policy_label')}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {auditContext?.operatingEnvelope.automationPolicy}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span>{t('drawer.trade_gate_label')}</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {auditContext?.operatingEnvelope.tradeGate}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.daily_risk_cap_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPct(auditContext?.operatingEnvelope.riskBudget.dailyRiskCapPct ?? null)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.risk_per_trade_pct_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPct(auditContext?.operatingEnvelope.riskBudget.riskPerTradePct ?? null)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                        <p>{t('drawer.max_trades_label')}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {auditContext?.operatingEnvelope.riskBudget.maxTrades}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('drawer.stop_rules_label')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {auditContext?.operatingEnvelope.stopRules.map(rule => (
                          <span
                            key={rule}
                            className="rounded-full border border-border/60 bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                          >
                            {t(`drawer.stop_rules.${rule}`)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <p>{t('drawer.notes_short_label')}</p>
                      <p className="text-sm font-medium text-foreground">
                        {auditContext?.operatingEnvelope.notesShort}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="relative flex flex-col gap-2 border-t border-border/60 bg-white/80 px-5 py-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(prev => !prev);
                    if (!draft) {
                      ensureDraft();
                    }
                  }}
                  className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  {isEditing ? t('drawer.edit_cancel') : t('drawer.edit')}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isWorking}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {t('drawer.save')}
                  </button>
                )}
                <a
                  href="/dashboard/signals"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  {t('drawer.open_signals')}
                </a>
                {canAbandon && (
                  <button
                    type="button"
                    onClick={handleAbandon}
                    disabled={isWorking}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {t('drawer.abandon')}
                  </button>
                )}
              </div>

              {enrollment.program.officialUrl && (
                <a
                  href={enrollment.program.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  <ExternalLinkIcon size={16} />
                  {t('drawer.official_link')}
                </a>
              )}

              {canActivate && (
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isWorking}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t('drawer.confirm_start')}
                </button>
              )}

              {canRemove && (
                <button
                  type="button"
                  onClick={() => setShowRemoveConfirm(true)}
                  disabled={isWorking}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  {t('drawer.remove')}
                </button>
              )}
            </div>
          </motion.aside>

          <AnimatePresence>
            {showRemoveConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-confirm-title"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="glass-panel w-full max-w-sm rounded-2xl border border-border/50 p-6 shadow-2xl"
                >
                  <h3 id="remove-confirm-title" className="text-lg font-semibold">
                    {t('drawer.remove_confirm_title')}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('drawer.remove_confirm_description')}
                  </p>
                  <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRemoveConfirm(false)}
                      className="rounded-lg border border-border/60 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                    >
                      {t('drawer.remove_confirm_cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      disabled={isWorking}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t('drawer.remove_confirm_action')}
                    </button>
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
