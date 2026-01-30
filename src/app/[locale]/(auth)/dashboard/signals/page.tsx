'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

type Enrollment = {
  id: string;
  status: string;
  currentPhaseNumber?: number | null;
  program: {
    id: string;
    name: string;
    organizerName?: string;
  };
  offer: {
    id: string;
    name?: string | null;
    accountSize?: number | string | null;
    accountCurrency?: string | null;
  };
};

type Ruleset = {
  id?: string | null;
  phase_number: number;
  phase_name?: string | null;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  min_trading_days: number | null;
  ea_allowed?: boolean | null;
  news_trading?: boolean | null;
  weekend_holding?: boolean | null;
  consistency_required?: boolean | null;
  best_day_max_pct?: number | null;
};

type MyChallengeRecord = {
  enrollment_id: string;
  account_state?: {
    balance_start?: number | null;
    equity_now?: number | null;
    profit_progress_pct?: number | null;
    max_dd_used_pct?: number | null;
    daily_loss_used_pct_today?: number | null;
    days_traded?: number | null;
  };
};

type OpenPosition = {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entry_price?: number | null;
  opened_at?: string | null;
  is_open?: boolean | null;
};

export default function SignalsPage() {
  const t = useTranslations('Signals') as any;
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [rulesets, setRulesets] = useState<Ruleset[]>([]);
  const [myChallenge, setMyChallenge] = useState<MyChallengeRecord | null>(null);
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [loadingContext, setLoadingContext] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchEnrollments = async () => {
      try {
        setLoadingEnrollments(true);
        const response = await fetch('/api/enrollments?status=active');
        const data = await response.json();
        if (!active) {
          return;
        }
        if (response.ok && data?.success) {
          const next = data.data ?? [];
          setEnrollments(next);
          setSelectedEnrollmentId(prev => prev ?? next?.[0]?.id ?? null);
          setIsFreeMode(next.length === 0);
        } else {
          setEnrollments([]);
        }
      } finally {
        if (active) {
          setLoadingEnrollments(false);
        }
      }
    };
    fetchEnrollments();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!selectedEnrollmentId || isFreeMode) {
      setRulesets([]);
      setMyChallenge(null);
      setOpenPositions([]);
      return () => {
        active = false;
      };
    }

    const fetchContext = async () => {
      try {
        setLoadingContext(true);
        const [specResponse, challengeResponse, positionsResponse] = await Promise.all([
          fetch(`/api/challenge-spec?enrollmentId=${selectedEnrollmentId}`),
          fetch(`/api/my-challenges?enrollmentId=${selectedEnrollmentId}`),
          fetch(`/api/open-positions?enrollmentId=${selectedEnrollmentId}`),
        ]);
        const specData = await specResponse.json();
        const challengeData = await challengeResponse.json();
        const positionsData = await positionsResponse.json();
        if (!active) {
          return;
        }
        if (specResponse.ok && specData?.success) {
          setRulesets(specData.data?.rulesets ?? []);
        } else {
          setRulesets([]);
        }
        if (challengeResponse.ok && challengeData?.success) {
          setMyChallenge(challengeData.data ?? null);
        } else {
          setMyChallenge(null);
        }
        if (positionsResponse.ok && positionsData?.success) {
          setOpenPositions(positionsData.data ?? []);
        } else {
          setOpenPositions([]);
        }
      } finally {
        if (active) {
          setLoadingContext(false);
        }
      }
    };

    fetchContext();
    return () => {
      active = false;
    };
  }, [selectedEnrollmentId]);

  const selectedEnrollment = useMemo(
    () => enrollments.find(entry => entry.id === selectedEnrollmentId) ?? null,
    [enrollments, selectedEnrollmentId],
  );

  const currentPhaseNumber = selectedEnrollment?.currentPhaseNumber ?? 1;
  const currentRuleset = useMemo(
    () => rulesets.find(rule => rule.phase_number === currentPhaseNumber) ?? rulesets[0] ?? null,
    [rulesets, currentPhaseNumber],
  );

  const formatPct = (value: number | null | undefined) => {
    if (value == null) {
      return t('selector_value_missing');
    }
    return `${value}%`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Challenge Context Selector */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{t('challenge_selector_title')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('challenge_selector_description')}
              </p>
            </div>
            <div className="min-w-[220px]">
              <select
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground"
                value={isFreeMode ? 'free' : selectedEnrollmentId ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === 'free') {
                    setIsFreeMode(true);
                    setSelectedEnrollmentId(null);
                  } else {
                    setIsFreeMode(false);
                    setSelectedEnrollmentId(value);
                  }
                }}
                disabled={loadingEnrollments || enrollments.length === 0}
              >
                {enrollments.length === 0 && (
                  <option value="">{t('challenge_selector_empty')}</option>
                )}
                {enrollments.length > 0 && (
                  <option value="free">{t('challenge_selector_free')}</option>
                )}
                {enrollments.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.program.name}{entry.offer?.name ? ` · ${entry.offer.name}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingEnrollments ? (
            <p className="mt-4 text-sm text-muted-foreground">{t('challenge_selector_loading')}</p>
          ) : isFreeMode ? (
            <div className="mt-4 rounded-xl border border-dashed border-muted-foreground/30 p-4 text-sm text-muted-foreground">
              {t('challenge_selector_free_description')}
            </div>
          ) : !selectedEnrollment ? (
            <div className="mt-4 rounded-xl border border-dashed border-muted-foreground/30 p-4 text-sm text-muted-foreground">
              {t('challenge_selector_none')}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('challenge_selector_program')}</p>
                <p className="mt-2 text-sm font-semibold">{selectedEnrollment.program.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedEnrollment.program.organizerName || t('selector_value_missing')}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t('challenge_selector_phase')} {currentPhaseNumber}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('challenge_selector_rules')}</p>
                <div className="mt-2 grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>{t('challenge_selector_target')}</span>
                    <span className="font-semibold">{formatPct(currentRuleset?.profit_target_pct)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('challenge_selector_daily_loss')}</span>
                    <span className="font-semibold">{formatPct(currentRuleset?.max_daily_loss_pct)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('challenge_selector_max_dd')}</span>
                    <span className="font-semibold">{formatPct(currentRuleset?.max_drawdown_pct)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t('challenge_selector_min_days')}</span>
                    <span>{currentRuleset?.min_trading_days ?? t('selector_value_missing')}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('challenge_selector_state')}</p>
                {loadingContext ? (
                  <p className="mt-2 text-sm text-muted-foreground">{t('challenge_selector_loading_context')}</p>
                ) : (
                  <div className="mt-2 grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>{t('challenge_selector_profit_progress')}</span>
                      <span className="font-semibold">
                        {myChallenge?.account_state?.profit_progress_pct != null
                          ? `${myChallenge.account_state.profit_progress_pct.toFixed(1)}%`
                          : t('selector_value_missing')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('challenge_selector_dd_used')}</span>
                      <span className="font-semibold">
                        {myChallenge?.account_state?.max_dd_used_pct != null
                          ? `${myChallenge.account_state.max_dd_used_pct.toFixed(1)}%`
                          : t('selector_value_missing')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('challenge_selector_daily_used')}</span>
                      <span className="font-semibold">
                        {myChallenge?.account_state?.daily_loss_used_pct_today != null
                          ? `${myChallenge.account_state.daily_loss_used_pct_today.toFixed(1)}%`
                          : t('selector_value_missing')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('challenge_selector_open_positions')}</span>
                      <span className="font-semibold">
                        {openPositions.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Signal Generator Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('generator_title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('generator_description')}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                {t('feature_multi_indicator')}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('feature_multi_indicator_description')}
              </p>
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
              <h3 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                {t('feature_confidence')}
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                {t('feature_confidence_description')}
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
              <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                {t('feature_risk_reward')}
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                {t('feature_risk_reward_description')}
              </p>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/30">
              <h3 className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
                {t('feature_realtime')}
              </h3>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {t('feature_realtime_description')}
              </p>
            </div>
          </div>
        </div>

        {/* Active Signals Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('active_signals_title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('active_signals_description')}
          </p>

          <div className="space-y-4">
            {/* Empty state placeholder */}
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
              <p className="text-muted-foreground">
                {t('no_active_signals')}
              </p>
            </div>
          </div>
        </div>

        {/* Supported Indicators */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
          <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
            {t('indicators_title')}
          </h3>
          <ul className="space-y-1 text-sm text-slate-800 dark:text-slate-200">
            <li>{t('indicator_rsi')}</li>
            <li>{t('indicator_macd')}</li>
            <li>{t('indicator_ema')}</li>
            <li>{t('indicator_bollinger')}</li>
            <li>{t('indicator_volume')}</li>
          </ul>
        </div>

        {/* Coming Soon Notice */}
        <div className="rounded border border-orange-200 bg-orange-50 p-4 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
          {t('in_development')}
        </div>
      </div>
    </div>
  );
}
