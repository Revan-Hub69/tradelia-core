import { cn } from "@/lib/utils";

interface MicrostructureIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function MicrostructureIcon({ className, ...props }: MicrostructureIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-12 w-12", className)}
      {...props}
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8 9h2m4 0h2M6 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}
