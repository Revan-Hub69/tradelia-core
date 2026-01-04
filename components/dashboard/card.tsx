import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  loading?: boolean;
}

export function Card({ title, subtitle, children, className = "", actions, loading }: CardProps) {
  return (
    <div className={`bg-card rounded border border-border/50 card-interactive ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-5 py-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              {title && <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{title}</h3>}
              {subtitle && <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center space-x-2 ml-4 flex-shrink-0">{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-5">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}

export function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
  const changeColors = {
    positive: "text-status-ok bg-status-ok/10 border-status-ok/30",
    negative: "text-status-risk bg-status-risk/10 border-status-risk/30",
    neutral: "text-muted-foreground bg-muted/30 border-border/50"
  };

  return (
    <Card className="card-interactive">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-2 truncate">{value}</p>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-2 border ${changeColors[changeType]}`}>
              {changeType === "positive" && "↗"}
              {changeType === "negative" && "↘"}
              {changeType === "neutral" && "→"}
              <span className="ml-1 truncate">{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-muted/30 rounded flex items-center justify-center ml-4 flex-shrink-0 border border-border/50">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}