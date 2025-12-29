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
      {/* Triangolo esterno con gradiente sottile */}
      <path
        d="M12 2.5L22.5 20.5H1.5L12 2.5Z"
        className="fill-warning/5 stroke-warning/60"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Triangolo interno per profondità */}
      <path
        d="M12 5L19.5 18.5H4.5L12 5Z"
        className="fill-warning/10"
      />
      {/* Linea di avvertimento - più elegante */}
      <path
        d="M12 8.5V13.5"
        className="stroke-warning"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Punto finale - più raffinato */}
      <circle
        cx="12"
        cy="16"
        r="1.2"
        className="fill-warning"
      />
    </svg>
  );
}
