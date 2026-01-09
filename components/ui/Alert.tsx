'use client';

import { CheckIcon, AlertTriangleIcon } from '@/components/icons/TradeliaIcons';

interface AlertProps {
  variant: 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant, title, children, className = '' }: AlertProps) {
  const Icon = variant === 'success' ? CheckIcon : AlertTriangleIcon;
  
  return (
    <div 
      className={`alert-${variant} ${className}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 alert-${variant}-icon flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`text-sm font-medium alert-${variant}-text`}>{title}</p>
          )}
          <div className={`text-sm alert-${variant}-text ${title ? 'mt-1' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline error text for form fields
export function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-error" role="alert">
      {children}
    </p>
  );
}
