/**
 * COMPETITION RULES SECTION - Program Drawer
 * Enterprise component 2026 - Cognitive Communication Best Practices
 *
 * Design Principles:
 * - Progressive Disclosure: Most critical info first
 * - Chunking: 3-5 items per section max
 * - Visual Hierarchy: Clear scanning pattern
 * - Action-Oriented: Guide user to decision
 *
 * Research Sources:
 * - Nielsen: "How Users Read on the Web"
 * - Krug: "Don't Make Me Think"
 * - Sweller: Cognitive Load Theory
 */

import { useTranslations } from 'next-intl';
import React from 'react';

import { CheckCircleIcon, ClockIcon, InfoIcon, TrophyIcon, UsersIcon, WarningIcon } from '@/components/icons/unified';
import { SectionHeader } from './SectionHeader';

type CompetitionPeriod = {
  registrationStart: string;
  registrationEnd: string;
  tradingStart: string;
  tradingEnd: string;
};

type EligibilityRequirement = {
  type: 'age' | 'location' | 'account' | 'experience';
  description: string;
  met?: boolean;
};

type TradingRule = {
  category: 'instruments' | 'position_limits' | 'activity' | 'restrictions';
  title: string;
  description: string;
  highlight?: boolean;
};

type PrizeTier = {
  position: number;
  prize: string;
  value?: number;
  currency?: string;
};

type CompetitionRulesSectionProps = {
  // Essential Info (Priority 1)
  tagline?: string;
  prizePool: {
    total: number;
    currency: string;
    winnersCount: number;
  };

  // Timeline (Priority 2)
  period: CompetitionPeriod;

  // Eligibility (Priority 2)
  eligibility: {
    requirements: EligibilityRequirement[];
    restrictedCountries?: string[];
    minAge?: number;
  };

  // How to Win (Priority 3)
  winningCriteria: {
    method: 'profit_amount' | 'profit_percentage' | 'ranking' | 'consistency';
    description: string;
    minTradingDays?: number;
  };

  // Trading Rules (Priority 3)
  tradingRules: TradingRule[];

  // Prizes (Priority 3)
  prizeTiers: PrizeTier[];

  // Additional Info (Priority 4)
  additionalInfo?: {
    officialRulesUrl?: string;
    supportUrl?: string;
    faqUrl?: string;
  };
};

