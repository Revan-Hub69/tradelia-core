import { cn } from "@/lib/utils";

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CheckIcon({ className, ...props }: CheckIconProps) {
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
        className="fill-primary/10 stroke-primary"
        strokeWidth="2"
      />
      <path
        d="M8 12l2.5 2.5L16 9"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
