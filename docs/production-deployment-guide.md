# Production Deployment Guide - Market Data Integration Phase 1

## Overview

Guida completa per il deployment in produzione del sistema Market Data Integration Phase 1. Include configurazione, sicurezza, monitoraggio e procedure operative per un ambiente production-ready.

## 🚀 Pre-Deployment Checklist

### ✅ Infrastructure Requirements

#### Server Specifications
- **CPU**: Minimum 2 cores, Recommended 4+ cores
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB SSD, Recommended 50GB+ SSD
- **Network**: Stable internet connection with low latency to Binance
- **OS**: Linux (Ubuntu 20.04+ recommended) or compatible container platform

#### Database Requirements
- **Supabase Pro Plan** or higher for production workloads
- **Connection Limits**: Minimum 20 concurrent connections
- **Storage**: Minimum 10GB, auto-scaling enabled
- **Backup**: Automated daily backups configured
- **Monitoring**: Database performance monitoring enabled

#### External Services
- **Binance API Access**: Valid API keys with appropriate permissions
- **SSL Certificate**: Valid SSL certificate for HTTPS
- **Domain**: Configured domain with DNS pointing to server
- **Monitoring**: External monitoring service (optional but recommended)

### ✅ Security Configuration

#### Environment Variables
```bash
# Copy production environment template
cp .env.production.example .env.local

# Generate secure secrets
openssl rand -hex 32  # For API_KEY_SALT
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For ENCRYPTION_KEY
```

#### API Keys Setup
```sql
-- Create production API keys
INSERT INTO api_keys (
  key_hash,
  role,
  permissions,
  rate_limit_tier,
  name,
  description
) VALUES (
  encode(digest('your-secure-api-key' || 'your-api-key-salt', 'sha256'), 'hex'),
  'admin',
  ARRAY['*'],
  'enterprise',
  'Production Admin Key',
  'Main production API key for system administration'
);
```

#### Firewall Configuration
```bash
# Allow only necessary ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (redirect to HTTPS)
ufw allow 443/tcp   # HTTPS
ufw enable
```

### ✅ Application Configuration

#### Production Environment
```bash
# Set production environment
export NODE_ENV=production

# Configure memory limits
export NODE_OPTIONS="--max-old-space-size=1024"

# Enable production optimizations
export NEXT_TELEMETRY_DISABLED=1
```

#### Database Migration
```bash
# Run all migrations
npm run db:migrate

# Verify migration status
npm run db:status

# Create initial admin user (if needed)
npm run db:seed:admin
```

## 🔧 Deployment Steps

### Step 1: Server Preparation

#### 1.1 System Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy
sudo apt install nginx -y
```

#### 1.2 Application Setup
```bash
# Clone repository
git clone https://github.com/your-org/tradelia-core.git
cd tradelia-core

# Install dependencies
npm ci --production

# Build application
npm run build

# Set up environment
cp .env.production.example .env.local
# Edit .env.local with your production values
```

### Step 2: Database Setup

#### 2.1 Supabase Configuration
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

#### 2.2 Initial Data Setup
```sql
-- Create default service API key
SELECT * FROM generate_api_key(
  'service',
  ARRAY['*'],
  'enterprise',
  'System Service Key'
);

-- Verify tables are created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%market%';
```

### Step 3: Application Deployment

#### 3.1 PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'tradelia-market-data',
    script: 'npm',
    args: 'start',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

#### 3.2 Start Application
```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### Step 4: Reverse Proxy Setup

#### 4.1 Nginx Configuration
```nginx
# /etc/nginx/sites-available/tradelia
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
```

#### 4.2 Enable Nginx Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tradelia /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## 📊 Monitoring Setup

### System Monitoring

#### 4.1 PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# View real-time monitoring
pm2 monit

# Setup log rotation
pm2 install pm2-logrotate
```

#### 4.2 Health Checks
```bash
# Test health endpoint
curl -f http://localhost:3000/api/health/detailed

# Setup external monitoring (example with curl)
*/5 * * * * curl -f https://yourdomain.com/api/health || echo "Health check failed" | mail -s "Alert" admin@yourdomain.com
```

### Application Monitoring

#### 4.3 Market Data Monitoring
```bash
# Test market data status
curl -H "X-API-Key: your-api-key" https://yourdomain.com/api/market-data/status

# Monitor WebSocket connections
curl -H "X-API-Key: your-api-key" https://yourdomain.com/api/market-data/connections
```

## 🔄 Operational Procedures

### Daily Operations

#### Morning Checklist
- [ ] Check system health: `curl https://yourdomain.com/api/health`
- [ ] Verify market data flow: Check `/api/market-data/status`
- [ ] Review overnight logs: `pm2 logs --lines 100`
- [ ] Check database performance: Monitor Supabase dashboard
- [ ] Verify backup completion: Check backup logs