export const CompetitionRulesSection = React.memo(({
  tagline,
  prizePool,
  period,
  eligibility,
  winningCriteria,
  tradingRules,
  prizeTiers,
  additionalInfo,
}: CompetitionRulesSectionProps) => {
  const t = useTranslations('Challenges') as any;

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Group trading rules by category
  const rulesByCategory = tradingRules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category]!.push(rule);
    return acc;
  }, {} as Record<string, TradingRule[]>);

  return (
    <section className="space-y-6">
      {/* PRIORITY 1: The Hook - What & Why */}
      {tagline && (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-5">
          <p className="text-lg font-medium leading-relaxed text-foreground">
            {tagline}
          </p>
        </div>
      )}

      {/* Quick Stats - Decision Helper */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center">
          <div className="mb-1 text-2xl font-bold text-primary">
            {prizePool.currency}
{' '}
{prizePool.total.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('competitionRules.totalPrize')}
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center">
          <div className="mb-1 text-2xl font-bold text-green-600">
            {prizePool.winnersCount}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('competitionRules.winners')}
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center">
          <div className="mb-1 text-2xl font-bold text-amber-600">
            {winningCriteria.minTradingDays || 1}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('competitionRules.minDays')}
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center">
          <div className="mb-1 text-2xl font-bold text-purple-600">
            {t('competitionRules.free')}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('competitionRules.entry')}
          </div>
        </div>
      </div>

      {/* PRIORITY 2: Timeline - When */}
      <div>
        <SectionHeader
          icon={<ClockIcon size={20} />}
          title={t('competitionRules.timelineTitle')}
          iconColor="blue"
        />

        <div className="space-y-3">
          {/* Registration Period */}
          <div className="flex items-center gap-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
              <svg className="size-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium">{t('competitionRules.registration')}</div>
              <div className="text-sm text-muted-foreground">
                {formatDate(period.registrationStart)}
{' '}
→
{formatDate(period.registrationEnd)}
              </div>
            </div>
          </div>

          {/* Trading Period */}
          <div className="flex items-center gap-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-500/20">
              <svg className="size-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium">{t('competitionRules.trading')}</div>
              <div className="text-sm text-muted-foreground">
                {formatDate(period.tradingStart)}
{' '}
→
{formatDate(period.tradingEnd)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRIORITY 2: Eligibility - Can I Join? */}
      <div>
        <SectionHeader
          icon={<UsersIcon size={20} />}
          title={t('competitionRules.eligibilityTitle')}
          iconColor="green"
        />

        <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
          <ul className="space-y-2">
            {eligibility.requirements.slice(0, 5).map(req => (
              <li key={`${req.type}-${req.description}`} className="flex items-start gap-3">
                <CheckCircleIcon
                  size={18}
                  className={req.met ? 'text-green-600' : 'text-muted-foreground'}
                />
                <span className="text-sm">{req.description}</span>
              </li>
            ))}
          </ul>

          {eligibility.restrictedCountries && eligibility.restrictedCountries.length > 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-amber-500/10 p-3">
              <WarningIcon size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <div className="text-sm">
                <span className="font-medium">
{t('competitionRules.restrictions')}
:
                </span>
                {' '}
                {eligibility.restrictedCountries.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRIORITY 3: How to Win */}
      <div>
        <SectionHeader
          icon={<TrophyIcon size={20} />}
          title={t('competitionRules.howToWinTitle')}
          iconColor="amber"
        />

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="mb-4 text-sm leading-relaxed">{winningCriteria.description}</p>

          {winningCriteria.minTradingDays && (
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3">
              <InfoIcon size={18} className="text-amber-600" />
              <span className="text-sm">
                {t('competitionRules.minTradingDays', { days: winningCriteria.minTradingDays })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* PRIORITY 3: Trading Rules */}
      <div>
        <SectionHeader
          icon={<InfoIcon size={20} />}
          title={t('competitionRules.rulesTitle')}
          iconColor="purple"
        />

        <div className="space-y-4">
          {Object.entries(rulesByCategory).map(([category, rules]) => (
            <div key={category} className="rounded-xl border border-border/50 bg-muted/20 p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t(`competitionRules.category.${category}`)}
              </div>
              <ul className="space-y-2">
                {rules.slice(0, 5).map(rule => (
                  <li
                    key={`${rule.category}-${rule.title}-${rule.description}`}
                    className={`flex items-start gap-3 text-sm ${
                      rule.highlight ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{rule.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* PRIORITY 3: Prize Distribution */}
      <div>
        <SectionHeader
          icon={<TrophyIcon size={20} />}
          title={t('competitionRules.prizesTitle')}
          iconColor="amber"
        />

        <div className="space-y-2">
          {prizeTiers.slice(0, 5).map(tier => (
            <div
              key={tier.position}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg text-sm font-bold ${
                    tier.position === 1
                      ? 'bg-amber-500/20 text-amber-600'
                      : tier.position === 2
                        ? 'bg-gray-400/20 text-gray-600'
                        : tier.position === 3
                          ? 'bg-orange-500/20 text-orange-600'
                          : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tier.position}
                </div>
                <span className="text-sm font-medium">
                  {tier.position === 1
                    ? t('prizePool.firstPlace')
                    : tier.position === 2
                      ? t('prizePool.secondPlace')
                      : tier.position === 3
                        ? t('prizePool.thirdPlace')
                        : `${tier.position}° ${t('prizePool.place')}`}
                </span>
              </div>
              <div className="font-bold text-amber-600">
                {tier.prize}
              </div>
            </div>
          ))}

          {prizeTiers.length > 5 && (
            <div className="text-center text-sm text-muted-foreground">
              +
{prizeTiers.length - 5}
{' '}
{t('competitionRules.morePrizes')}
            </div>
          )}
        </div>
      </div>

      {/* PRIORITY 4: Additional Resources */}
      {additionalInfo && (
        <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
          <div className="mb-3 text-sm font-medium">
            {t('competitionRules.resources')}
          </div>
          <div className="flex flex-wrap gap-2">
            {additionalInfo.officialRulesUrl && (
              <a
                href={additionalInfo.officialRulesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-background px-3 py-2 text-sm text-primary hover:underline"
              >
                {t('competitionRules.officialRules')}
{' '}
→
              </a>
            )}
            {additionalInfo.faqUrl && (
              <a
                href={additionalInfo.faqUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-background px-3 py-2 text-sm text-primary hover:underline"
              >
                {t('competitionRules.faq')}
{' '}
→
              </a>
            )}
            {additionalInfo.supportUrl && (
              <a
                href={additionalInfo.supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-background px-3 py-2 text-sm text-primary hover:underline"
              >
                {t('competitionRules.support')}
{' '}
→
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
});

CompetitionRulesSection.displayName = 'CompetitionRulesSection';
