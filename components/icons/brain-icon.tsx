import { cn } from "@/lib/utils";

interface BrainIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function BrainIcon({ className, ...props }: BrainIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-12 w-12", className)}
      {...props}
    >
      <path
        d="M12 2C9.38 2 7.25 4.13 7.25 6.75c0 1.1.43 2.1 1.13 2.85L12 13.5l3.62-3.9c.7-.75 1.13-1.75 1.13-2.85C16.75 4.13 14.62 2 12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9c-.83 1.17-1.5 2.67-1.5 4.5 0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.83-.67-3.33-1.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}
