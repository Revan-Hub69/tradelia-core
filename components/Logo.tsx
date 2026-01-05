import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group text-foreground transition-all duration-300 hover:scale-105">
      {/* Logo Icon - Premium geometric design */}
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-primary-500 to-primary-600 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-primary-foreground"
          >
            {/* Geometric T symbol */}
            <path 
              d="M3 4h18v3H13v13h-2V7H3V4z" 
              fill="currentColor"
              className="transition-all duration-300 group-hover:scale-110"
            />
            {/* Subtle accent line */}
            <path 
              d="M8 12h8v1H8v-1z" 
              fill="currentColor" 
              opacity="0.6"
              className="transition-all duration-300 group-hover:opacity-80"
            />
          </svg>
        </div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm -z-10" />
      </div>
      
      {/* Wordmark */}
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
          Tradelia
        </span>
        <span className="text-2xs font-medium uppercase tracking-widest text-muted-foreground opacity-75">
          2026
        </span>
      </div>
    </Link>
  );
}