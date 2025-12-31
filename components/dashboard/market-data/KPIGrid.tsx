// KPI Grid Component - Market Data Dashboard
// Grid layout for displaying key performance indicators

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { dashboardUtils } from '@/hooks/use-market-data-dashboard';

interface KPIData {
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  expectancy: number;
  maxDrawdown: number;
  sharpeRatio: number;
  rDistribution: {
    min: number;
    max: number;
    avg: number;
    std: number;
  };
  avgSlippage: number;
  avgHoldTime: number;
  profitFactor: number;
}

interface KPIGridProps {
  kpis: KPIData;
}

export function KPIGrid({ kpis }: KPIGridProps) {
  const kpiItems = [
    {
      title: 'Win Rate',
      value: dashboardUtils.formatPercentage(kpis.winRate),
      progress: kpis.winRate,
      color: kpis.winRate >= 50 ? 'text-green-600' : 'text-yellow-600',
      icon: TrendingUp,
    },
    {
      title: 'Expectancy',
      value: dashboardUtils.formatPercentage(kpis.expectancy, 2),
      progress: Math.max(0, Math.min(100, kpis.expectancy + 50)),
      color: kpis.expectancy > 0 ? 'text-green-600' : 'text-red-600',
      icon: BarChart3,
    },
    {
      title: 'Max Drawdown',
      value: dashboardUtils.formatPercentage(kpis.maxDrawdown),
      progress: kpis.maxDrawdown,
      color: kpis.maxDrawdown <= 10 ? 'text-green-600' : kpis.maxDrawdown <= 20 ? 'text-yellow-600' : 'text-red-600',
      icon: TrendingDown,
    },
    {
      title: 'Sharpe Ratio',
      value: dashboardUtils.formatNumber(kpis.sharpeRatio, 2),
      progress: Math.max(0, Math.min(100, kpis.sharpeRatio * 50)),
      color: kpis.sharpeRatio >= 1 ? 'text-green-600' : kpis.sharpeRatio >= 0.5 ? 'text-yellow-600' : 'text-red-600',
      icon: BarChart3,
    },
    {
      title: 'Profit Factor',
      value: dashboardUtils.formatNumber(kpis.profitFactor, 2),
      progress: Math.min(100, kpis.profitFactor * 50),
      color: kpis.profitFactor >= 1.5 ? 'text-green-600' : kpis.profitFactor >= 1 ? 'text-yellow-600' : 'text-red-600',
      icon: TrendingUp,
    },
    {
      title: 'Avg Slippage',
      value: dashboardUtils.formatPercentage(kpis.avgSlippage, 3),
      progress: kpis.avgSlippage * 1000,
      color: kpis.avgSlippage <= 0.1 ? 'text-green-600' : kpis.avgSlippage <= 0.2 ? 'text-yellow-600' : 'text-red-600',
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="mt-2">
              <Progress value={item.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Additional KPI summary component
export function KPISummary({ kpis }: KPIGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
            <div className="text-2xl font-bold">
              {dashboardUtils.formatNumber(kpis.totalTrades, 0)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Average Return</div>
            <div className={`text-2xl font-bold ${kpis.avgReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dashboardUtils.formatPercentage(kpis.avgReturn, 2)}
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">R-Multiple Distribution</div>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Min</div>
              <div className="font-medium">{dashboardUtils.formatNumber(kpis.rDistribution.min, 2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg</div>
              <div className="font-medium">{dashboardUtils.formatNumber(kpis.rDistribution.avg, 2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Max</div>
              <div className="font-medium">{dashboardUtils.formatNumber(kpis.rDistribution.max, 2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Std</div>
              <div className="font-medium">{dashboardUtils.formatNumber(kpis.rDistribution.std, 2)}</div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average Hold Time</span>
            <span className="font-medium">
              {dashboardUtils.formatDuration(kpis.avgHoldTime * 1000)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}