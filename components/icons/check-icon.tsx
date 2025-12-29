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
      {/* Cerchio esterno con gradiente sottile */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        className="fill-success/5 stroke-success/40"
        strokeWidth="1"
      />
      {/* Cerchio interno per profondità */}
      <circle
        cx="12"
        cy="12"
        r="8.5"
        className="fill-success/10"
      />
      {/* Spunta elegante con curve morbide */}
      <path
        d="M8.5 12.5L10.8 14.8L15.5 9.2"
        className="stroke-success"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Highlight sottile per effetto 3D */}
      <path
        d="M8.5 12.5L10.8 14.8L15.5 9.2"
        className="stroke-success/30"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
