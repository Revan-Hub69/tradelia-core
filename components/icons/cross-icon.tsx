import { cn } from "@/lib/utils";

interface CrossIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CrossIcon({ className, ...props }: CrossIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className="fill-amber-500/10 stroke-amber-600 dark:stroke-amber-400"
        strokeWidth="2"
      />
      <path
        d="M9 9l6 6M15 9l-6 6"
        className="stroke-amber-600 dark:stroke-amber-400"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
