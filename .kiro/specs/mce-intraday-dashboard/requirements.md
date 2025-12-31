# MCE + Dashboard Intraday - Requirements

## Introduction

Sviluppo integrato del Market Context Engine (MCE) e della Dashboard Crypto Intraday. L'approccio combina lo sviluppo del motore deterministico con l'interfaccia utente per validazione pratica immediata e feedback loop rapido.

## Glossary

- **MCE**: Market Context Engine - Motore di classificazione regime di mercato
- **Dashboard_Intraday**: Interfaccia utente per trading/analisi intraday
- **RegimeSignature**: Output canonico del sistema MCE
- **PriceRegime**: Classificazione trend + volatilità del mercato
- **DataQuality**: Metriche di completezza e affidabilità dei dati
- **RealtimeEngine**: Versione semplificata del MCE per uso immediato

## Requirements

### Requirement 1: Realtime MCE Engine (Simplified)

**User Story:** As a trader, I want real-time market regime classification, so that I can understand current market conditions for intraday decisions.

#### Acceptance Criteria

1. THE System SHALL classify market regime in real-time for BTCUSDT
2. THE System SHALL provide trend classification (up, down, range)
3. THE System SHALL provide volatility classification (compressed, normal, expanded)
4. THE System SHALL update regime every 1 minute
5. THE System SHALL calculate confidence score (0.0-1.0)
6. THE System SHALL track data quality metrics
7. THE System SHALL persist regime history for analysis

### Requirement 2: Dashboard Intraday Interface

**User Story:** As a trader, I want an intraday dashboard, so that I can monitor market conditions and make informed decisions.

#### Acceptance Criteria

1. THE Dashboard SHALL display current market regime prominently
2. THE Dashboard SHALL show regime confidence and data quality
3. THE Dashboard SHALL display regime history timeline
4. THE Dashboard SHALL show price chart with regime overlays
5. THE Dashboard SHALL provide regime change alerts
6. THE Dashboard SHALL display key metrics (ATR, volatility percentiles)
7. THE Dashboard SHALL update in real-time without page refresh

### Requirement 3: Data Ingestion (Binance REST)

**User Story:** As a system operator, I want reliable data ingestion, so that the MCE has accurate market data for classification.

#### Acceptance Criteria

1. THE System SHALL fetch kline data from Binance REST API
2. THE System SHALL handle 1m, 5m, 15m, 1h, 4h timeframes
3. THE System SHALL validate and normalize incoming data
4. THE System SHALL handle API rate limits gracefully
5. THE System SHALL detect and handle missing data gaps
6. THE System SHALL store data in Supabase with proper indexing
7. THE System SHALL provide data quality monitoring

### Requirement 4: Feature Calculation Engine

**User Story:** As a system analyst, I want accurate feature calculations, so that regime classification is based on solid technical analysis.

#### Acceptance Criteria

1. THE System SHALL calculate ATR (14, 50 periods)
2. THE System SHALL calculate volatility percentiles (7d, 30d windows)
3. THE System SHALL calculate trend indicators (EMA crossovers)
4. THE System SHALL calculate volume-based indicators
5. THE System SHALL normalize features for regime classification
6. THE System SHALL validate no-lookahead in calculations
7. THE System SHALL cache recent calculations for performance

### Requirement 5: Regime Classification Logic

**User Story:** As a quantitative analyst, I want consistent regime classification, so that I can rely on the system for market analysis.

#### Acceptance Criteria

1. THE System SHALL use rule-based classification (no ML in v1)
2. WHEN ATR percentile < 30%, THE System SHALL classify volatility as "compressed"
3. WHEN ATR percentile > 70%, THE System SHALL classify volatility as "expanded"
4. WHEN trend strength > threshold, THE System SHALL classify trend as "up" or "down"
5. WHEN trend strength < threshold, THE System SHALL classify trend as "range"
6. THE System SHALL apply smoothing to prevent excessive regime flipping
7. THE System SHALL calculate confidence based on signal strength

### Requirement 6: Real-time Updates

**User Story:** As a trader, I want real-time updates, so that I can react quickly to regime changes.

