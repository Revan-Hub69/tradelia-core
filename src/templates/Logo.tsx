import { AppConfig } from '@/utils/AppConfig';

type LogoProps = {
  isTextHidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Tradelia Logo - Minimal Fintech Style
 *
 * Ispirato a: Stripe, PayPal, Revolut
 * Principi: Restraint, clarity, system-aware
 * Solo tipografia + simbolo geometrico minimo
 */
export const Logo = ({ isTextHidden = false, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { icon: 'size-5', text: 'text-base', gap: 'gap-1.5' },
    md: { icon: 'size-6', text: 'text-lg', gap: 'gap-2' },
    lg: { icon: 'size-7', text: 'text-xl', gap: 'gap-2' },
  };

  const { icon, text, gap } = sizes[size];

  return (
    <div className={`flex items-center ${gap}`}>
      {/* Simbolo: T stilizzata con barra ascendente - crescita */}
      <svg
        className={icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tradelia"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="4"
          className="fill-primary"
        />
        <path
          d="M7 8h10M12 8v9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-primary-foreground"
        />
        <path
          d="M16 11l-4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-accent"
        />
      </svg>

      {!isTextHidden && (
        <span className={`font-semibold tracking-tight text-foreground ${text}`}>
          {AppConfig.name}
        </span>
      )}
    </div>
  );
};

/**
 * Logo Icon Only - per favicon, app icon
 */
export const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Tradelia"
  >
    <rect width="32" height="32" rx="6" fill="#1D4ED8" />
    <path
      d="M8 10h16M16 10v14"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M22 14l-6-5"
      stroke="#059669"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
