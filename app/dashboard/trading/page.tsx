// Trading Dashboard - Operational Interface
// Unified view: Market Context + Universe + Setup Analysis

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface MarketRegime {
  trend: 'bull' | 'bear' | 'range';
  volatility: 'low' | 'normal' | 'high';
  confidence: number;
  asOf: string;
}

interface UniverseSymbol {
  symbol: string;
  rank: number;
  score: number;
  reasons: string[];
}

interface SetupAnalysis {
  symbol: string;
  fit: 'A' | 'B' | 'C' | 'NO_TRADE';
  confidence: number;
  reasons: string[];
  recommendation: 'TRADE' | 'MONITOR' | 'AVOID';
}

export default function TradingDashboard() {
  const [marketRegime, setMarketRegime] = useState<MarketRegime | null>(null);
  const [universe, setUniverse] = useState<UniverseSymbol[]>([]);
  const [setups, setSetups] = useState<SetupAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch market regime
      const regimeResponse = await fetch('/api/regime/current');
      if (regimeResponse.ok) {
        const regimeData = await regimeResponse.json();
        if (regimeData.ok && regimeData.data?.signature) {
          setMarketRegime({
            trend: regimeData.data.signature.trend || 'range',
            volatility: regimeData.data.signature.volatility || 'normal',
            confidence: regimeData.data.signature.confidence || 0.5,
            asOf: regimeData.data.signature.asOf || new Date().toISOString(),
          });
        }
      }

      // Fetch universe
      const universeResponse = await fetch('/api/universe/active');
      if (universeResponse.ok) {
        const universeData = await universeResponse.json();
        if (universeData.ok && universeData.data?.symbols) {
          setUniverse(universeData.data.symbols.slice(0, 10));
        }
      }

      // Fetch setup analysis
      const setupResponse = await fetch('/api/msf/current');
      if (setupResponse.ok) {
        const setupData = await setupResponse.json();
        if (setupData.ok && setupData.data?.marketFits) {
          // Transform MSF data to setup analysis format
          const setupAnalysis = setupData.data.marketFits.map((fit: any) => ({
            symbol: fit.symbol,
            fit: fit.fitClass,
            confidence: fit.dataQuality,
            reasons: fit.reasons || [],
            recommendation: fit.fitClass === 'A' ? 'TRADE' : 
                           fit.fitClass === 'B' ? 'MONITOR' : 'AVOID'
          }));
          setSetups(setupAnalysis);
        }
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getRegimeIcon = (trend: string) => {
    if (trend === 'bull') return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (trend === 'bear') return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Activity className="h-5 w-5 text-yellow-600" />;
  };

  const getRegimeColor = (trend: string) => {
    switch (trend) {
      case 'bull': return 'text-green-600 bg-green-50 border-green-200';
      case 'bear': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSetupColor = (recommendation: string) => {
    switch (recommendation) {
      case 'TRADE': return 'text-green-600 bg-green-50 border-green-200';
      case 'MONITOR': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'AVOID': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading && !marketRegime) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading trading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Trading Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Market Context → Universe Selection → Setup Analysis
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" disabled={loading} className="w-full sm:w-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Context Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Regime</CardTitle>
            {marketRegime && getRegimeIcon(marketRegime.trend)}
          </CardHeader>
          <CardContent>
            {marketRegime && (
              <div className="space-y-2">
                <Badge className={`${getRegimeColor(marketRegime.trend)} text-xs sm:text-sm`}>
                  {marketRegime.trend.toUpperCase()} / {marketRegime.volatility.toUpperCase()}
                </Badge>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Confidence: {(marketRegime.confidence * 100).toFixed(0)}%
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Universe</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{universe.length}</div>
            <p className="text-xs text-muted-foreground">
              symbols selected for analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trade Setups</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {setups.filter(s => s.recommendation === 'TRADE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              ready for trading
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="universe" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger value="universe" className="text-xs sm:text-sm">Universe</TabsTrigger>
          <TabsTrigger value="setups" className="text-xs sm:text-sm">Setups</TabsTrigger>
          <TabsTrigger value="context" className="text-xs sm:text-sm">Context</TabsTrigger>
        </TabsList>

        {/* Universe Tab */}
        <TabsContent value="universe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Universe</CardTitle>
              <CardDescription>
                Top-ranked symbols based on current market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {universe.map((symbol) => (
                  <div key={symbol.symbol} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-lg border">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        #{symbol.rank}
                      </div>
                      <div className="font-semibold">{symbol.symbol}</div>
                      <Badge variant="outline" className="w-fit">
                        Score: {symbol.score?.toFixed(2) || 'N/A'}
                      </Badge>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground break-words">
                      {symbol.reasons?.join(', ') || 'Selected for analysis'}
                    </div>
                  </div>
                ))}
                {universe.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No symbols in active universe
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Setups Tab */}
        <TabsContent value="setups" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Trade Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                  Ready to Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {setups.filter(s => s.recommendation === 'TRADE').map((setup) => (
                    <div key={setup.symbol} className="p-3 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="font-semibold text-sm sm:text-base">{setup.symbol}</div>
                        <Badge className="text-green-600 bg-green-100 w-fit">
                          {setup.fit}
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-green-700 mb-1">
                        Confidence: {(setup.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-green-600 break-words">
                        {setup.reasons.join(', ')}
                      </div>
                    </div>
                  ))}
                  {setups.filter(s => s.recommendation === 'TRADE').length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No trade setups available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Monitor List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
                  Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {setups.filter(s => s.recommendation === 'MONITOR').map((setup) => (
                    <div key={setup.symbol} className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="font-semibold text-sm sm:text-base">{setup.symbol}</div>
                        <Badge className="text-yellow-600 bg-yellow-100 w-fit">
                          {setup.fit}
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-yellow-700 mb-1">
                        Confidence: {(setup.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-yellow-600 break-words">
                        {setup.reasons.join(', ')}
                      </div>
                    </div>
                  ))}
                  {setups.filter(s => s.recommendation === 'MONITOR').length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No symbols to monitor
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Avoid List */}
          {setups.filter(s => s.recommendation === 'AVOID').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Avoid Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {setups.filter(s => s.recommendation === 'AVOID').map((setup) => (
                    <div key={setup.symbol} className="p-3 rounded-lg border border-red-200 bg-red-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="font-semibold text-sm sm:text-base">{setup.symbol}</div>
                        <Badge className="text-red-600 bg-red-100 w-fit">
                          {setup.fit}
                        </Badge>
                      </div>
                      <div className="text-xs text-red-600 break-words">
                        {setup.reasons.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Market Context Tab */}
        <TabsContent value="context" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Context Analysis</CardTitle>
              <CardDescription>
                Current market regime and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {marketRegime && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Trend Direction</div>
                      <div className="flex items-center space-x-2">
                        {getRegimeIcon(marketRegime.trend)}
                        <span className="font-semibold capitalize">{marketRegime.trend}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Volatility Level</div>
                      <Badge variant="outline" className="capitalize">
                        {marketRegime.volatility}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Confidence</div>
                      <div className="text-lg font-semibold">
                        {(marketRegime.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Last Update</div>
                      <div className="text-xs sm:text-sm break-words">
                        {new Date(marketRegime.asOf).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}