#### Acceptance Criteria

1. THE System SHALL update data every 60 seconds
2. THE System SHALL detect regime changes within 2 minutes
3. THE Dashboard SHALL reflect updates without manual refresh
4. THE System SHALL use Server-Sent Events for real-time communication
5. THE System SHALL handle connection failures gracefully
6. THE System SHALL provide connection status indicator
7. THE System SHALL queue updates during disconnections

### Requirement 7: Historical Analysis

**User Story:** As an analyst, I want historical regime data, so that I can analyze regime patterns and performance.

#### Acceptance Criteria

1. THE System SHALL store all regime signatures with timestamps
2. THE System SHALL provide regime history API endpoints
3. THE Dashboard SHALL display regime timeline (24h, 7d, 30d views)
4. THE System SHALL calculate regime statistics (duration, frequency)
5. THE System SHALL support regime performance analysis
6. THE System SHALL export historical data in CSV format
7. THE System SHALL maintain data for at least 90 days

### Requirement 8: Performance and Reliability

**User Story:** As a system operator, I want reliable performance, so that traders can depend on the system during market hours.

#### Acceptance Criteria

1. THE System SHALL process updates within 5 seconds of data availability
2. THE System SHALL maintain 99.5% uptime during market hours
3. THE System SHALL handle Binance API outages gracefully
4. THE System SHALL provide system health monitoring
5. THE System SHALL log all errors with proper context
6. THE System SHALL recover automatically from transient failures
7. THE System SHALL alert on system degradation

### Requirement 9: Free Tier Compatibility

**User Story:** As a developer, I want to deploy on free tier, so that I can validate the system without infrastructure costs.

#### Acceptance Criteria

1. THE System SHALL run on Vercel free tier (frontend)
2. THE System SHALL use Supabase free tier (database)
3. THE System SHALL use GitHub Actions for data processing
4. THE System SHALL respect all free tier limits
5. THE System SHALL optimize for minimal resource usage
6. THE System SHALL provide cost monitoring
7. THE System SHALL gracefully degrade under limits

### Requirement 10: Security and Configuration

**User Story:** As a system administrator, I want secure configuration management, so that API keys and sensitive data are protected.

#### Acceptance Criteria

1. THE System SHALL store API keys in environment variables
2. THE System SHALL use Supabase RLS for data security
3. THE System SHALL validate all external API responses
4. THE System SHALL rate limit dashboard API calls
5. THE System SHALL log security events
6. THE System SHALL support configuration updates without deployment
7. THE System SHALL encrypt sensitive data at rest

## Implementation Constraints

### Technology Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Vercel Edge Functions + Supabase
- **Database**: Supabase PostgreSQL
- **Data Processing**: GitHub Actions (scheduled)
- **Real-time**: Server-Sent Events
- **Charts**: Lightweight charting library (Chart.js or similar)

### Free Tier Limits
- **Vercel**: 100GB bandwidth, 1000 serverless function invocations
- **Supabase**: 500MB database, 2GB bandwidth
- **GitHub Actions**: 2000 minutes/month
- **Binance API**: 1200 requests/minute

### Performance Targets
- **Data Update Latency**: <5 seconds
- **Dashboard Load Time**: <2 seconds
- **Regime Classification**: <1 second
- **API Response Time**: <500ms
- **Database Query Time**: <100ms

## Success Criteria

The integrated MCE + Dashboard system is considered **operationally complete** when:

1. **Real-time Classification**: BTCUSDT regime updates every minute
2. **Dashboard Functionality**: All UI components working and updating
3. **Data Quality**: >99% data completeness over 24h period
4. **Performance**: All latency targets met consistently
5. **Reliability**: 24h continuous operation without failures
6. **Free Tier Compliance**: All resource usage within limits

## Validation Protocol

1. **Week 1**: Basic data ingestion + simple regime classification
2. **Week 2**: Dashboard UI + real-time updates
3. **Week 3**: Historical analysis + performance optimization
4. **Week 4**: 7-day continuous operation validation

**Final Test**: 7-day continuous operation with real-time dashboard updates and regime classification accuracy validation.