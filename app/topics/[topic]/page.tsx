import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, BookOpen, ArrowRight, Target, BarChart3, Globe, DollarSign } from 'lucide-react';

interface TopicData {
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  keyPoints: string[];
  strategies: {
    name: string;
    description: string;
    timeframe: string;
    risk: string;
    capital: string;
  }[];
  tools: string[];
  learning: {
    phase: string;
    activities: string[];
  }[];
}

// Mock data - in a real app this would come from a database or API
const topicsData: Record<string, TopicData> = {
  macroeconomics: {
    title: 'Macroeconomics',
    description: 'Understand how economic indicators influence financial markets and develop strategies around economic events and cycles.',
    icon: DollarSign,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    keyPoints: [
      'GDP growth rates signal market direction',
      'Inflation data impacts interest rate expectations',
      'Employment figures influence central bank policy',
      'Monetary policy drives currency and bond markets'
    ],
    strategies: [
      {
        name: 'Central Bank Calendar Trading',
        description: 'Trade around FOMC meetings, ECB decisions, and other central bank announcements based on policy expectations.',
        timeframe: '1-30 days around events',
        risk: 'Medium to High',
        capital: '$10,000+'
      },
      {
        name: 'Economic Data Fade Strategy',
        description: 'Fade extreme reactions to economic data releases, betting on mean reversion.',
        timeframe: '1-7 days',
        risk: 'Medium',
        capital: '$5,000+'
      },
      {
        name: 'Yield Curve Strategies',
        description: 'Trade based on changes in yield curve shape reflecting economic expectations.',
        timeframe: '3-12 months',
        risk: 'Medium',
        capital: '$25,000+'
      }
    ],
    tools: ['TradingView', 'FRED Economic Data', 'Bloomberg Terminal', 'Federal Reserve websites', 'Trading Economics'],
    learning: [
      {
        phase: 'Foundation',
        activities: [
          'Study basic economic indicators (GDP, CPI, unemployment)',
          'Understand monetary vs fiscal policy',
          'Learn to read economic calendars',
          'Practice interpreting central bank communications'
        ]
      },
      {
        phase: 'Intermediate',
        activities: [
          'Analyze historical economic cycles',
          'Study correlation between economic data and asset prices',
          'Learn to anticipate market reactions to data',
          'Practice position sizing around economic events'
        ]
      },
      {
        phase: 'Advanced',
        activities: [
          'Develop proprietary economic models',
          'Create systematic strategies based on economic data',
          'Build risk management for macroeconomic trading',
          'Master complex derivatives strategies'
        ]
      }
    ]
  },
  behavioral: {
    title: 'Behavioral Finance',
    description: 'Learn how psychological biases affect market behavior and develop strategies that exploit cognitive errors.',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    keyPoints: [
      'Markets are driven by human psychology, not just logic',
      'Fear and greed create predictable market cycles',
      'Cognitive biases create market inefficiencies',
      'Understanding crowd behavior improves trading decisions'
    ],
    strategies: [
      {
        name: 'Contrarian Indicator System',
        description: 'Use sentiment indicators to fade extreme bullish/bearish sentiment.',
        timeframe: '1-6 months',
        risk: 'Medium',
        capital: '$15,000+'
      },
      {
        name: 'Social Media Sentiment Trading',
        description: 'Trade based on sentiment analysis from social platforms and news.',
        timeframe: '1-14 days',
        risk: 'High',
        capital: '$8,000+'
      },
      {
        name: 'Momentum with Psychology Overlay',
        description: 'Combine technical momentum with sentiment analysis for entries and exits.',
        timeframe: '3-30 days',
        risk: 'Medium to High',
        capital: '$12,000+'
      }
    ],
    tools: ['Sentiment analysis platforms', 'Social media monitoring tools', 'Surveys and polls', 'Options flow analysis'],
    learning: [
      {
        phase: 'Foundation',
        activities: [
          'Study cognitive biases (anchoring, confirmation, herd behavior)',
          'Learn about market cycles and crowd psychology',
          'Understand the difference between price and value',
          'Practice identifying emotional states in markets'
        ]
      },
      {
        phase: 'Intermediate',
        activities: [
          'Study historical market manias and crashes',
          'Learn to measure market sentiment quantitatively',
          'Understand how behavioral biases affect institutional decisions',
          'Practice contrarian thinking exercises'
        ]
      },
      {
        phase: 'Advanced',
        activities: [
          'Build systematic sentiment-based strategies',
          'Develop proprietary sentiment indicators',
          'Master psychological aspects of risk management',
          'Create behavioral models for market prediction'
        ]
      }
    ]
  },
  microstructure: {
    title: 'Market Microstructure',
    description: 'Understand how markets function at the transaction level, including order flow, liquidity, and price formation.',
    icon: BarChart3,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    keyPoints: [
      'Price discovery happens at the microstructure level',
      'Order flow reveals market intentions',
      'Liquidity varies by time, venue, and market conditions',
      'High-frequency trading affects traditional strategies'
    ],
    strategies: [
      {
        name: 'Order Flow Analysis',
        description: 'Use Level II data and order flow to identify institutional buying/selling.',
        timeframe: 'Intraday to multi-day',
        risk: 'Medium to High',
        capital: '$50,000+'
      },
      {
        name: 'Market Making Strategies',
        description: 'Provide liquidity and capture spreads while managing inventory risk.',
        timeframe: 'Intraday',
        risk: 'Medium',
        capital: '$100,000+'
      },
      {
        name: 'Latency Arbitrage',
        description: 'Exploit price differences across venues with superior technology.',
        timeframe: 'Milliseconds to seconds',
        risk: 'Low',
        capital: '$500,000+'
      }
    ],
    tools: ['Level II data feeds', 'Order flow analysis software', 'Low-latency trading platforms', 'Co-location services'],
    learning: [
      {
        phase: 'Foundation',
        activities: [
          'Understand order types and how they affect execution',
          'Learn about bid-ask spreads and market depth',
          'Study basic concepts of liquidity and volatility',
          'Practice reading Level I and Level II data'
        ]
      },
      {
        phase: 'Intermediate',
        activities: [
          'Analyze order flow patterns and their meaning',
          'Understand market making and its impact on prices',
          'Study market structure across different asset classes',
          'Learn about market manipulation techniques'
        ]
      },
      {
        phase: 'Advanced',
        activities: [
          'Develop algorithms for order flow analysis',
          'Build low-latency trading systems',
          'Master inventory and risk management',
          'Create sophisticated market making strategies'
        ]
      }
    ]
  },
  technical: {
    title: 'Technical Analysis',
    description: 'Master chart patterns, indicators, and price action analysis to identify trading opportunities.',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    keyPoints: [
      'Price action discounts everything',
      'History tends to repeat itself in markets',
      'Support and resistance levels are key decision points',
      'Multiple time frame analysis improves accuracy'
    ],
    strategies: [
      {
        name: 'Price Action Trading',
        description: 'Trade based on pure price movement and candlestick patterns without indicators.',
        timeframe: '1-30 days',
        risk: 'Medium',
        capital: '$3,000+'
      },
      {
        name: 'Multi-Timeframe Momentum',
        description: 'Use multiple timeframes to identify and confirm momentum trends.',
        timeframe: '1-14 days',
        risk: 'Medium',
        capital: '$5,000+'
      },
      {
        name: 'Support/Resistance Scalping',
        description: 'Trade bounces and breaks of key support/resistance levels.',
        timeframe: 'Intraday to multi-day',
        risk: 'Medium to High',
        capital: '$2,000+'
      }
    ],
    tools: ['TradingView', 'Charting platforms', 'Price action indicators', 'Volume analysis tools'],
    learning: [
      {
        phase: 'Foundation',
        activities: [
          'Learn basic chart patterns (triangles, flags, head & shoulders)',
          'Understand support and resistance concepts',
          'Study candlestick patterns and their meanings',
          'Practice drawing trend lines and channels'
        ]
      },
      {
        phase: 'Intermediate',
        activities: [
          'Master technical indicators (RSI, MACD, moving averages)',
          'Learn multiple timeframe analysis',
          'Understand volume analysis and its significance',
          'Practice identifying and trading breakouts'
        ]
      },
      {
        phase: 'Advanced',
        activities: [
          'Develop proprietary technical indicators',
          'Create systematic technical strategies',
          'Master complex pattern recognition',
          'Build automated technical analysis systems'
        ]
      }
    ]
  },
  'risk-management': {
    title: 'Risk Management',
    description: 'Learn to protect capital, manage position sizes, and preserve trading gains through systematic risk control.',
    icon: Target,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    keyPoints: [
      'Preservation of capital is the first rule of trading',
      'Position sizing is more important than entry/exit',
      'Risk should be defined before entering trades',
      'Consistent risk management beats market timing'
    ],
    strategies: [
      {
        name: 'Fixed Fractional Position Sizing',
        description: 'Risk a fixed percentage of account on each trade for consistent risk exposure.',
        timeframe: 'All timeframes',
        risk: 'Controlled',
        capital: 'Any amount'
      },
      {
        name: 'Volatility-Based Sizing',
        description: 'Adjust position sizes based on asset volatility for consistent risk.',
        timeframe: 'All timeframes',
        risk: 'Dynamic',
        capital: '$10,000+'
      },
      {
        name: 'Portfolio Heat Management',
        description: 'Monitor and limit total portfolio exposure across all positions.',
        timeframe: 'Ongoing',
        risk: 'Portfolio-level',
        capital: '$50,000+'
      }
    ],
    tools: ['Risk calculators', 'Portfolio management software', 'Position sizing algorithms', 'Volatility indicators'],
    learning: [
      {
        phase: 'Foundation',
        activities: [
          'Calculate position sizes using basic formulas',
          'Understand risk-reward ratios and their importance',
          'Learn about stop-loss placement strategies',
          'Practice maintaining trading journals'
        ]
      },
      {
        phase: 'Intermediate',
        activities: [
          'Master advanced position sizing methods',
          'Understand correlation and portfolio risk',
          'Learn about different types of stop orders',
          'Practice risk management in different market conditions'
        ]
      },
      {
        phase: 'Advanced',
        activities: [
          'Build systematic risk management systems',
          'Develop proprietary risk models',
          'Master portfolio-level risk control',
          'Create stress testing and scenario analysis'
        ]
      }
    ]
  },
  fundamentals: {
    title: 'Fundamental Analysis',
    description: 'Analyze financial statements, economic data, and business metrics to determine intrinsic value.',
    icon: BookOpen,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    keyPoints: [
      'Market price deviates from intrinsic value',
      'Financial statements reveal business health',
      'Economic factors affect business performance',
      'Long-term value investing beats market timing'
    ],
    strategies: [
      {
        name: 'Value Investing',
        description: 'Buy undervalued stocks based on fundamental analysis and hold for long-term appreciation.',
        timeframe: '1-5 years',
        risk: 'Low to Medium',
        capital: '$25,000+'
      },
      {
        name: 'Earnings Play Strategies',
        description: 'Trade around earnings announcements based on expectations vs results.',
        timeframe: '1-7 days around earnings',
        risk: 'Medium to High',
        capital: '$5,000+'
      },
      {
        name: 'Sector Rotation',
        description: 'Allocate capital to sectors performing well in different economic cycles.',
        timeframe: '3-12 months',
        risk: 'Medium',
        capital: '$50,000+'
      }
    ],
    tools: ['Financial databases', 'SEC filings', 'Earnings calendars', 'Economic indicators'],
    learning: [
      {
        phase: 'Foundation',
        activities: [
          'Learn to read financial statements (P&L, Balance Sheet, Cash Flow)',
          'Understand key financial ratios and metrics',
          'Study basic valuation methods (P/E, P/B, DCF)',
          'Practice analyzing annual reports'
        ]
      },
      {
        phase: 'Intermediate',
        activities: [
          'Master advanced valuation techniques',
          'Understand industry analysis and competitive dynamics',
          'Learn to analyze management quality and strategy',
          'Practice building financial models'
        ]
      },
      {
        phase: 'Advanced',
        activities: [
          'Develop proprietary fundamental screens',
          'Build systematic value investing strategies',
          'Master complex financial analysis',
          'Create fundamental-driven portfolio management'
        ]
      }
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(topicsData).map((topic) => ({
    topic,
  }));
}

export async function generateMetadata({ params }: { params: { topic: string } }): Promise<Metadata> {
  const topic = topicsData[params.topic];
  
  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  return {
    title: `${topic.title} - Trading Education`,
    description: topic.description,
  };
}

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = topicsData[params.topic];

  if (!topic) {
    notFound();
  }

  const IconComponent = topic.icon;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/topics">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${topic.bgColor}`}>
            <IconComponent className={`h-8 w-8 ${topic.color}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
            <p className="text-muted-foreground text-lg">{topic.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Key Points */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Learning Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {topic.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${topic.bgColor.replace('bg-', 'bg-')}`} />
                  <p className="text-sm">{point}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategies */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trading Strategies
            </CardTitle>
            <CardDescription>
              Practical strategies you can implement for this topic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topic.strategies.map((strategy, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{strategy.name}</h4>
                    <Badge variant="secondary">{strategy.timeframe}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Risk: {strategy.risk}</span>
                    <span>Capital: {strategy.capital}</span>
                  </div>
                  {index < topic.strategies.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Essential Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {topic.tools.map((tool, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-muted" />
                    <span className="text-sm">{tool}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Learning Path */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Path
            </CardTitle>
            <CardDescription>
              Structured approach to mastering {topic.title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {topic.learning.map((phase, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full ${topic.bgColor} flex items-center justify-center`}>
                      <span className={`text-sm font-semibold ${topic.color}`}>{index + 1}</span>
                    </div>
                    <h4 className="font-semibold">{phase.phase}</h4>
                  </div>
                  <ul className="space-y-2 ml-10">
                    {phase.activities.map((activity, activityIndex) => (
                      <li key={activityIndex} className="text-sm text-muted-foreground flex items-start space-x-2">
                        <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}