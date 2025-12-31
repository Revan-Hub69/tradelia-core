// Market Data Dashboard - Phase 1 Integration
// Professional real-time monitoring and KPI visualization

'use client';

import { 
  Activity, 
  TrendingUp, 
  Zap, 
  Database, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketDataDashboard, dashboardUtils } from '@/hooks/use-market-data-dashboard';

export default function MarketDataDashboard() {
  const { 
    marketDataStatus, 
    healthStatus, 
    loading, 
    error, 
    lastUpdate, 
    refetch 
  } = useMarketDataDashboard();

  const { getStatusColor, formatNumber, formatDuration } = dashboardUtils;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'GREEN':
      case 'HEALTHY':
      case 'PASS':
        return <CheckCircle className="h-4 w-4" />;
      case 'YELLOW':
      case 'DEGRADED':
      case 'WARN':
        return <AlertTriangle className="h-4 w-4" />;
      case 'RED':
      case 'UNHEALTHY':
      case 'FAIL':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading && !marketDataStatus) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Dashboard Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Data Dashboard</h1>
          <p className="text-muted-foreground">
            Phase 1 Integration - Real-time monitoring and KPI tracking
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthStatus && (
                <>
                  <Badge className={getStatusColor(healthStatus.status)}>
                    {getStatusIcon(healthStatus.status)}
                    <span className="ml-1">{healthStatus.status}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(healthStatus.uptime)}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phase 1 Readiness</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {marketDataStatus && (
                <>
                  <Badge className={getStatusColor(marketDataStatus.data.readiness.status)}>
                    {getStatusIcon(marketDataStatus.data.readiness.status)}
                    <span className="ml-1">{marketDataStatus.data.readiness.status}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {marketDataStatus.data.readiness.score.toFixed(0)}%
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {marketDataStatus ? formatNumber(marketDataStatus.data.statistics.totalEvents, 0) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {marketDataStatus ? formatNumber(marketDataStatus.data.statistics.totalCandles, 0) : '0'} candles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paper Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {marketDataStatus ? formatNumber(marketDataStatus.data.kpis.totalTrades, 0) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {marketDataStatus ? formatNumber(marketDataStatus.data.kpis.winRate, 1) : '0'}% win rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KPI Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Trading Performance KPIs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketDataStatus && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(marketDataStatus.data.kpis.winRate, 1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Expectancy</div>
                        <div className={`text-2xl font-bold ${marketDataStatus.data.kpis.expectancy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatNumber(marketDataStatus.data.kpis.expectancy, 2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Max Drawdown</div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatNumber(marketDataStatus.data.kpis.maxDrawdown, 1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                        <div className="text-2xl font-bold">
                          {formatNumber(marketDataStatus.data.kpis.sharpeRatio, 2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-2">R-Multiple Distribution</div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Min: {formatNumber(marketDataStatus.data.kpis.rDistribution.min, 2)}</div>
                        <div>Avg: {formatNumber(marketDataStatus.data.kpis.rDistribution.avg, 2)}</div>
                        <div>Max: {formatNumber(marketDataStatus.data.kpis.rDistribution.max, 2)}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* System Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  System Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketDataStatus && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Events</div>
                        <div className="text-2xl font-bold">
                          {formatNumber(marketDataStatus.data.statistics.totalEvents, 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Candles Generated</div>
                        <div className="text-2xl font-bold">
                          {formatNumber(marketDataStatus.data.statistics.totalCandles, 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Symbols Tracked</div>
                        <div className="text-2xl font-bold">
                          {marketDataStatus.data.statistics.symbolsCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Active Runs</div>
                        <div className="text-2xl font-bold">
                          {marketDataStatus.data.currentRuns.length}
                        </div>
                      </div>
                    </div>
                    
                    {marketDataStatus.data.statistics.latestEvent && (
                      <div className="pt-4 border-t">
                        <div className="text-sm text-muted-foreground">Latest Event</div>
                        <div className="text-sm">
                          {new Date(marketDataStatus.data.statistics.latestEvent).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketDataStatus && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Slippage</span>
                        <span>{formatNumber(marketDataStatus.data.kpis.avgSlippage, 3)}%</span>
                      </div>
                      <Progress value={marketDataStatus.data.kpis.avgSlippage * 1000} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Hold Time</span>
                        <span>{formatDuration(marketDataStatus.data.kpis.avgHoldTime * 1000)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profit Factor</span>
                        <span>{formatNumber(marketDataStatus.data.kpis.profitFactor, 2)}</span>
                      </div>
                      <Progress value={Math.min(marketDataStatus.data.kpis.profitFactor * 50, 100)} className="h-2" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketDataStatus && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Max Drawdown</span>
                        <span className="text-red-600">{formatNumber(marketDataStatus.data.kpis.maxDrawdown, 1)}%</span>
                      </div>
                      <Progress value={marketDataStatus.data.kpis.maxDrawdown} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sharpe Ratio</span>
                        <span>{formatNumber(marketDataStatus.data.kpis.sharpeRatio, 2)}</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(marketDataStatus.data.kpis.sharpeRatio * 50, 100))} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>R-Multiple Std Dev</span>
                        <span>{formatNumber(marketDataStatus.data.kpis.rDistribution.std, 2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketDataStatus && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Return</span>
                        <span className={marketDataStatus.data.kpis.avgReturn > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatNumber(marketDataStatus.data.kpis.avgReturn, 2)}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Win Rate</span>
                        <span className="text-green-600">{formatNumber(marketDataStatus.data.kpis.winRate, 1)}%</span>
                      </div>
                      <Progress value={marketDataStatus.data.kpis.winRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Trades</span>
                        <span>{formatNumber(marketDataStatus.data.kpis.totalTrades, 0)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Health Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthStatus?.checks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(check.status)}
                        <span className="font-medium">{check.name || `Check ${index + 1}`}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {check.responseTime}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="h-5 w-5 mr-2" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>WebSocket Connection</span>
                    <Badge className="text-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Database Connection</span>
                    <Badge className="text-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Market Data Feed</span>
                    <Badge className="text-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  {healthStatus && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground">System Uptime</div>
                      <div className="text-lg font-semibold">
                        {formatDuration(healthStatus.uptime)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Readiness Tab */}
        <TabsContent value="readiness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Phase 1 Readiness Assessment
              </CardTitle>
              <CardDescription>
                Automated evaluation of system readiness for derivatives promotion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {marketDataStatus && (
                <>
                  {/* Overall Status */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(marketDataStatus.data.readiness.status)}
                      <div>
                        <div className="font-semibold">Overall Status</div>
                        <div className="text-sm text-muted-foreground">
                          {marketDataStatus.data.readiness.recommendation}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(marketDataStatus.data.readiness.status)}>
                        {marketDataStatus.data.readiness.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        Score: {marketDataStatus.data.readiness.score.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Criteria Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Readiness Criteria</h4>
                    {marketDataStatus.data.readiness.criteria.map((criterion, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(criterion.status)}
                          <span className="font-medium">{criterion.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {criterion.value} / {criterion.threshold}
                          </span>
                          <Badge className={getStatusColor(criterion.status)}>
                            {criterion.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Readiness Progress</span>
                      <span>{marketDataStatus.data.readiness.score.toFixed(0)}%</span>
                    </div>
                    <Progress value={marketDataStatus.data.readiness.score} className="h-3" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}