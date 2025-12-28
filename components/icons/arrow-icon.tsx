import { cn } from "@/lib/utils";

interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function ArrowIcon({ className, ...props }: ArrowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        className="stroke-current"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
