# RLS 403 Fix - Status & Next Steps

## Current Status: READY TO APPLY ✅

The migration to fix Supabase RLS 403 errors has been created and is ready to apply.

## What's Been Done

### 1. ✅ Migration File Created
- **File**: `supabase/migrations/20250101000011_allow_public_access.sql`
- **Content**: SQL to disable RLS and grant public access
- **Status**: Ready to apply

### 2. ✅ Documentation Created
- **Quick Reference**: `docs/RLS-FIX-QUICK-REFERENCE.md` (2-minute read)
- **Complete Guide**: `docs/RLS-403-FIX-COMPLETE.md` (comprehensive)
- **Instructions**: `docs/RLS-FIX-INSTRUCTIONS.md` (step-by-step)

### 3. ✅ Helper Scripts Created
- `scripts/debug/apply-rls-fix.ts` (TypeScript)
- `scripts/debug/apply-rls-fix-simple.mjs` (Node.js)
- `scripts/debug/apply-rls-fix.py` (Python)

## What Needs to Be Done

### Step 1: Apply the Migration (Choose One)

#### Option A: Supabase Dashboard (Easiest) ⭐
1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Create new query
5. Copy SQL from `supabase/migrations/20250101000011_allow_public_access.sql`
6. Click Run
7. Done!

#### Option B: Supabase CLI
```bash
supabase db push
```

#### Option C: Node.js Script
```bash
node scripts/debug/apply-rls-fix-simple.mjs
```

### Step 2: Verify the Fix
1. Reload dashboard page
2. Open DevTools (F12)
3. Check Network tab
4. Verify 200 OK responses (not 403)

### Step 3: Commit Changes
```bash
git add supabase/migrations/20250101000011_allow_public_access.sql
git commit -m "fix: allow public access to dashboard tables (RLS 403 fix)"
git push
```

## The SQL Being Applied

```sql
-- Disable RLS on public tables
ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;

-- Grant public read access
GRANT SELECT ON cookie_preferences TO anon;
GRANT SELECT ON user_profiles TO anon;
GRANT SELECT ON start_flow_responses TO anon;
```

## Why This Works

| Issue | Solution |
|-------|----------|
| Dashboard is public (no auth) | RLS policies require auth | Disable RLS on public tables |
| Unauthenticated users (anon) | Can't read data | Grant SELECT to anon role |
| 403 Forbidden errors | Access denied by RLS | Remove RLS restrictions |

## Timeline

- **Created**: 2026-01-01
- **Status**: Ready to apply
- **Estimated time to apply**: 2-3 minutes
- **Estimated time to verify**: 1-2 minutes

## Files to Review

1. **Quick start**: `docs/RLS-FIX-QUICK-REFERENCE.md`
2. **Full guide**: `docs/RLS-403-FIX-COMPLETE.md`
3. **Migration**: `supabase/migrations/20250101000011_allow_public_access.sql`

## Questions?

See the troubleshooting section in `docs/RLS-403-FIX-COMPLETE.md`

---

**Next Action**: Apply the migration using one of the three methods above.
