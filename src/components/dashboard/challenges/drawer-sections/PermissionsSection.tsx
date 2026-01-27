/**
 * PERMISSIONS SECTION - Program Drawer
 * Enterprise component 2026 - NO EMOJI
 */

import { useTranslations } from 'next-intl';

import { cn } from '@/utils/Helpers';

import { BotIcon, CheckCircleIcon, NewsIcon, WeekendIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

type Ruleset = {
  ea_allowed?: boolean;
  news_trading?: boolean;
  weekend_holding?: boolean;
  max_position_size?: number | null;
  max_open_positions?: number | null;
};

type PermissionsSectionProps = {
  phase1Rules: Ruleset | undefined;
};

export function PermissionsSection({ phase1Rules }: PermissionsSectionProps) {
  const t = useTranslations('Challenges') as any;

  if (!phase1Rules) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        icon={<CheckCircleIcon size={20} />}
        title={t('permissions.title')}
        iconColor="purple"
      />

      <div className="space-y-3">
        {/* EA/Bot Allowed */}
        <div
          className={cn(
            'flex items-center justify-between rounded-xl border p-4',
            phase1Rules.ea_allowed
              ? 'border-green-500/20 bg-green-500/5'
              : 'border-red-500/20 bg-red-500/5',
          )}
        >
          <div className="flex items-center gap-2">
            <BotIcon
              size={20}
              className={
                phase1Rules.ea_allowed
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            />
            <span className="font-medium">{t('permissions.eaBot')}</span>
          </div>
          <span
            className={cn(
              'text-sm font-bold',
              phase1Rules.ea_allowed
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            )}
          >
            {phase1Rules.ea_allowed ? t('permissions.allowed') : t('permissions.notAllowed')}
          </span>
        </div>

        {/* News Trading */}
        <div
          className={cn(
            'flex items-center justify-between rounded-xl border p-4',
            phase1Rules.news_trading
              ? 'border-green-500/20 bg-green-500/5'
              : 'border-red-500/20 bg-red-500/5',
          )}
        >
          <div className="flex items-center gap-2">
            <NewsIcon
              size={20}
              className={
                phase1Rules.news_trading
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            />
            <span className="font-medium">{t('permissions.newsTrading')}</span>
          </div>
          <span
            className={cn(
              'text-sm font-bold',
              phase1Rules.news_trading
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            )}
          >
            {phase1Rules.news_trading ? t('permissions.allowed') : t('permissions.notAllowed')}
          </span>
        </div>

        {/* Weekend Holding */}
        <div
          className={cn(
            'flex items-center justify-between rounded-xl border p-4',
            phase1Rules.weekend_holding
              ? 'border-green-500/20 bg-green-500/5'
              : 'border-red-500/20 bg-red-500/5',
          )}
        >
          <div className="flex items-center gap-2">
            <WeekendIcon
              size={20}
              className={
                phase1Rules.weekend_holding
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            />
            <span className="font-medium">{t('permissions.weekendHolding')}</span>
          </div>
          <span
            className={cn(
              'text-sm font-bold',
              phase1Rules.weekend_holding
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            )}
          >
            {phase1Rules.weekend_holding ? t('permissions.allowed') : t('permissions.notAllowed')}
          </span>
        </div>

        {/* Position Limits */}
        {(phase1Rules.max_position_size || phase1Rules.max_open_positions) && (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-3 font-medium">{t('permissions.positionLimits')}</div>
            <ul className="space-y-2 text-sm">
              {phase1Rules.max_position_size && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>
                    <strong>
{t('permissions.maxPositionSize')}
:
                    </strong>
                    {' '}
                    {phase1Rules.max_position_size}
                    {' '}
                    {t('permissions.lots')}
                  </span>
                </li>
              )}
              {phase1Rules.max_open_positions && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>
                    <strong>
{t('permissions.maxOpenPositions')}
:
                    </strong>
                    {' '}
                    {phase1Rules.max_open_positions}
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
