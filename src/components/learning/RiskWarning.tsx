import * as React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/utils/Helpers';

export type RiskWarningProps = {
  title?: string;
  description: string;
  onAcknowledge?: () => void;
  acknowledgeText?: string;
  variant?: 'warning' | 'info';
  className?: string;
};

export function RiskWarning({
  title = 'Contenuto Avanzato',
  description,
  onAcknowledge,
  acknowledgeText = 'Ho compreso, continua',
  variant = 'warning',
  className,
}: RiskWarningProps) {
  return (
    <Alert variant={variant} className={cn('', className)}>
      <AlertTitle className="flex items-center gap-2">
        {variant === 'warning' ? '⚠️' : 'ℹ️'}
        {' '}
        {title}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p>{description}</p>
        {onAcknowledge && (
          <button
            type="button"
            onClick={onAcknowledge}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'mt-3',
            )}
          >
            {acknowledgeText}
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Disclaimer educativo standard - da usare in ogni path
export function EducationalDisclaimer({ className }: { className?: string }) {
  return (
    <Alert variant="info" className={cn('', className)}>
      <AlertDescription className="flex items-start gap-2">
        <span>📚</span>
        <span>
          Contenuto educativo. Non costituisce consulenza finanziaria o invito all&apos;investimento.
        </span>
      </AlertDescription>
    </Alert>
  );
}
