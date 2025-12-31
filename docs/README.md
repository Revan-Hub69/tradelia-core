# Tradelia Documentation

**🎯 OVERVIEW PRINCIPALE**: [`project-overview.md`](project-overview.md)

## Market Context Engine (MCE)

Il Market Context Engine è il primo mattoncino dell'infrastruttura di trading AI di Tradelia, implementando classificazione deterministica dei regimi di mercato.

### 📋 Documentation Structure

#### 🎯 Start Here
- **[Project Overview](project-overview.md)** - **LEGGI QUESTO PRIMA** - Panoramica completa del progetto

#### Core Architecture
- **[Design v2](mce-design-v2.md)** - System architecture and components
- **[Canonical Output](mce-canonical-output-v2.md)** - Standardized output format
- **[Validation KPIs](mce-validation-kpi-v2.md)** - Metrics and validation criteria

#### Implementation
- **[Free Tier Architecture](mce-free-tier-architecture.md)** - Zero-cost implementation using Vercel + GitHub Actions + Supabase

#### Development Workflow
- **[Requirements](../.kiro/specs/market-context-engine/requirements.md)** - EARS-compliant requirements
- **[Tasks](../.kiro/specs/market-context-engine/tasks.md)** - Implementation plan and tasks

### 🎯 Principles

- **Deterministic Core**: Same input → Same output (bit-per-bit)
- **Progressive Activation**: MAX architecture, incremental deployment
- **Free-First**: Start with zero-cost infrastructure ($0/mese)
- **Strategy Agnostic**: Constrains strategy selection, doesn't imply trading actions

### 🚀 Quick Start

1. **📋 Read Overview**: Start with [Project Overview](project-overview.md) - **ESSENZIALE**
2. **🏗️ Understand Architecture**: Review [Design v2](mce-design-v2.md)
3. **📊 Check Output**: See [Canonical Output](mce-canonical-output-v2.md)
4. **💰 Implementation**: Follow [Free Tier Architecture](mce-free-tier-architecture.md)
5. **🔧 Start Building**: Execute [Tasks](../.kiro/specs/market-context-engine/tasks.md)

### 📊 Current Status

- ✅ **Requirements**: Complete (EARS-compliant)
- ✅ **Architecture**: Complete (v2 separated)
- ✅ **Output Format**: Complete (canonical)
- ✅ **KPI Metrics**: Complete (validation)
- ✅ **Free Tier Plan**: Complete (implementation)
- ✅ **Documentation**: Complete (organized)
- 🔄 **Implementation**: Ready to start

---

*Last updated: December 2024*