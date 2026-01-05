import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 32 32" 
        fill="none"
        className="text-primary"
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
      <span className="font-semibold">Tradelia</span>
    </Link>
  );
}