import { cn } from "@/lib/utils";

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function LogoIcon({ className, ...props }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      {/* Outer circle */}
      <circle
        cx="16"
        cy="16"
        r="15"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Inner geometric shape representing data/analytics */}
      <path
        d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Central dot representing insight/knowledge */}
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}
