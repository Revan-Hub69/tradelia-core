# Migration Cleanup Plan - P0.2 Critical Fix

## 🚨 PROBLEM: Duplicate Migrations

We have multiple versions of the same migrations causing potential conflicts:

### **MCE Duplicates**
- `005_mce_schema.sql` (original)
- `20251231092358_mce_schema.sql` (timestamped)
- `20251231092411_mce_functions.sql` (functions)
- `20251231092432_mce_functions_secure.sql` (secure version)

### **UCM Duplicates**
- `006_ucm_schema.sql` (original)
- `20251231115658_ucm_schema_step1.sql` (tables)
- `20251231115711_ucm_schema_step2.sql` (RLS policies)

### **Function Fixes Duplicates**
- `007_fix_ucm_functions.sql` (original)
- `20251231114528_fix_ucm_functions.sql` (timestamped)

## ✅ CANONICAL MIGRATION ORDER

Keep only the **most recent, secure, and complete** versions:

### **Phase 1: Core Setup**
1. `001_initial_setup.sql` ✅ Keep
2. `002_auth_preferences_tables.sql` ✅ Keep (newer than 002_fix_indicators)
3. `003_secure_rls_policies.sql` ✅ Keep
4. `004_microlearning_system.sql` ✅ Keep

### **Phase 2: MCE System**
5. `20251231092432_mce_functions_secure.sql` ✅ Keep (most secure version)

### **Phase 3: UCM System**
6. `20251231115658_ucm_schema_step1.sql` ✅ Keep (tables)
7. `20251231115711_ucm_schema_step2.sql` ✅ Keep (RLS policies)

### **Phase 4: Infrastructure**
8. `20251231120554_distributed_locks_table.sql` ✅ Keep

### **Phase 5: Latest Fixes**
9. `20251231114528_fix_ucm_functions.sql` ✅ Keep (most recent)

## 🗑️ FILES TO DELETE

### **Duplicates to Remove**
- `002_fix_indicators_policies.sql` (older than 002_auth_preferences)
- `005_mce_schema.sql` (superseded by timestamped secure version)
- `006_ucm_schema.sql` (superseded by step1+step2)
- `007_fix_ucm_functions.sql` (superseded by timestamped version)
- `20251231092358_mce_schema.sql` (superseded by secure version)
- `20251231092411_mce_functions.sql` (superseded by secure version)

### **Legacy/Redundant**
- `20250101000000_init.sql` (redundant with 001_initial_setup)
- `20251224135106_add_admin_whitelist.sql` (if covered by auth_preferences)
- `20251229152755_create_dashboard_tables.sql` (if not needed)
- `20251229152906_enable_rls_and_fix_security.sql` (covered by 003_secure_rls)
- `20251229164317_add_auth_preferences_system.sql` (covered by 002_auth_preferences)
- `20251229164337_fix_function_search_path.sql` (if redundant)
- `20251229184618_secure_rls_policies.sql` (covered by 003_secure_rls)

## 📋 FINAL CANONICAL ORDER

```
001_initial_setup.sql
002_auth_preferences_tables.sql  
003_secure_rls_policies.sql
004_microlearning_system.sql
005_mce_functions_secure.sql (renamed from 20251231092432)
006_ucm_schema_step1.sql (renamed from 20251231115658)
007_ucm_schema_step2.sql (renamed from 20251231115711)
008_distributed_locks_table.sql (renamed from 20251231120554)
009_fix_ucm_functions.sql (renamed from 20251231114528)
```

## 🔧 IMPLEMENTATION STEPS

1. **Backup current state**
2. **Delete duplicate files**
3. **Rename timestamped files to sequential numbers**
4. **Test migration order on clean database**
5. **Update documentation**
6. **Commit canonical migration set**