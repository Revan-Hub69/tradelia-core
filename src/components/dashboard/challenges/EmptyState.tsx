/**
 * EMPTY STATE COMPONENT - Challenge Library 2026
 *
 * Professional empty states with SVG illustrations (NO EMOJI)
 * Following best practices from:
 * - Nielsen Norman Group: Empty State UX
 * - Material Design 3: Empty states
 * - Shopify Polaris: Empty state patterns
 */

import { useTranslations } from 'next-intl';

type EmptyStateType = 'no-programs' | 'no-results' | 'error';

type EmptyStateProps = {
  type: EmptyStateType;
  onAction?: () => void;
};

// SVG Illustrations - Professional, brand-aligned
const NoResultsIllustration = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    {/* Magnifying glass */}
    <circle
      cx="80"
      cy="80"
      r="40"
      stroke="currentColor"
      strokeWidth="4"
      className="text-muted-foreground/30"
    />
    <line
      x1="110"
      y1="110"
      x2="140"
      y2="140"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className="text-muted-foreground/30"
    />
    {/* X mark inside */}
    <line
      x1="65"
      y1="65"
      x2="95"
      y2="95"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="text-muted-foreground/50"
    />
    <line
      x1="95"
      y1="65"
      x2="65"
      y2="95"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="text-muted-foreground/50"
    />
  </svg>
);

const EmptyLibraryIllustration = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    {/* Empty folder */}
    <path
      d="M40 60 L80 60 L90 50 L160 50 L160 150 L40 150 Z"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      className="text-muted-foreground/30"
    />
    <line
      x1="40"
      y1="70"
      x2="160"
      y2="70"
      stroke="currentColor"
      strokeWidth="4"
      className="text-muted-foreground/30"
    />
    {/* Dashed lines indicating empty */}
    <line
      x1="70"
      y1="100"
      x2="130"
      y2="100"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="5,5"
      className="text-muted-foreground/20"
    />
    <line
      x1="70"
      y1="120"
      x2="130"
      y2="120"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="5,5"
      className="text-muted-foreground/20"
    />
  </svg>
);

const ErrorIllustration = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    {/* Warning triangle */}
    <path
      d="M100 40 L160 150 L40 150 Z"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      className="text-red-500/30"
    />
    {/* Exclamation mark */}
    <line
      x1="100"
      y1="80"
      x2="100"
      y2="120"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className="text-red-500/50"
    />
    <circle cx="100" cy="135" r="3" fill="currentColor" className="text-red-500/50" />
  </svg>
);

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const t = useTranslations('Challenges.emptyStates');

  const config = {
    'no-programs': {
      illustration: <EmptyLibraryIllustration />,
      title: t('noPrograms.title'),
      description: t('noPrograms.description'),
      actionLabel: t('noPrograms.action'),
      actionVariant: 'primary' as const,
    },
    'no-results': {
      illustration: <NoResultsIllustration />,
      title: t('noResults.title'),
      description: t('noResults.description'),
      actionLabel: t('noResults.action'),
      actionVariant: 'secondary' as const,
    },
    'error': {
      illustration: <ErrorIllustration />,
      title: t('error.title'),
      description: t('error.description'),
      actionLabel: t('error.action'),
      actionVariant: 'destructive' as const,
    },
  };

  const { illustration, title, description, actionLabel, actionVariant } = config[type];

  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-[32px] border border-dashed border-border bg-muted/20 p-12">
      <div className="max-w-md text-center">
        {/* Illustration */}
        <div className="mb-6">{illustration}</div>

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold tracking-tight">{title}</h2>

        {/* Description */}
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>

        {/* Action Button */}
        {onAction && (
          <button
            onClick={onAction}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
              actionVariant === 'primary'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
                : actionVariant === 'destructive'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/20 hover:bg-red-700'
                  : 'border border-border bg-background hover:bg-muted'
            }`}
            type="button"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
