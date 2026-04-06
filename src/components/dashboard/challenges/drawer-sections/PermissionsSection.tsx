/**
 * PERMISSIONS SECTION - Program Drawer
 * Enterprise component 2026
 * Palette: desaturated allowed/denied, single accent, SVG-only status indicators
 */

import { useTranslations } from 'next-intl';

import { cn } from '@/utils/Helpers';
import { BotIcon, NewsIcon, WeekendIcon } from '@/components/icons/unified';
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

// Inline SVG permission status icons — no emoji, no Unicode
const AllowedIcon = () => (
  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const DeniedIcon = () => (
  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// Custom SVG section header icon — shield with checkmark
const PermissionsHeaderIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

function PermissionRow({
  icon,
  label,
  allowed,
  allowedLabel,
  deniedLabel,
}: {
  icon: React.ReactNode;
  label: string;
  allowed: boolean;
  allowedLabel: string;
  deniedLabel: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors',
        allowed
          ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
          : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50',
      )}
    >
      <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={cn(
        'flex items-center gap-1.5 text-sm font-semibold',
        allowed
          ? 'text-[#1E7D4F] dark:text-[#5AB585]'
          : 'text-[#C0373A] dark:text-[#E07A7C]',
      )}>
        {allowed ? <AllowedIcon /> : <DeniedIcon />}
        <span>{allowed ? allowedLabel : deniedLabel}</span>
      </div>
    </div>
  );
}

export function PermissionsSection({ phase1Rules }: PermissionsSectionProps) {
  const t = useTranslations('Challenges') as any;

  if (!phase1Rules) return null;

  return (
    <section>
      <SectionHeader
        icon={<PermissionsHeaderIcon size={20} />}
        title={t('permissions.title')}
        iconColor="blue"
      />

      <div className="space-y-2">
        <PermissionRow
          icon={<BotIcon size={18} />}
          label={t('permissions.eaBot')}
          allowed={!!phase1Rules.ea_allowed}
          allowedLabel={t('permissions.allowed')}
          deniedLabel={t('permissions.notAllowed')}
        />
        <PermissionRow
          icon={<NewsIcon size={18} />}
          label={t('permissions.newsTrading')}
          allowed={!!phase1Rules.news_trading}
          allowedLabel={t('permissions.allowed')}
          deniedLabel={t('permissions.notAllowed')}
        />
        <PermissionRow
          icon={<WeekendIcon size={18} />}
          label={t('permissions.weekendHolding')}
          allowed={!!phase1Rules.weekend_holding}
          allowedLabel={t('permissions.allowed')}
          deniedLabel={t('permissions.notAllowed')}
        />
      </div>

      {(phase1Rules.max_position_size || phase1Rules.max_open_positions) && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('permissions.positionLimits')}
          </div>
          <ul className="space-y-2 text-sm">
            {phase1Rules.max_position_size && (
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="size-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span>
                  <strong className="text-slate-700 dark:text-slate-300">{t('permissions.maxPositionSize')}:</strong>
                  {' '}{phase1Rules.max_position_size} {t('permissions.lots')}
                </span>
              </li>
            )}
            {phase1Rules.max_open_positions && (
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="size-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span>
                  <strong className="text-slate-700 dark:text-slate-300">{t('permissions.maxOpenPositions')}:</strong>
                  {' '}{phase1Rules.max_open_positions}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
