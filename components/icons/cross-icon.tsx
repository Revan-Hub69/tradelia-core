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
      {/* Cerchio esterno con gradiente sottile */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        className="fill-error/5 stroke-error/40"
        strokeWidth="1"
      />
      {/* Cerchio interno per profondità */}
      <circle
        cx="12"
        cy="12"
        r="8.5"
        className="fill-error/10"
      />
      {/* X elegante con curve morbide */}
      <path
        d="M9.2 9.2L14.8 14.8M14.8 9.2L9.2 14.8"
        className="stroke-error"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Highlight sottile per effetto 3D */}
      <path
        d="M9.2 9.2L14.8 14.8M14.8 9.2L9.2 14.8"
        className="stroke-error/30"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
