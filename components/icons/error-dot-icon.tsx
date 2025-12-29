import { cn } from "@/lib/utils";

interface ErrorDotIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function ErrorDotIcon({ className, ...props }: ErrorDotIconProps) {
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
        className="fill-muted-foreground/10 stroke-muted-foreground/30"
        strokeWidth="0.5"
      />
      {/* Cerchio interno principale */}
      <circle
        cx="8"
        cy="8"
        r="5"
        className="fill-muted-foreground/20"
      />
      {/* Punto centrale raffinato */}
      <circle
        cx="8"
        cy="8"
        r="2.5"
        className="fill-muted-foreground"
      />
      {/* Highlight per effetto 3D */}
      <circle
        cx="7.2"
        cy="6.8"
        r="0.8"
        className="fill-muted-foreground/40"
      />
    </svg>
  );
}