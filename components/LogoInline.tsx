interface LogoInlineProps {
  className?: string;
}

export default function LogoInline({ className = "" }: LogoInlineProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 32 32" 
        fill="none"
        className="text-primary flex-shrink-0"
      >
        <circle 
          cx="16" 
          cy="16" 
          r="15" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
        />
        <path 
          d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
          fill="none"
        />
        <circle 
          cx="16" 
          cy="16" 
          r="2" 
          fill="currentColor"
        />
      </svg>
      <span className="font-semibold">
        <span className="text-muted-foreground">T</span><span className="text-foreground">radelia</span>
      </span>
    </span>
  );
}