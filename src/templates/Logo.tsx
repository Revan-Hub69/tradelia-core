import { AppConfig } from '@/utils/AppConfig';

type LogoProps = {
  isTextHidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'mono';
};

/**
 * Tradelia Logo
 *
 * Concept: "Il Percorso Ascendente"
 * - Forma astratta che richiama una "T" stilizzata
 * - Tre blocchi ascendenti = progressione della conoscenza
 * - Geometria pulita = professionalità e fiducia
 * - Nessun simbolo crypto ovvio = educazione seria, non hype
 */
export const Logo = ({ isTextHidden = false, size = 'md', variant = 'default' }: LogoProps) => {
  const sizes = {
    sm: { icon: 'size-6', text: 'text-base', gap: 'gap-1.5' },
    md: { icon: 'size-8', text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 'size-10', text: 'text-2xl', gap: 'gap-2.5' },
  };

  const { icon, text, gap } = sizes[size];

  return (
    <div className={`flex items-center ${gap}`}>
      <svg
        className={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tradelia logo"
      >
        {/* Background circle - subtle, premium feel */}
        <circle
          cx="20"
          cy="20"
          r="19"
          className={variant === 'mono' ? 'fill-foreground/5' : 'fill-primary/10'}
        />

        {/* Block 1 - Foundation (shortest) */}
        <rect
          x="8"
          y="24"
          width="6"
          height="8"
          rx="1.5"
          className={variant === 'mono' ? 'fill-foreground' : 'fill-primary/60'}
        />

        {/* Block 2 - Growth (medium) */}
        <rect
          x="17"
          y="18"
          width="6"
          height="14"
          rx="1.5"
          className={variant === 'mono' ? 'fill-foreground' : 'fill-primary/80'}
        />

        {/* Block 3 - Mastery (tallest) */}
        <rect
          x="26"
          y="10"
          width="6"
          height="22"
          rx="1.5"
          className={variant === 'mono' ? 'fill-foreground' : 'fill-primary'}
        />

        {/* Connecting line - the learning path */}
        <path
          d="M11 22 L20 16 L29 8"
          className={variant === 'mono' ? 'stroke-foreground' : 'stroke-accent'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Accent dot at peak - achievement */}
        <circle
          cx="29"
          cy="8"
          r="2.5"
          className={variant === 'mono' ? 'fill-foreground' : 'fill-accent'}
        />
      </svg>

      {!isTextHidden && (
        <span className={`font-semibold tracking-tight ${text}`}>
          {AppConfig.name}
        </span>
      )}
    </div>
  );
};

/**
 * Logo Icon Only - per favicon, app icon, spazi ristretti
 */
export const LogoIcon = ({ size = 40, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Tradelia"
  >
    {/* Background */}
    <rect width="40" height="40" rx="8" fill="#0F172A" />

    {/* Three ascending blocks */}
    <rect x="8" y="24" width="6" height="8" rx="1.5" fill="#60A5FA" fillOpacity="0.6" />
    <rect x="17" y="18" width="6" height="14" rx="1.5" fill="#60A5FA" fillOpacity="0.8" />
    <rect x="26" y="10" width="6" height="22" rx="1.5" fill="#60A5FA" />

    {/* Connecting path */}
    <path d="M11 22 L20 16 L29 8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

    {/* Peak dot */}
    <circle cx="29" cy="8" r="2.5" fill="#059669" />
  </svg>
);
