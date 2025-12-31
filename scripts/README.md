# Scripts Organization - Production Discipline

## 🎯 **CANONICAL ENTRYPOINTS** (Production Only)

### **Production Scripts** (`scripts/prod/`)
These are the ONLY scripts that should be used for production execution:

#### **MCE Pipeline**
```bash
# CANONICAL entrypoint for MCE production execution
node scripts/prod/mce-pipeline.mjs

# Health check
node scripts/prod/mce-pipeline.mjs --health

# Verbose logging
node scripts/prod/mce-pipeline.mjs --verbose
```

#### **UCM Pipeline**
```bash
# CANONICAL entrypoint for UCM production execution  
node scripts/prod/ucm-pipeline.mjs

# Health check
node scripts/prod/ucm-pipeline.mjs --health

# Verbose logging
node scripts/prod/ucm-pipeline.mjs --verbose
```

### **Key Production Features**
- ✅ **Distributed Locking**: Prevents concurrent runs
- ✅ **Circuit Breakers**: Protects against external API failures
- ✅ **Structured Logging**: JSON format with timestamps and run IDs
- ✅ **Health Validation**: Pre-flight checks before execution
- ✅ **KPI Monitoring**: Validates operational metrics
- ✅ **Error Handling**: Graceful shutdown and proper exit codes
- ✅ **TypeScript Fallback**: Automatic tsx execution if JS fails

## 🧪 **Development Scripts** (`scripts/dev/`)

### **Simulation Scripts**
For development, testing, and debugging only:

#### **MCE Simulation**
```bash
# Simulate MCE pipeline with real Binance data
node scripts/dev/mce-simulate.mjs
```

#### **UCM Simulation**  
```bash
# Simulate UCM pipeline with real Binance data
node scripts/dev/ucm-simulate.mjs
```

### **Test Scripts**
```bash
# Test individual components
node scripts/dev/test-binance-client.mjs
node scripts/dev/test-health-check.mjs
node scripts/dev/test-ucm-pipeline.mjs
node scripts/dev/test-ucm-simple.mjs
node scripts/dev/test-production-deploy.mjs

# Populate test data
node scripts/dev/populate-mce-data.mjs
```

## 🚨 **CRITICAL RULES**

### **Production Discipline**
1. **ONE CANONICAL ENTRYPOINT** per pipeline
   - MCE: `scripts/prod/mce-pipeline.mjs` ONLY
   - UCM: `scripts/prod/ucm-pipeline.mjs` ONLY

2. **NO DRY RUN in Production**
   - Production scripts reject `--dry-run` flag
   - Use dev scripts for testing

3. **Structured Logging**
   - All production logs in JSON format
   - Include: timestamp, level, service, runId, message, data

4. **Health Checks First**
   - Always run `--health` before production execution
   - Pipeline freshness validation (< 15 minutes)

### **Development Guidelines**
1. **Simulation vs Real**
   - Dev scripts use real Binance API but don't save to production DB
   - Clear labeling of simulation vs real data

2. **Testing Isolation**
   - Test scripts don't interfere with production data
   - Use separate test databases when possible

3. **Documentation**
   - Each script has clear purpose and usage instructions
   - Distinguish between simulation and real execution

## 📊 **GitHub Actions Integration**

### **Production Workflows**
```yaml
# MCE Pipeline (every 5 minutes)
- name: Run MCE Pipeline
  run: node scripts/prod/mce-pipeline.mjs --verbose

# UCM Pipeline (every 5 minutes)  
- name: Run UCM Pipeline
  run: node scripts/prod/ucm-pipeline.mjs --verbose

# Health Check (every minute)
- name: Health Check
  run: |
    node scripts/prod/mce-pipeline.mjs --health
    node scripts/prod/ucm-pipeline.mjs --health
```

### **Development Workflows**
```yaml
# Testing (on PR)
- name: Test MCE Simulation
  run: node scripts/dev/mce-simulate.mjs

- name: Test UCM Simulation  
  run: node scripts/dev/ucm-simulate.mjs
```

## 🔍 **Monitoring & Validation**

### **Health Check Endpoints**
```bash
# System health (includes pipeline freshness)
curl https://your-domain.com/api/health

# Expected response for healthy system:
{
  "status": "healthy",
  "checks": [
    {"name": "database", "status": "healthy"},
    {"name": "binance_api", "status": "healthy"}, 
    {"name": "pipeline_status", "status": "healthy"},
    {"name": "memory_usage", "status": "healthy"},
    {"name": "circuit_breakers", "status": "healthy"}
  ]
}
```

### **KPI Validation**
Production scripts automatically validate:
- ✅ Universe size (12-25 symbols)
- ✅ Turnover rate (< 50%)
- ✅ Core symbols included
- ✅ Pipeline freshness (< 15 minutes)
- ✅ Data quality thresholds

## 🎯 **Operational Readiness Checklist**

### **Before Production Deployment**
- [ ] Run health checks: `node scripts/prod/*-pipeline.mjs --health`
- [ ] Validate KPIs with simulation: `node scripts/dev/*-simulate.mjs`
- [ ] Check system health endpoint: `curl /api/health`
- [ ] Verify distributed locks working
- [ ] Confirm circuit breakers configured
- [ ] Test graceful shutdown (SIGTERM/SIGINT)

### **Production Monitoring**
- [ ] Pipeline runs every 5 minutes
- [ ] Health checks every minute  
- [ ] Turnover rate < 0.2/hour
- [ ] No pipeline runs > 15 minutes old
- [ ] Error rate < 0.1%
- [ ] API response time < 200ms p95

## 📝 **Migration from Old Scripts**

### **Deprecated Scripts** (DO NOT USE)
- ❌ `scripts/mce-run-once.mjs` → Use `scripts/prod/mce-pipeline.mjs`
- ❌ `scripts/ucm-run-once.mjs` → Use `scripts/prod/ucm-pipeline.mjs`  
- ❌ `scripts/mce-run-once-fixed.mjs` → Use `scripts/prod/mce-pipeline.mjs`

### **GitHub Actions Updates Required**
```yaml
# OLD (deprecated)
- run: node scripts/mce-run-once.mjs

# NEW (production-ready)
- run: node scripts/prod/mce-pipeline.mjs --verbose
```

This organization ensures **operational discipline**, **clear separation of concerns**, and **production reliability**. 

**Remember**: One canonical entrypoint per pipeline, no exceptions.