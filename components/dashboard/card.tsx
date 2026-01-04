import { ReactNode } from "react";

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
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              {title && <h3 className="text-lg font-semibold text-slate-900 truncate">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-500 mt-1 truncate">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center space-x-2 ml-4 flex-shrink-0">{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
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
    positive: "text-emerald-700 bg-emerald-50 border-emerald-200",
    negative: "text-red-700 bg-red-50 border-red-200",
    neutral: "text-slate-700 bg-slate-50 border-slate-200"
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-600 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2 truncate">{value}</p>
          {change && (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 border ${changeColors[changeType]}`}>
              {changeType === "positive" && "↗"}
              {changeType === "negative" && "↘"}
              {changeType === "neutral" && "→"}
              <span className="ml-1 truncate">{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center ml-4 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}