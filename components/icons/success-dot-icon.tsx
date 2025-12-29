import { cn } from "@/lib/utils";

interface SuccessDotIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function SuccessDotIcon({ className, ...props }: SuccessDotIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      {/* Cerchio esterno con gradiente */}
      <circle
        cx="8"
        cy="8"
        r="7"
        className="fill-success/10 stroke-success/30"
        strokeWidth="0.5"
      />
      {/* Cerchio interno principale */}
      <circle
        cx="8"
        cy="8"
        r="5"
        className="fill-success/20"
      />
      {/* Punto centrale raffinato */}
      <circle
        cx="8"
        cy="8"
        r="2.5"
        className="fill-success"
      />
      {/* Highlight per effetto 3D */}
      <circle
        cx="7.2"
        cy="6.8"
        r="0.8"
        className="fill-success/40"
      />
    </svg>
  );
}