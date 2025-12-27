import { cn } from "@/lib/utils";

interface EconomicsIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function EconomicsIcon({ className, ...props }: EconomicsIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-12 w-12", className)}
      {...props}
    >
      <path
        d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 3H5a2 2 0 0 0-2 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14l4-4 4 4M12 10v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}