#### Evening Checklist
- [ ] Review daily KPIs: Check Phase 1 readiness metrics
- [ ] Monitor memory usage: `pm2 monit`
- [ ] Check error rates: Review application logs
- [ ] Verify data integrity: Run data validation queries
- [ ] Plan maintenance windows: Schedule updates if needed

### Weekly Operations

#### System Maintenance
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies (test first!)
npm audit
npm update

# Restart application
pm2 restart all

# Clean up logs
pm2 flush
```

#### Database Maintenance
```sql
-- Clean up old market events (keep 7 days)
SELECT cleanup_old_market_events(7);

-- Analyze database performance
ANALYZE;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Emergency Procedures

#### System Recovery
```bash
# If application crashes
pm2 restart all

# If database connection fails
pm2 restart tradelia-market-data

# If WebSocket connection fails
# Check logs first
pm2 logs tradelia-market-data --lines 50

# Force restart if needed
pm2 delete tradelia-market-data
pm2 start ecosystem.config.js
```

#### Data Recovery
```sql
-- If data corruption detected
-- 1. Stop application
-- 2. Restore from backup
-- 3. Verify data integrity
-- 4. Restart application

-- Check data integrity
SELECT COUNT(*) FROM market_events WHERE created_at > NOW() - INTERVAL '1 hour';
SELECT COUNT(*) FROM market_candles WHERE created_at > NOW() - INTERVAL '1 hour';
```

## 🚨 Alerting Configuration

### Critical Alerts
- System down (health check fails)
- Database connection lost
- WebSocket disconnection > 5 minutes
- Memory usage > 90%
- Error rate > 5%

### Warning Alerts
- Memory usage > 70%
- Response time > 2 seconds
- WebSocket reconnection
- Circuit breaker open
- Disk space < 20%

### Alert Channels
```bash
# Slack webhook example
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🚨 CRITICAL: Market Data System Down"}' \
  $ALERTING_WEBHOOK_URL

# Email alert example
echo "System health check failed" | mail -s "CRITICAL ALERT" admin@yourdomain.com
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Create additional indexes for performance
CREATE INDEX CONCURRENTLY idx_market_events_symbol_timestamp_partial 
ON market_events(symbol, timestamp) 
WHERE timestamp > NOW() - INTERVAL '24 hours';

-- Optimize queries
EXPLAIN ANALYZE SELECT * FROM market_events 
WHERE symbol = 'BTCUSDT' 
AND timestamp > NOW() - INTERVAL '1 hour';
```

### Application Optimization
```bash
# Enable Node.js performance monitoring
export NODE_OPTIONS="--max-old-space-size=1024 --inspect=0.0.0.0:9229"

# Monitor garbage collection
node --trace-gc app.js

# Profile memory usage
node --prof app.js
```

## 🔐 Security Hardening

### System Security
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Setup fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban

# Configure automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

### Application Security
```bash
# Rotate API keys regularly
# Generate new key
NEW_KEY=$(openssl rand -hex 32)

# Update in database
# Update in environment variables
# Restart application
```

## 📋 Troubleshooting Guide

### Common Issues

#### WebSocket Connection Issues
```bash
# Check network connectivity
ping stream.binance.com

# Check firewall
sudo ufw status

# Check application logs
pm2 logs tradelia-market-data | grep -i websocket
```

#### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
# Monitor Supabase dashboard

# Restart application
pm2 restart tradelia-market-data
```

#### Memory Issues
```bash
# Check memory usage
free -h
pm2 monit

# Restart if needed
pm2 restart tradelia-market-data

# Check for memory leaks
node --inspect app.js
```

## 🎯 Success Metrics

### System Performance
- **Uptime**: > 99.9%
- **Response Time**: < 200ms (95th percentile)
- **Memory Usage**: < 80% of allocated
- **CPU Usage**: < 70% average
- **Database Connections**: < 80% of pool

### Market Data Quality
- **WebSocket Uptime**: > 99.5%
- **Data Latency**: < 100ms
- **Event Processing**: > 1000 events/second
- **Data Integrity**: 100% (no missing events)
- **Candle Accuracy**: 100% (deterministic)

### Business Metrics
- **Paper Trades**: > 100 completed trades
- **Win Rate**: Tracked and reported
- **Phase 1 Readiness**: GREEN status
- **System Reliability**: Zero data loss
- **Audit Compliance**: 100% event logging

---

**Status**: 🟢 **PRODUCTION READY**  
**Deployment Time**: ~4 hours for full setup  
**Maintenance Window**: Weekly 2-hour window recommended  
**Support**: 24/7 monitoring with automated alerts