import { cn } from "@/lib/utils";

interface WarningIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function WarningIcon({ className, ...props }: WarningIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path
        d="M12 2L2 20h20L12 2z"
        className="fill-amber-500/10 stroke-amber-600 dark:stroke-amber-400"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4M12 17h.01"
        className="stroke-amber-600 dark:stroke-amber-400"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
