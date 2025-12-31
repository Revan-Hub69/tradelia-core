// Status Card Component - Market Data Dashboard
// Reusable status display component

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { dashboardUtils } from '@/hooks/use-market-data-dashboard';

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  status: 'GREEN' | 'YELLOW' | 'RED' | 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';
  value: string | number;
  subtitle?: string;
  description?: string;
}

export function StatusCard({ 
  title, 
  icon: Icon, 
  status, 
  value, 
  subtitle, 
  description 
}: StatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Badge className={dashboardUtils.getStatusColor(status)}>
            {status}
          </Badge>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}