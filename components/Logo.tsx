import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-all duration-300 group">
      <div className="relative">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 32 32" 
          fill="none"
          className="text-primary transition-all duration-300 group-hover:scale-110"
        >
          <circle 
            cx="16" 
            cy="16" 
            r="15" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none"
            className="transition-all duration-300"
          />
          <path 
            d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
            fill="none"
            className="transition-all duration-300"
          />
          <circle 
            cx="16" 
            cy="16" 
            r="2" 
            fill="currentColor"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
      </div>
      <span className="font-semibold transition-all duration-300 group-hover:text-primary relative">
        Tradelia
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  );
}